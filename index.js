const express = require('express');
const cors = require("cors");
const app = express();
const http = require('http');
const server = http.createServer(app);
require("dotenv").config();
const port = process.env.PORT || 5000;
const { Server } = require("socket.io");
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const socketIO = new Server(server, {
    cors: {
        origin: ["http://localhost:5173", "https://realtime-to-do-3ff30.web.app"]
    },
});

app.use(cors({ origin: ["http://localhost:5173", "https://realtime-to-do-3ff30.web.app"], credentials: true }));
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qpmcg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
});

async function run() {
    try {
        await client.connect();
        const todoCollection = client.db("todoDB").collection("todoCollection");

        app.post("/tasks", async (req, res) => {
            const data = req.body;
            const result = await todoCollection.insertOne(data);
            socketIO.sockets.emit("tasks", await todoCollection.find().toArray());
            res.send(result);
        });

        app.get("/tasks", async (req, res) => {
            const { userEmail } = req.query; 

    const query = { userEmail }; 
    const result = await todoCollection.find(query).toArray();
    res.send(result);
        });
        app.delete('/tasks/:id', async(req, res) => {
            const id = req.params.id;
            const query = {_id : new ObjectId(id)}
            const result = await todoCollection.deleteOne(query)
            socketIO.sockets.emit("tasks", await todoCollection.find().toArray());
            res.send(result)
        })
        app.get('/tasks/:id',async(req, res)=>{
            const id = req.params.id;
            const query = {_id: new ObjectId(id)}
            const result = await todoCollection.findOne(query)
            res.send(result)
        })
        app.patch('/tasks/:id', async (req, res) => {
         
                const id = req.params.id;
                const filter = {_id: new ObjectId(id)}
                const updatedTask = req.body;
                const updatedDoc ={
                    $set: {
                        taskTitle: updatedTask.taskTitle,
                        taskDescription: updatedTask.taskDescription,
                    }
                }
               const result = await todoCollection.updateOne(filter, updatedDoc)
        
               
        
                res.send(result);
            
        });
        
        

        console.log("Connected to MongoDB!");
    } catch (error) {
        console.error("MongoDB connection error:", error);
    }
}

run().catch(console.dir);

socketIO.on("connection", (socket) => {
    console.log(`⚡: ${socket.id} user connected!`);

    socket.on("createTask", async ({ taskTitle, taskDescription }) => {
        const todoCollection = client.db("todoDB").collection("todoCollection");
        const newTask = {
            taskTitle,
            taskDescription,
            category: "pending",
            todoDate: new Date().toISOString().split("T")[0],
        };
        socketIO.sockets.emit("tasks", await todoCollection.find().toArray());
    });

    socket.on("taskDragged", async (data) => {
        const { source, destination, taskId } = data;
        if (!destination) return;
        try {
            const todoCollection = client.db("todoDB").collection("todoCollection");
            await todoCollection.updateOne(
                { _id: new ObjectId(taskId) },
                { $set: { category: destination.droppableId } }
            );
            
            socketIO.sockets.emit("tasks", await todoCollection.find().toArray());
        } catch (error) {
            console.error("Error updating task category:", error);
        }
    });

    socket.on("disconnect", () => {
        console.log("🔥: A user disconnected");
    });
});

app.get("/api", async (req, res) => {
    const todoCollection = client.db("todoDB").collection("todoCollection");
    const result = await todoCollection.find().toArray();
    res.json(result);
});

server.listen(port, () => {
    console.log(`My server is running on ${port}`);
});