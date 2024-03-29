const express = require("express");
const mysql = require("mysql2/promise");
const app = express();
const port = 3000;
app.use(express.json());

const multer = require("multer");
const fs = require('fs');
const upload = multer({ dest: "uploads/" });

// Import exec from child_process for executing external commands
const { exec } = require("child_process");
app.post('/run-script', (req, res) => {
  exec('python spd.py', (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return res.status(500).json({ message: 'Script execution failed' });
    }
    console.log(`stdout: ${stdout}`);
    console.error(`stderr: ${stderr}`);
    res.json({ message: 'Script executed successfully', output: stdout });
  });
});



// Modify the route to use multer middleware for file upload



const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  database: "quiz_app",
  password: "oracle1",
});

app.use(express.static("public"));
app.get('/categories', async (req, res) => {
  try {
      const [rows] = await pool.query('SELECT * FROM categories');
      const categories = rows.map(row => row.name);
      res.json(categories);
  } catch (err) {
      console.error(err);
      res.status(500).send('Error fetching categories');
  }
});


app.get('/get-questions', async (req, res) => {
  try {
      const category = req.query.category; // Extract category from query parameters
      let categoryId;
      
      // Switch statement to convert category to category ID
      switch (category) {
          case 'Geography':
              categoryId = 1;
              break;
          case 'Literature':
              categoryId = 2;
              break;
          case 'Science':
              categoryId = 3;
              break;
          case 'General Knowledge':
              categoryId = 4;
              break;
          default:
              categoryId = null;
              break;
      }

      let query = `SELECT * FROM quiz_questions WHERE category_id = ${categoryId}`;
      let params = [];
      

      const [rows] = await pool.query(query, params);
      const questions = rows.map(row => ({
          question: row.question,
          answers: [
              { text: row.option1, correct: row.correct_option === 1 },
              { text: row.option2, correct: row.correct_option === 2 },
              { text: row.option3, correct: row.correct_option === 3 },
              { text: row.option4, correct: row.correct_option === 4 },
          ]
      }));
      res.json(questions);
  } catch (err) {
      console.error(err);
      res.status(500).send('Error fetching questions');
  }
});




app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
