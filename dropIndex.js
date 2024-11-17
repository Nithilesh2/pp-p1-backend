import mongoose from "mongoose";
import Data from "./models/data.models.js";
import { DB_NAME } from "./constants.js";
import dotenv from "dotenv";

dotenv.config();

const dropIndex = async () => {
  try {
    const mongoURI = `${process.env.MONGODB_URI}/${DB_NAME}?retryWrites=true&w=majority`; 

    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    await Data.collection.dropIndex('category_1');
    console.log('Index dropped successfully');
    
    await mongoose.connection.close();
  } catch (error) {
    console.error('Error dropping index:', error);
  }
};

dropIndex();
