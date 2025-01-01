import mongoose from "mongoose";

type ConnectionObject = {
  isConnected?: number;
};

const connection: ConnectionObject = {};

async function dbconnect(): Promise<void> {
  if (connection.isConnected) {
    console.log("already connected to db");
    return;
  }
  try {
    const db = await mongoose.connect("mongodb+srv://newUser:6u3TMX7PiRuQooEE@mycluster.gn80new.mongodb.net/AnonymousChat");
   
    
  connection.isConnected=  db.connections[0].readyState
  console.log("connection successfully");
  
  } catch (error) {
    console.log("error in connecting to db",error);
    process.exit(1)
    
    
  }
}

export default dbconnect;