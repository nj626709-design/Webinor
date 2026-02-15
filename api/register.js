import { MongoClient } from "mongodb";
import bcrypt from "bcryptjs";

const client = new MongoClient(process.env.MONGODB_URI);

export default async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { email, password } = req.body;

  await client.connect();
  const db = client.db("webinor");

  const existing = await db.collection("clients").findOne({ email });
  if (existing) {
    return res.status(400).json({ message: "User already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await db.collection("clients").insertOne({
    email,
    password: hashedPassword,
    createdAt: new Date()
  });

  res.status(200).json({ message: "Registration successful" });
}