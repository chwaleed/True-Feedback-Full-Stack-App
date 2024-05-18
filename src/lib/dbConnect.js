import mongoose, { connection } from "mongoose";

async function dbConnect() {
  if (connection.isConnected) {
    console.log("Already connected to database");
    return;
  }
  try {
    const db = await mongoose.connect(process.env.MONGODB_URI || "");
    connection.isConnected = db.connections[0].readyState;
    console.log("Connected to database");
  } catch (error) {
    console.log("Database Connection failed", error);
    process.exit(1);
  }
}
export default dbConnect;
