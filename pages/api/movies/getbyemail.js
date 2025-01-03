import { MongoClient } from "mongodb";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { userEmail } = req.query;

  if (!userEmail) {
    return res.status(400).json({ error: "User email is required" });
  }

  let client;

  try {
    client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
    const db = client.db("movieDB");
    const moviesCollection = db.collection("movies");

    const movie = await moviesCollection.findOne({ userEmail });

    if (!movie) {
      return res.status(404).json({ error: "Movie not found for this email" });
    }

    return res.status(200).json(movie);
  } catch (err) {
    console.error("Error fetching movie by email:", err);
    return res.status(500).json({ error: "Internal server error" });
  } finally {
    if (client) {
      await client.close();
    }
  }
}
