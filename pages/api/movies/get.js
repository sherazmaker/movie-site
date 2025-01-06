import { MongoClient } from "mongodb";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { userEmail } = req.query;

  if (!userEmail) {
    return res.status(400).json({ error: "User ID is required" });
  }

  let client;

  try {
    const uri = "mongodb+srv://saadshafiq1270:FMTkqfNmXZ49yyDV@cluster0.nqou9.mongodb.net/movieDB?retryWrites=true&w=majority";
    client = new MongoClient(uri);
    await client.connect();
    const db = client.db("movieDB");
    const moviesCollection = db.collection("movies");

    const movies = await moviesCollection.find({ userEmail }).toArray();

    return res.status(200).json(movies);
  } catch (err) {
    console.error("Error fetching movies:", err);
    return res.status(500).json({ error: "Internal server error" });
  } finally {
    if (client) {
      await client.close();
    }
  }
}
