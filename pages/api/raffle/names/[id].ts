import { NextApiRequest, NextApiResponse } from "next";
import firebase from "../../../../lib/firebase";

type ResponseData = {
  data?: FirebaseFirestore.DocumentData;
  message?: string;
  status: 0 | 1;
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;
  const namesCollection = firebase.firestore.collection("names");
  if (req.method === "PUT") {
    try {
      const { name, isWinner } = req.body;

      if (!id) {
        res.status(400);
        res.statusMessage = "id does not exists!";
        return;
      }

      const namesRef = namesCollection.doc(id as string);
      const doc = await namesRef.get();

      if (!doc.exists) {
        res.status(400);
        res.statusMessage = "Name does not exists!";
        return;
      }

      await firebase.firestore.runTransaction(async (t) => {
        if (name) {
          t.update(namesRef, { name });
        }
        if (isWinner) {
          t.update(namesRef, { isWinner });
        }
      });

      res.status(200).send({});
    } catch (err) {
      console.error(err);
      res.status(500);
      res.statusMessage = err;
    }
  }

  if (req.method === "DELETE") {
    try {
      const { id } = req.query;
      await namesCollection.doc(id as string).delete();
      res.status(200);
      res.json({
        status: 1,
      });
    } catch (err) {
      console.error(err);
      res.status(500);
      res.statusMessage = err;
    }
  }
};
