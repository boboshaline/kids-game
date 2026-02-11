//ENTRY POINT FOR SERVER

import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import connectDB from "./config/db";
import gameRoutes from "./routes/gameRoutes";

dotenv.config();

const app=express();

//Connect to MongoDB

connectDB();

const corsOptions={
    origin:"http://localhost:5173",
    credentials:true,
    METHODS:["GET","POST","PUT","DELETE"],
    allowedHeaders:["Content-Type","Authorization"],

}

//Middleware
app.use(cors(corsOptions));
app.use(express.json());

//routes
app.use('/api/game',gameRoutes);

//Basic test route

app.get("/",(req,res)=>{
    res.send("API is running and DB is connected");
});

const PORT=process.env.PORT || 5000;

app.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}`);
})