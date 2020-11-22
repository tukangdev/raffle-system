import { NextApiRequest, NextApiResponse } from "next";
import firebase from "../../../lib/firebase";
import { ResponseData } from "../../../types";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const namesRef = firebase.firestore.collection("names");
  if (req.method === "GET") {
    try {
      const { perPage, go, firstAnchorId, lastAnchorId, q } = req.query;

      // all documents
      const docs = q
        ? namesRef
            .orderBy("name")
            .startAt(q)
            .endAt(q + "\uf8ff")
        : namesRef.orderBy("name");

      const docsWithLimit = q
        ? namesRef
            .orderBy("name")
            .startAt(q)
            .endAt(q + "\uf8ff")
            .limit(parseInt(perPage as string))
        : namesRef.orderBy("name").limit(parseInt(perPage as string));
      // snapshot of all documentd
      const snapshot = await docs.get();
      const snapshotWithLimit = await docsWithLimit.get();

      const veryFirstAnchorData = snapshot.docs[0].data();
      const veryLastAnchorData = snapshot.docs[snapshot.docs.length - 1].data();

      const startBatch = veryFirstAnchorData
        ? namesRef
            .orderBy("name")
            .startAt(veryFirstAnchorData.name)
            .limit(parseInt(perPage as string))
        : undefined;

      const endBatch = veryLastAnchorData
        ? namesRef
            .orderBy("name")
            .endAt(veryLastAnchorData.name)
            .limitToLast(parseInt(perPage as string))
        : undefined;

      if (firstAnchorId && lastAnchorId) {
        const firstAnchorDoc = await namesRef
          .doc(firstAnchorId as string)
          .get();
        const firstAnchorData = firstAnchorDoc.data();

        const lastAnchorDoc = await namesRef.doc(lastAnchorId as string).get();
        const lastAnchorData = lastAnchorDoc.data();

        const nextBatch = lastAnchorData
          ? namesRef
              .orderBy("name")
              .startAfter(lastAnchorData.name)
              .limit(parseInt(perPage as string))
          : undefined;
        const prevBatch = firstAnchorData
          ? namesRef
              .orderBy("name")
              .endBefore(firstAnchorData.name)
              .limitToLast(parseInt(perPage as string))
          : undefined;

        switch (go) {
          case "next": {
            if (nextBatch) {
              const nextBatchRes = await nextBatch.get();

              res.status(200);
              res.json({
                total: snapshot.docs.length,
                items: nextBatchRes.docs.map((doc) => ({
                  id: doc.id,
                  ...doc.data(),
                })),
              });
              break;
            }
          }
          case "prev": {
            if (prevBatch) {
              const prevBatchRes = await prevBatch.get();

              res.status(200);
              res.json({
                total: snapshot.docs.length,
                items: prevBatchRes.docs.map((doc) => ({
                  id: doc.id,
                  ...doc.data(),
                })),
              });
              break;
            }
          }
          case "start": {
            if (startBatch) {
              const startBatchRes = await startBatch.get();

              res.status(200);
              res.json({
                total: snapshot.docs.length,
                items: startBatchRes.docs.map((doc) => ({
                  id: doc.id,
                  ...doc.data(),
                })),
              });
              break;
            }
          }
          case "last": {
            if (endBatch) {
              const endBatchRes = await endBatch.get();

              res.status(200);
              res.json({
                total: snapshot.docs.length,
                items: endBatchRes.docs.map((doc) => ({
                  id: doc.id,
                  ...doc.data(),
                })),
              });
              break;
            }
          }
          default: {
            await returnFirstQuery(res, snapshot, snapshotWithLimit);
          }
        }
      } else {
        // Return first query on first load on clientside.
        await returnFirstQuery(res, snapshot, snapshotWithLimit);
      }
    } catch (err) {
      console.error(err);
      res.status(500);
      res.statusMessage = err;
    }
  }

  if (req.method === "POST") {
    const { name } = req.body;

    if (!name) {
      res.status(400);
      res.statusMessage = "Name is missing!";
    }

    try {
      const result = await namesRef.add({
        name,
      });

      const doc = await namesRef.doc(result.id).get();

      res.status(200);
      res.json({ data: { id: doc.id, ...doc.data() } });
    } catch (err) {
      console.error(err);
      res.status(500);
      res.statusMessage = err;
    }
  }

  if (req.method === "DELETE") {
    try {
      const { names } = req.body;

      if (!names.length) {
        res.status(400);
        res.statusMessage = "Empty array of names.";
        return;
      }

      const batch = firebase.firestore.batch();
      names.forEach((id: string) => {
        const ref = namesRef.doc(id);
        batch.delete(ref);
      });
      await batch.commit();

      res.status(200).send({});
    } catch (err) {
      console.error(err);
      res.status(500);
      res.statusMessage = err;
    }
  }
};
async function returnFirstQuery(
  res: NextApiResponse<any>,
  snapshot: FirebaseFirestore.QuerySnapshot<FirebaseFirestore.DocumentData>,
  snapshotWithLimit: FirebaseFirestore.QuerySnapshot<
    FirebaseFirestore.DocumentData
  >
) {
  res.status(200);
  res.json({
    total: snapshot.docs.length,
    items: snapshotWithLimit.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })),
  });
}
