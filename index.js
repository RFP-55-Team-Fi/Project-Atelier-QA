const express = require('express');
const app = express();
const db = require('./db/index.js');


app.listen(3000, () => {
  console.log('listening on port 3000')
});
// app.use(express.urlencoded())

//routes
//GET /qa/questions
//GET /qa/questions/:question_id/answers
//POST /qa/questions
//POST /qa/questions/:question_id/answers
//PUT /qa/questions/:question_id/helpful
//PUT /qa/questions/:question_id/report
//PUT /qa/answers/:answer_id/helpful
//PUT /qa/answers/:answer_id/report

app.get('/qa/questions', (req, res) => {
  console.log(req.query);
  if (!req.query.product_id) {
    res.sendStatus(422)
  } else {
    var response = []
    //get questions
    //-------------
    db.questionPageQuery(req.query.product_id, req.query.count, req.query.page)
      .catch((err) => {
        console.log('error querying question table', err);
        res.sendStatus(500);
      })
      //get answers to questions
      //------------------------
      .then((results) => {
        return Promise.all(results.rows.map((question) => {
          response.push(question);
          return db.answersQuery(question.question_id);
        }))
          .catch((err) => {
            console.log('error getting answers', err)
            res.sendStatus(500);
          })
          //get photos for answers
          //----------------------
          .then((answers) => {
            Promise.all(answers.map((answerResult, i) => {
              response[i].answers = answerResult.rows;
              return Promise.all(answerResult.rows.map((answer) => {
                return db.photosQuery(answer.answer_id).then((photos) => {
                  answer['photos'] = photos.rows
                  console.log(answer, photos.rows)
                })
              }))
            }))
            .catch((err) => {
              console.log('errer getting answer photos', err)
              res.sendStatus(500);
            })
              .then(() => res.send(response))
          })
      })
      .catch((err) => {
        console.log('error on /qa/questions', err);
        res.sendStatus(500)
      })
  }
});

app.post('/qa/questions', (req, res) => {

});

app.get('/qa/questions/:question_id/answers', (req, res) => {

});

app.post('/qa/questions/:question_id/answers', (req, res) => {

});

app.put('qa/questions/:question_id/helpful', (req, res) => {

});

app.put('qa/questions/:question_id/report', (req, res) => {

});

app.put('/qa/answers/:answer_id/helpful', (req, res) => {

});

app.put('/qa/answers/:answer_id/helpful', (req, res) => {

});