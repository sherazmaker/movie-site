import { MongoClient, ObjectId } from "mongodb";

export default async function handler(req, res) {
  if (req.method !== "DELETE") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { movieId, userId } = req.body;

  if (!movieId || !userId) {
    return res.status(400).json({ error: "Movie ID and user ID are required" });
  }

  let client;

  try {
    const uri = "mongodb+srv://saadshafiq1270:FMTkqfNmXZ49yyDV@cluster0.nqou9.mongodb.net/movieDB?retryWrites=true&w=majority";
    client = new MongoClient(uri);
    await client.connect();
    const db = client.db("movieDB");
    const moviesCollection = db.collection("movies");

    const result = await moviesCollection.deleteOne({
      _id: new ObjectId(movieId),
      userEmail: userId,  // Match by email if needed
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Movie not found or not owned by the user" });
    }

    return res.status(200).json({ message: "Movie deleted successfully" });
  } catch (err) {
    console.error("Error deleting movie:", err);
    return res.status(500).json({ error: "Internal server error" });
  } finally {
    if (client) {
      await client.close();
    }
  }
}
