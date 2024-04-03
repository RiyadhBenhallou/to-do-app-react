import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
const { Schema } = mongoose;

dotenv.config();



const app = express();
const port = 4000;

app.use(express.json())
app.use(cors({
  origin: 'https://d7b6b69b-3538-48a8-bbe0-ad22c1c9dd10-00-2z69h37oev5ef.janeway.replit.dev:3000', // Allow requests from this origin
  methods: ['GET', 'POST', 'DELETE'], // Allow only GET and POST requests
  credentials: true // Allow credentials to be included in the request
}));

mongoose.connect(process.env['MONGODB_URI'])
.then(() => console.log('mongodb connected'))
.catch(() => console.log('error while connection to the database'))

const todoSchema = new Schema({
    title: String,
})

const Todo = mongoose.model('Todo', todoSchema)


app.get("/api-todos", async (req, res) => {
    const data = await Todo.find();
    res.json(data)
})

app.post("/api-todos", async (req, res) => {
  const title = req.body.title
  const todo = new Todo({ title })
  todo.save()
  res.json({ title: todo.title })
})

app.delete("/api-todos/:id", async (req, res) => {
  const { id } = req.params;
  await Todo.findByIdAndDelete(id);
  const data = await Todo.find();
  res.json(data)
})





app.listen(port, () => {
    console.log(`server running on port ${port}`)
})