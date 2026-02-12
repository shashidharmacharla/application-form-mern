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

// View All Applications
app.get('/applications', async (req, res) => {
    const applications = await Application.find();

    let html = `
        <h2 style="text-align:center;">All Applications</h2>
        <table border="1" cellpadding="10" style="margin:auto; border-collapse:collapse;">
        <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Course</th>
        </tr>
    `;

    applications.forEach(app => {
        html += `
            <tr>
                <td>${app.name}</td>
                <td>${app.email}</td>
                <td>${app.phone}</td>
                <td>${app.course}</td>
            </tr>
        `;
    });

    html += `</table><br><div style="text-align:center;"><a href="/">Go Back</a></div>`;

    res.send(html);
});


app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
