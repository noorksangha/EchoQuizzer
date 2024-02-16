const express = require("express");
const mysql = require("mysql2/promise");
const app = express();
const port = 3000;

const multer = require("multer"); //middleware for handling hte multipart/form-data
const { exec } = require("child_process");
const upload = multer({ dest: "uploads/" });

app.post("/upload-audio", (req, res) => {
  console.log("Received audio upload request");
  // If using a middleware like multer for handling uploads
  console.log("Uploaded file:", req.file);

  // Continue processing the request...

  // Send a response back to the client
  res.json({ message: "Audio uploaded successfully in upload audio" });
});

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  database: "quiz_app",
  password: "mysql123",
});
app.use(express.static("public"));

app.get("/get-questions", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM quiz_questions");
    const questions = rows.map((row) => ({
      question: row.question,
      answers: [
        { text: row.option1, correct: row.correct_option === 1 },
        { text: row.option2, correct: row.correct_option === 2 },
        { text: row.option3, correct: row.correct_option === 3 },
        { text: row.option4, correct: row.correct_option === 4 },
      ],
    }));
    res.json(questions);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching questions");
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
