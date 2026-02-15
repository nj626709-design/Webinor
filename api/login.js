import { MongoClient } from "mongodb";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const client = new MongoClient(process.env.MONGODB_URI);

export default async function handler(req, res) {

  const { email, password } = req.body;

  await client.connect();
  const db = client.db("webinor");

  const user = await db.collection("clients").findOne({ email });

  if (!user) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  const valid = await bcrypt.compare(password, user.password);

  if (!valid) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign(
    { email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "2h" }
  );

  res.status(200).json({ token });
}