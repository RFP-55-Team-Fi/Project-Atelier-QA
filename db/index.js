const { Pool, Client } = require('pg');
const password = require('./../config.js').password;

const pool = new Pool({
  host: 'localhost',
  user: 'dprejs',
  database: 'SDC',
  password: password
})
pool.connect((err, client, release) => {
  if(err) {
    return console.log('error aquiring client', err.stack);
  }
})
const questionPageQuery = (values) => {
  return {
    name: 'questions-with-pagination',
    text: `SELECT *
    FROM questions
    WHERE product_id=$1
    AND reported=false
    ORDER BY (SELECT NULL)
    OFFSET $2 ROWS FETCH NEXT $3 ROWS ONLY`,
    values: [values.product_id, values.offset, values.count]
  }
}
const insertQuestion = (question) => {
  question.date = Math.round((new Date()).getTime() / 1000);
  return {
    name: 'insert-new-question',
    text: `INSERT INTO questions
    (product_id, question_body, question_date, asker_name, asker_email)
    VALUES ($1, $2, $3, $4, $5)`,
    values: [question.product_id, question.body,
      question.date, question.name, question.email]
  }
}
const answersPageQuery = (values) => {
  return {
    name: 'answers-with-pagination',
    text: `SELECT *
    FROM answers
    WHERE question_id=$1
    AND reported=false
    ORDER BY (SELECT NULL)
    OFFSET $2 ROWS FETCH NEXT $3 ROWS ONLY`,
    values: [values.question_id, values.offset, values.count]
  }
}
const answerByQId = (question_id) => {
  return {
    name: 'all-answers-with-question-id',
    text: `SELECT *
    FROM answers
    WHERE question_id=$1
    AND reported=false`,
    values: [question_id]
  }
}
const insertAnswer = (answer) => {
  answer.date = Math.round((new Date()).getTime() / 1000);
  return {
    name: 'insert-new-answer',
    text: `INSERT INTO answers
    (question_id, answer_body, answer_date, answerer_name, answerer_email)
    VALUES($1, $2, $3, $4, $5)
    RETURNING answer_id`,
    values: [answer.question_id, answer.body, answer.date,
      answer.name, answer.email]
  }
}
const photosByAId = (answer_id) => {
  return {
    name: 'all-photos-with-answer-id',
    text: `SELECT *
    FROM photos
    WHERE answer_id=$1`,
    values: [answer_id]
  }
}
const insertPhoto = (photo) => {
  return {
    name: 'insert-new-photo',
    text: `INSERT INTO photos
    (answer_id, url)
    VALUES($1, $2)`,
    values: [photo.answer_id, photo.url]
  }
}

const markHelpful = (table, column, id) => {
  console.log(table, column, id)
  return {
    name: 'add-one-to-helpful-row',
    text: `UPDATE ${table}
    SET helpfulness=helpfulness + 1
    WHERE ${column}=$1`,
    values: [id]
  }
}
const report = (table, column, id) => {
  return {
    name: 'mark-reported',
    text: `UPDATE ${table}
    SET reported=false
    WHERE ${column}=$1`,
    values: [id]
  }
}
module.exports = {
  query: (text, params, callback) => {
    return pool.query(text, params, callback)
  },
  questionPageQuery: (product_id, count = 5, page = 1) => {
    var values = {
      product_id: product_id,
      count: count,
      offset: (page - 1) * count
    };
    return pool.query(questionPageQuery(values))
  },
  answersPageQuery: (question_id, count = 5, page = 1) => {
    var values = {
      question_id: question_id,
      count: count,
      offset: (page - 1) * count
    }
    return pool.query(answersPageQuery(values))
  },
  answersQuery: (question_id) => {
    return pool.query(answerByQId(question_id))
  },
  photosQuery: (answer_id) => {
    return pool.query(photosByAId(answer_id))
  },
  insertQuestion: (fields) => {
    return pool.query(insertQuestion(fields))
  },
  insertAnswer: (fields) => {
    return pool.query(insertAnswer(fields))
  },
  insertPhoto: (fields) => {
    return pool.query(insertPhoto(fields))
  },
  markHelpful: (table, column, id) => {
    return pool.query(markHelpful(table, column, id))
  },
  report: (table, column, id) => {
    return pool.query(report(table, column, id))
  }
}