import { firestore } from "firebase-admin";
import { NextApiRequest, NextApiResponse } from "next";
import firebase from "../../../../lib/firebase";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const namesRef = firebase.firestore.collection("names");

  if (req.method === "GET") {
    const docs = namesRef.where("isWinner", "==", true).orderBy("name");
    const snapshot = await docs.get();

    res.status(200);
    res.json({
      total: snapshot.docs.length,
      items: snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })),
    });
  }
};
