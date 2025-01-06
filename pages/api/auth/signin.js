import { MongoClient } from "mongodb";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  let client;

  try {
    // Connect to MongoDB
    const uri = "mongodb+srv://saadshafiq1270:FMTkqfNmXZ49yyDV@cluster0.nqou9.mongodb.net/movieDB?retryWrites=true&w=majority";
    client = new MongoClient(uri);
    await client.connect();

    const db = client.db("movieDB"); // Specify the `movieDB` database
    const usersCollection = db.collection("users");

    // Check if a user with the provided email already exists
    const existingUser = await usersCollection.findOne({ email });

    if (existingUser) {
      // If user exists, check password
      if (existingUser.password === password) {
        return res.status(200).json({ message: "Login successful" });
      } else {
        return res.status(401).json({ error: "Invalid password" });
      }
    } else {
      // If user does not exist, create a new user
      await usersCollection.insertOne({ email, password });
      return res.status(201).json({ message: "User registered successfully" });
    }
  } catch (err) {
    console.error("Database error:", err);
    return res.status(500).json({ error: "Internal server error" });
  } finally {
    if (client) {
      await client.close();
    }
  }
}
