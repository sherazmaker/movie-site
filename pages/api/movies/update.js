import { MongoClient, ObjectId } from "mongodb";
export default async function handler(req, res) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { movieId, userEmail, image, movieName, releaseYear } = req.body;

  if (!movieId || !userEmail || !movieName || !releaseYear) {
    return res.status(400).json({ error: 'Movie ID, user email, name, and year are required' });
  }

  let client;

  try {
     const uri = "mongodb+srv://saadshafiq1270:FMTkqfNmXZ49yyDV@cluster0.nqou9.mongodb.net/movieDB?retryWrites=true&w=majority";
    client = new MongoClient(uri);
    await client.connect();
    const db = client.db('movieDB');
    const moviesCollection = db.collection('movies');

    const result = await moviesCollection.updateOne(
      { _id: new ObjectId(movieId), userEmail },
      { $set: { image, movieName, releaseYear, updatedAt: new Date() } }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Movie not found or not owned by the user' });
    }

    return res.status(200).json({ message: 'Movie updated successfully' });
  } catch (err) {
    console.error('Error updating movie:', err);
    return res.status(500).json({ error: 'Internal server error' });
  } finally {
    if (client) {
      await client.close();
    }
  }
}
