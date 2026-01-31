import connectDB from "./db/index.js";
import dotenv from 'dotenv';
import {app} from "./app.js"

dotenv.config(
 { path: './env'}
)

connectDB()
.then(()=>{
    app.listen(process.env.PORT || 8000, ()=>{
        console.log(`server is running at port :${process.env.PORT}`);
    })
})
.catch((err)=>{
    console.log("DB connection Failed ",err)
})










// import express from 'express'

// const app=express();

// app.get("/",(req,res)=>{
//     res.send("Hello")
// })
// app.get("/api/jokes",(req,res)=>{
//     const jokes = [
//   {
//     id: 1,
//     setup: "Why don't scientists trust atoms?",
//     punchline: "Because they make up everything!"
//   },
//   {
//     id: 2,
//     setup: "Why did the programmer quit his job?",
//     punchline: "Because he didn't get arrays."
//   },
//   {
//     id: 3,
//     setup: "Why do Java developers wear glasses?",
//     punchline: "Because they don't C#."
//   },
//   {
//     id: 4,
//     setup: "Why was the math book sad?",
//     punchline: "Because it had too many problems."
//   },
//   {
//     id: 5,
//     setup: "Why did the computer go to the doctor?",
//     punchline: "Because it caught a virus."
//   }
// ];
//     res.json(jokes);
// })
// const port=process.env.PORT || 5000;
//  app.listen(port,(req,res)=>{
//     console.log(`server running in${port}`)
//  })


