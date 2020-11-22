import { NextApiRequest, NextApiResponse } from "next";
import firebase from "../../../../lib/firebase";

type ResponseData = {
  data?: FirebaseFirestore.DocumentData;
  message?: string;
  status: 0 | 1;
};

export default async (
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) => {
  const { id } = req.query;
  const namesCollection = firebase.firestore.collection("names");
  if (req.method === "PUT") {
    try {
      const { name } = req.body;

      if (!id) {
        res.status(400);
        res.statusMessage = "id does not exists!";
        return;
      }

      const namesRef = namesCollection.doc(id as string);
      const doc = await namesRef.get();
      let message: string = "";

      if (!doc.exists) {
        res.status(400);
        res.statusMessage = "Name does not exists!";
        return;
      }

      await firebase.firestore.runTransaction(async (t) => {
        t.update(namesRef, { name });
      });

      res.status(200);
      res.json({
        data: name.data(),
        status: 1,
        message,
      });
    } catch (err) {
      console.error(err);
      res.status(500);
      res.statusMessage = err;
    }
  }
};
