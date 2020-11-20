import { NextApiRequest, NextApiResponse } from "next";
import firebase from "../../../lib/firebase";

type ResponseData = {
  data?: FirebaseFirestore.DocumentData[] | FirebaseFirestore.DocumentData;
  message?: string;
};

export default async (
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) => {
  const namesRef = firebase.firestore.collection("names");
  if (req.method === "GET") {
    try {
      const snapshot = await namesRef.get();
      let message: string = "";

      if (snapshot.empty) {
        message = "There's no names..";
      }

      res.status(200);
      res.json({
        data: snapshot.docs.map((doc) => doc.data()),
        message,
      });
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
      res.json({ data: doc.data(), message: `${name} added!` });
    } catch (err) {
      console.error(err);
      res.status(500);
      res.statusMessage = err;
    }
  }
};
