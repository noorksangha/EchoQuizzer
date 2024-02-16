"# EchoQuizzer" 
Current DB Schema

CREATE DATABASE IF NOT EXISTS quiz_app;

USE quiz_app;

CREATE TABLE categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

CREATE TABLE quiz_questions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    category_id INT,
    question TEXT,
    option1 VARCHAR(255),
    option2 VARCHAR(255),
    option3 VARCHAR(255),
    option4 VARCHAR(255),
    correct_option INT,
    FOREIGN KEY (category_id) REFERENCES categories(id)
);

INSERT INTO categories (name) VALUES
('Geography'),
('Literature'),
('Science'),
('General Knowledge');

INSERT INTO quiz_questions (category_id, question, option1, option2, option3, option4, correct_option) VALUES
(1, 'What is the capital of France?', 'Paris', 'Berlin', 'Madrid', 'Lisbon', 1),
(1, 'Which planet is known as the Red Planet?', 'Earth', 'Mars', 'Jupiter', 'Venus', 2),
(2, 'What is the chemical symbol for Gold?', 'Au', 'Ag', 'Fe', 'Hg', 1),
(2, 'Who wrote "To Kill a Mockingbird"?', 'Harper Lee', 'J.D. Salinger', 'Ernest Hemingway', 'Mark Twain', 1),
(3, 'What is the largest ocean on Earth?', 'Atlantic Ocean', 'Indian Ocean', 'Arctic Ocean', 'Pacific Ocean', 4),
(3, 'Which country has the largest population in the world?', 'United States', 'India', 'China', 'Indonesia', 3),
(4, 'What is the square root of 144?', '12', '14', '16', '18', 1),
(4, 'Who painted the Mona Lisa?', 'Vincent Van Gogh', 'Pablo Picasso', 'Leonardo da Vinci', 'Claude Monet', 3);
