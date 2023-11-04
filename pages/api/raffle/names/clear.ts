import { NextApiRequest, NextApiResponse } from 'next'
import firebase from '../../../../lib/firebase'

export default async (req: NextApiRequest, res: NextApiResponse) => {
	const namesRef = firebase.firestore.collection('names')

	if (req.method === 'DELETE') {
		const batch = firebase.firestore.batch()
		const snapshot = await namesRef.get()

		snapshot.forEach(doc => {
			batch.delete(doc.ref)
		})

		await batch.commit()

		res.status(200).send({})
	}
}
