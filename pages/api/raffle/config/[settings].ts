import { NextApiRequest, NextApiResponse } from "next";
import { SETTINGS_TEXT } from "../../../../const";
import { Settings } from "../../../../enum";
import firebase from "../../../../lib/firebase";

type ResponseData = {
  data?: FirebaseFirestore.DocumentData;
  message?: string;
};

type Query = {
  settings: Settings;
};

export default async (
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) => {
  if (req.method === "PUT") {
    const { settings } = req.query as Query;
    const { value } = req.body;
    const configRef = firebase.firestore.collection("config").doc("main");
    try {
      let message: string = "";
      await firebase.firestore.runTransaction(async (t) => {
        t.update(configRef, { [settings as string]: value });
        message = `Updated ${SETTINGS_TEXT[settings]}!`;
      });

      const doc = await configRef.get();

      res.status(200);
      res.json({ data: doc.data(), message });
    } catch (err) {
      console.error(err);
      res.status(500);
      res.statusMessage = err;
    }
  }
};
