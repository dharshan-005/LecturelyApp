import bcrypt from "bcrypt";
import User from "../../../models/userModel";
import { connectToDB } from "@/utils/database";

export async function POST(req) {
  const { name, email, password } = await req.json();

  await connectToDB();

  const existing = await User.findOne({ email });

  if (existing) {
    return new Response("User already exists", { status: 400 });
  }

  const hashedPassword = await bcrypt.hash(password, 8);

  await User.create({
    name,
    email,
    password: hashedPassword,
  });

  return new Response("User registered successfully", { status: 201 });
}
