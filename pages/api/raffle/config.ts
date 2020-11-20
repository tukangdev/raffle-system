import { NextApiRequest, NextApiResponse } from "next";
import firebase from "../../../lib/firebase";

type ResponseData = {
  data?: FirebaseFirestore.DocumentData;
  message?: string;
};

export default async (
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) => {
  if (req.method === "GET") {
    try {
      const configRef = firebase.firestore.collection("config").doc("main");
      const doc = await configRef.get();

      res.status(200);
      res.json({ data: doc.data() });
    } catch (err) {
      console.error(err);
      res.status(500);
      res.statusMessage = err;
    }
  }
};
