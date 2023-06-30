import express from "express"; // "type": "module"

import bodyParser from "body-parser";
import { MongoClient } from 'mongodb'
import * as dotenv from 'dotenv'
import cors from "cors";
import signinRouter from './router/login.router.js';
import emailRouter from './router/route.js';
import { auth } from "../middleware/auth.js";


// import bcrypt   from ' bcrypt'
dotenv.config()
export const app = express();

const PORT = process.env.PORT;

const MONGO_URL = (process.env.MONGO_URL)
export const client = new MongoClient(MONGO_URL);
await client.connect();
console.log('mongo is connected!!');


app.use(cors(
    { origin: "*" }
))
app.use(express.json())

// Use bodyParser middleware to parse JSON in request body
app.use(bodyParser.json());

app.get("/", function (request, response) {

    response.send("🙋‍♂️, 🌏 🎊✨🤩");

});


app.post("/dashboard", async function (request, response) {
    const result = request.body
    const detail = await client
        .db("workspace")
        .collection("loanDetails")
        .insertOne(result)
    response.send(detail)

})

app.get("/dashboard", auth, async function (request, response) {

    const detail = await client
        .db("workspace")
        .collection("loanDetails")
        .find({})
        .toArray();
    response.send(detail)

})

app.get("/dashboard/:id", auth, async function (request, response) {
    const { id } = request.params
    const detail = await client
        .db("workspace")
        .collection("loanDetails")
        .findOne({ id: id })
    detail ? response.send(detail) : response.status(404).send({ message: "Detail is not found" })
})

app.put("/dashboard/:id", async function (request, response) {
    const { id } = request.params
    const data = request.body
    const detail = await client
        .db("workspace")
        .collection("loanDetails")
        .updateOne({ id: id }, { $set: data })
    response.send(detail)
})

app.delete('/dashboard/:id', async function (request, response) {
    const { id } = request.params
    console.log(id)

    const result = await client
        .db("workspace")
        .collection("loanDetails")
        .deleteOne({ id: id })
    result.deletedCount >= 1
        ? response.send({ message: "Detail deleted successfully" })
        : response.status(404).send({ message: "Detail is not found" })
})



app.use("/", signinRouter);
app.use("/", emailRouter);

app.listen(PORT, () => console.log(`The server started in: ${PORT} ✨✨`));
