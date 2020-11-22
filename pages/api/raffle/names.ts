import { NextApiRequest, NextApiResponse } from "next";
import firebase from "../../../lib/firebase";
import { ResponseData } from "../../../types";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const namesRef = firebase.firestore.collection("names");
  if (req.method === "GET") {
    try {
      const { perPage, go, firstAnchorId, lastAnchorId } = req.query;

      // all documents
      const docs = namesRef.orderBy("name");
      // snapshot of all documentd
      const snapshot = await docs.get();

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

      console.log(firstAnchorId, lastAnchorId);

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

              console.log(
                "next",
                nextBatchRes.docs.map((doc) => ({
                  id: doc.id,
                  ...doc.data(),
                }))
              );

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

              console.log(
                "prev",
                prevBatchRes.docs.map((doc) => ({
                  id: doc.id,
                  ...doc.data(),
                }))
              );

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

              console.log(
                "start",
                startBatchRes.docs.map((doc) => ({
                  id: doc.id,
                  ...doc.data(),
                }))
              );

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

              console.log(
                "last",
                endBatchRes.docs.map((doc) => ({
                  id: doc.id,
                  ...doc.data(),
                }))
              );

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
            await returnFirstQuery(namesRef, perPage, res, snapshot);
          }
        }
      } else {
        // Return first query on first load on clientside.
        await returnFirstQuery(namesRef, perPage, res, snapshot);
      }

      // const last = snapshot.docs[snapshot.docs.length - 1];
      // const start = snapshot.docs[0];

      // const previous = namesRef
      //   .orderBy("name")
      //   .endAt(last.data().name)
      //   .limit(parseInt(req.query.perPage as string));

      // const next = namesRef
      //   .orderBy("name")
      //   .startAfter(last.data().name)
      //   .limit(parseInt(req.query.perPage as string));

      // switch (req.query.go) {
      //   case "next": {
      //     const s = await next.get();
      //     res.status(200);
      //     res.json({
      //       items: s.docs.map((doc) => ({ id: doc.id, ...doc.data() })),
      //     });
      //     break;
      //   }
      //   case "prev": {
      //     const s = await previous.get();
      //     res.status(200);
      //     res.json({
      //       items: s.docs.map((doc) => ({ id: doc.id, ...doc.data() })),
      //     });
      //     break;
      //   }
      //   default: {
      //     res.status(200);
      //     res.json({
      //       items: snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })),
      //     });
      //   }
      // }
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
      const batch = firebase.firestore.batch();

      if (!names.length) {
        res.status(400);
        res.statusMessage = "Empty array of names.";
        return;
      }

      names.forEach((id: string) => {
        const ref = namesRef.doc(id);
        batch.delete(ref);
      });

      await batch.commit();

      res.status(200);
    } catch (err) {
      console.log(err);
      res.status(500);
      res.statusMessage = err;
    }
  }
};
async function returnFirstQuery(
  namesRef: FirebaseFirestore.CollectionReference<
    FirebaseFirestore.DocumentData
  >,
  perPage: string | string[],
  res: NextApiResponse<any>,
  snapshot: FirebaseFirestore.QuerySnapshot<FirebaseFirestore.DocumentData>
) {
  const firstQuery = namesRef
    .orderBy("name")
    .limit(parseInt(perPage as string));
  const firstQuerySnapshot = await firstQuery.get();

  res.status(200);
  res.json({
    total: snapshot.docs.length,
    items: firstQuerySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })),
  });
}
