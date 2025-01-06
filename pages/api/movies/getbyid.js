import { MongoClient, ObjectId } from "mongodb";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: "Movie ID is required" });
  }

  // Validate if the ID is a valid ObjectId
  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid Movie ID format" });
  }

  let client;
  try {
    const uri = "mongodb+srv://saadshafiq1270:FMTkqfNmXZ49yyDV@cluster0.nqou9.mongodb.net/movieDB?retryWrites=true&w=majority";
    client = new MongoClient(uri);
    await client.connect();
    const db = client.db("movieDB");
    const moviesCollection = db.collection("movies");

    console.log("Querying for movie with ID:", id); // Debug log

    const movie = await moviesCollection.findOne({ _id: new ObjectId(id) });

    if (!movie) {
      console.log("Movie not found with ID:", id); // Log if movie is not found
      return res.status(404).json({ error: "Movie not found" });
    }

    // Convert ObjectId to string for frontend usage
    movie._id = movie._id.toString();

    console.log("Movie found:", movie); // Debug log of the result
    return res.status(200).json(movie);
  } catch (err) {
    console.error("Error fetching movie by ID:", err);
    return res.status(500).json({ error: "Internal server error" });
  } finally {
    if (client) {
      await client.close();
    }
  }
}
