import { MongoClient } from "mongodb";
import multer from "multer";
import { createRouter } from "next-connect";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";

// Configure AWS S3 Client
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// Multer configuration
const upload = multer({ storage: multer.memoryStorage() });

// Create the router
const router = createRouter();

// Add middleware
router.use(upload.single("image"));

router.post(async (req, res) => {
  const { movieName, releaseYear, userEmail } = req.body;

  const image = req.file;

  if (!movieName || !releaseYear || !userEmail || !image) {
    return res.status(400).json({ error: "All fields are required" });
  }

  let client;
  try {
    // Generate unique file name
    const fileName = `${uuidv4()}-${image.originalname}`;

    // Upload image to S3
    const uploadParams = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: fileName,
      Body: image.buffer,
      ContentType: image.mimetype,
    };
    
    const command = new PutObjectCommand(uploadParams);
    await s3.send(command);
    

    // Connect to MongoDB
    client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
    const db = client.db("movieDB");
    const moviesCollection = db.collection("movies");

    // Save movie entry with S3 URL
    const movie = {
      userEmail,
      movieName,
      releaseYear,
      imagePath: `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`,
      createdAt: new Date(),
    };

    await moviesCollection.insertOne(movie);

    res.status(201).json({ message: "Movie created successfully", movie });
  } catch (err) {
    console.error("Error adding movie:", err);
    res.status(500).json({ error: "Internal server error" });
  } finally {
    if (client) await client.close();
  }
});

export const config = {
  api: {
    bodyParser: false, // Disable Next.js body parser
  },
};

export default router.handler({
  onError: (err, req, res) => {
    console.error(err.stack);
    res.status(err.statusCode || 500).end(err.message);
  },
});
