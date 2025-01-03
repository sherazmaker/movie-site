import { MongoClient } from "mongodb";
import multer from "multer";
import nextConnect from "next-connect";

// Multer configuration - stores file in memory or disk
const upload = multer({ storage: multer.memoryStorage() });

// NextConnect allows middleware like multer to be used with Next.js API routes
const handler = nextConnect();

// Apply multer middleware to handle file upload
handler.use(upload.single("image"));

handler.post(async (req, res) => {
  const { movieName, releaseYear, userId } = req.body;
  const image = req.file; // Image will be stored here

  if (!movieName || !releaseYear || !userId || !image) {
    return res.status(400).json({ error: "All fields are required" });
  }

  let client;

  try {
    // Connect to MongoDB
    client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
    const db = client.db("movieDB");
    const moviesCollection = db.collection("movies");

    // Save movie entry with image buffer or URL
    const movie = {
      userId,
      movieName,
      releaseYear,
      imagePath: `/uploads/${image.originalname}`,  // Simulate saving path (can be stored in cloud)
      createdAt: new Date(),
    };

    await moviesCollection.insertOne(movie);

    res.status(201).json({ message: "Movie created successfully" });
  } catch (err) {
    console.error("Error adding movie:", err);
    res.status(500).json({ error: "Internal server error" });
  } finally {
    if (client) await client.close();
  }
});

// Disable default body parsing in Next.js to handle multipart data
export const config = {
  api: {
    bodyParser: false,
  },
};

export default handler;
