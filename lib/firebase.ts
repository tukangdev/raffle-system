import admin from 'firebase-admin'

try {
	admin.initializeApp({
		credential: (admin.credential as any).cert({
			project_id: process.env.FIREBASE_PROJECT_ID,
			private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
			client_email: process.env.FIREBASE_CLIENT_EMAIL,
		}),
		databaseURL: 'https://raffledaffle-2e9e1.firebaseio.com',
	})
} catch (error) {
	/*
	 * We skip the "already exists" message which is
	 * not an actual error when we're hot-reloading.
	 */
	if (!/already exists/u.test((error as unknown as any).message)) {
		// eslint-disable-next-line no-console
		console.error(
			'Firebase admin initialization error',
			(error as unknown as any).stack,
		)
	}
}

export default {
	admin,
	firestore: admin.firestore(),
	auth: admin.auth(),
}
