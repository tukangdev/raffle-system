import { NextApiRequest, NextApiResponse } from "next";
import firebase from "../../../../lib/firebase";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    try {
      const namesRef = firebase.firestore.collection("names");
      const snapshot = await namesRef.get();
      let allNames: any[] = [];
      snapshot.forEach((doc) => allNames.push(doc.data()));

      const randomName = allNames[Math.floor(Math.random() * allNames.length)];

      res.status(200);
      res.json(randomName);
    } catch (err) {
      console.error(err);
      res.status(500);
      res.statusMessage = err;
    }
  }
};