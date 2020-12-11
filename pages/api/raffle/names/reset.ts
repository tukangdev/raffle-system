import { firestore } from "firebase-admin";
import { NextApiRequest, NextApiResponse } from "next";
import firebase from "../../../../lib/firebase";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const namesRef = firebase.firestore.collection("names");

  if (req.method === "PUT") {
    const { ids } = req.body;
    const batch = firebase.firestore.batch();

    ids.forEach((id: string) => {
      batch.update(namesRef.doc(id), {
        isWinner: false,
        updatedAt: firestore.FieldValue.serverTimestamp(),
      });
    });

    await batch.commit();

    res.status(200).send({});
  }
};
