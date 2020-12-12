import admin from "firebase-admin";

admin.initializeApp({
  credential: (admin.credential as any).cert({
    project_id: process.env.FIREBASE_PROJECT_ID,
    private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
  }),
  databaseURL: "https://raffledaffle-2e9e1.firebaseio.com",
});

async function addMissingNameLowerCase() {
  try {
    const namesRef = admin.firestore().collection("names");
    const names = await namesRef.get();

    const batch = admin.firestore().batch();

    names.forEach((name) => {
      const data = name.data();
      if (!data.nameLowercase) {
        batch.update(namesRef.doc(name.id), {
          nameLowercase: data.name.toLowerCase(),
        });
        return;
      }
      return;
    });

    await batch.commit();
    console.log("Added lowercase names in each document");
  } catch (err) {
    console.error(err);
  }
}

(async () => await addMissingNameLowerCase())();
