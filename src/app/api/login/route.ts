import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';
import bcrypt from 'bcryptjs';

// Fetching the MongoDB URI from environment variables
const uri = process.env.MONGODB_URI;

export async function POST(req: Request) {
  // Ensure MongoDB URI exists
  if (!uri) {
    return NextResponse.json(
      { success: false, message: "Database connection string is missing." },
      { status: 500 }
    );
  }

  const client = new MongoClient(uri);

  try {
    // Parse the request body
    const { email, password } = await req.json();
    console.log("Received email:", email);
    console.log("Received password:", password);

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Email and password are required." },
        { status: 400 }
      );
    }

    // Connect to the MongoDB database
    await client.connect();
    const db = client.db('myDBClass');
    const collection = db.collection('myCollectionMyDBClass');

    // Find the user with the matching email (case-insensitive)
    const user = await collection.findOne({
      email: { $regex: new RegExp(`^${email}$`, "i") },
    });
    
    if (!user) {
      console.error("User not found for email:", email);
      return NextResponse.json(
        { success: false, message: "Invalid email or password." },
        { status: 401 }
      );
    }

    // Compare the hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);
if (!isPasswordValid) {
  return NextResponse.json({
    success: false,
    message: "Invalid email or password.",
  });
}


    // Return a success response if login is successful
    console.log("Login successful for user:", user.email);
    return NextResponse.json({
      success: true,
      message: "Login successful!",
      user: {
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        userType: user.userType, // Example additional data
      },
    });
  } catch (error: unknown) {
    console.error("Login error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to log in. Please try again later." },
      { status: 500 }
    );
  } finally {
    // Close the MongoDB connection
    await client.close();
  }
}
