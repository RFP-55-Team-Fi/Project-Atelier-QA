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
    name: 'question-page-query',
    text: `SELECT *
    FROM questions
    WHERE product_id=$1
    AND reported=false
    ORDER BY (SELECT NULL)
    OFFSET $2 ROWS FETCH NEXT $3 ROWS ONLY`,
    values: [values.product_id, values.offset, values.count]
  }
}
const answerByQId = (question_id) => {
  return {
    name: 'answer-by-question-id',
    text: `SELECT *
    FROM answers
    WHERE question_id=$1
    AND reported=false`,
    values: [question_id]
  }
}
const photosByAId = (answer_id) => {
  return {
    name: 'photos-by-answer-id',
    text: `SELECT *
    FROM photos
    WHERE answer_id=$1`,
    values: [answer_id]
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
    console.log(values);
    return pool.query(questionPageQuery(values))
  },
  answersQuery: (question_id) => {
    return pool.query(answerByQId(question_id))
  },
  photosQuery: (answer_id) => {
    return pool.query(photosByAId(answer_id))
  }
}