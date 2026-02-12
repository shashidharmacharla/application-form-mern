const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// 🔥 Connect to Local MongoDB
mongoose.connect("mongodb://localhost:27017/applicationDB")
.then(() => console.log("MongoDB Connected (Local) ✅"))
.catch(err => console.log("Connection Error:", err));

// Schema
const applicationSchema = new mongoose.Schema({
    name: String,
    email: String,
    phone: String,
    course: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Model
const Application = mongoose.model("Application", applicationSchema);

// Save Form Data
app.post('/submit', async (req, res) => {
    try {
        const newApplication = new Application(req.body);
        await newApplication.save();

        res.send(`
            <h2>Application Saved in Local MongoDB ✅</h2>
            <a href="/">Go Back</a>
        `);
    } catch (error) {
        console.log(error);
        res.status(500).send("Error saving data");
    }
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
