const express = require("express");
const cors = require("cors");

const PORT = process.env.PORT || 5000;
const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send("SIMPLE CONVERSATIONAL AGENTIC AI'S FIRST PHASE VOICE TO TEXT IS RUNNING")
})

app.post('/transcript', (req, res) => {
    const { message } = req.body;
    console.log(message)

    res.json({received:true, echo:message})
})

app.listen(PORT, () => {
    console.log(`SIMPLE CONVERSATIONAL AGENTIC AI'S FIRST PHASE VOICE TO TEXT IS RUNNING ON ${PORT} `)
})