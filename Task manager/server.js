//using Express
const express = require('express');
const mongoose= require("mongoose");
const cors = require("cors");

//create an instance of express
const app = express();
app.use(express.json())
app.use(cors())

//sample in memory storage for tasks data
// let tasks =[]

//connecting mongodb
mongoose.connect('mongodb://localhost:27017/mern-app')
.then(() =>{
    console.log("DB Connected!")
})
.catch((err) => {
    console.log(err)
})

//creating schema
const taskSchema = new mongoose.Schema({
    title: {
        required: true,
        type: String
    },
    description: String
})

//creating model
const taskModel = mongoose.model('Tasks', taskSchema);

//create a new task manager item
app.post("/tasks", async (req,res)=>{
    const{title, description}=req.body;
    // const newTask = {
    //     id: tasks.length + 1,
    //     title,
    //     description
    // };

    // tasks.push(newTask);
    // console.log(tasks);

    try{
        const newTask= new taskModel({title,description});
        await newTask.save();
        res.status(201).json(newTask);
    }catch(error){
        console.log(error);
        res.status(500).json({message: error.message});
    }

})

//Get all items
app.get('/tasks', async (req, res) =>{
    try{
        const tasks = await taskModel.find();
        res.json(tasks);
    }catch{
        console.log(error);
        res.status(500).json({message: error.message});
    }
})

//update a task item
app.put("/tasks/:id", async (req,res) =>{
    try{
    const{title, description}=req.body;
    const id = req.params.id;
    const updatedTask= await taskModel.findByIdAndUpdate(
        id,
        {title , description},
        {new: true}
    )

    if(!updatedTask){
        return res.status(404).json({message: "Tasks not found"})
    }
    res.json(updatedTask)
    }catch(error){
        console.log(error);
        res.status(500).json({message: error.message});
    }

})

//delete a task item
app.delete('/tasks/:id', async (req,res)=>{
    try {
        const id = req.params.id;
        await taskModel.findByIdAndDelete(id);
        res.status(204).end()
    } catch (error) {
        console.log(error);
        res.status(500).json({message: error.message});
    }
    
})

//start the server
const port = 8000;
app.listen(port,() =>{
    console.log("server is listening to port "+ port);
})