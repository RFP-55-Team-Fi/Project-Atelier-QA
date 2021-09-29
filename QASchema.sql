CREATE TABLE IF NOT EXISTS questions (
question_id INT PRIMARY KEY,
product_id INT NOT NULL,
question_body VARCHAR NOT NULL,
question_date INT NOT NULL,
asker_name VARCHAR NOT NULL,
asker_email VARCHAR NOT NULL,
reported boolean DEFAULT false,
question_helpfulness INT DEFAULT 0
);
CREATE TABLE IF NOT EXISTS answers (
answer_id INT PRIMARY KEY,
question_id INT REFERENCES questions (question_id),
answer_body varchar NOT NULL,
answer_date INT NOT NULL,
answerer_name VARCHAR NOT NULL,
answerer_email VARCHAR NOT NULL,
reported BOOLEAN DEFAULT false,
helpfulness INT DEFAULT 0
);
CREATE TABLE IF NOT EXISTS photos (
photo_id INT PRIMARY KEY,
answer_id INT REFERENCES answers (answer_id),
url VARCHAR NOT NULL
);

COPY questions
FROM '/home/dprejs/Desktop/hackreactor work/SDC/CSV/questions.csv'
DELIMITER ','
CSV HEADER;

COPY answers
FROM '/home/dprejs/Desktop/hackreactor work/SDC/CSV/answers.csv'
DELIMITER ','
CSV HEADER;

COPY photos
FROM '/home/dprejs/Desktop/hackreactor work/SDC/CSV/answer_photos.csv'
DELIMITER ','
CSV HEADER;