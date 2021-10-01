const express = require('express');
const app = express();
const db = require('./db/index.js');


app.listen(3000, () => {
  console.log('listening on port 3000')
});
app.use(express.json())

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
  if (!req.query.product_id) {
    res.sendStatus(422)
  } else {
    var response = [];
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
  if (!req.body.body || !req.body.name ||
    !req.body.email || !req.body.product_id) {
    res.sendStatus(422);
  } else {
    db.insertQuestion(req.body)
      .catch((err) => {
        console.log('error posting question', err);
        res.sendStatus(422)
      })
      .then(() => res.sendStatus(201))
  }
});

app.get('/qa/questions/:question_id/answers', (req, res) => {
  var response = [];
  db.answersPageQuery(req.params.question_id, req.query.count, req.query.page)
    .catch((err) => {
      console.log('error getting answers', err)
      res.sendStatus(500)
    })
    .then((answersResults) => {
      // console.log(answersResults.rows)
      return Promise.all(answersResults.rows.map((answer) => {
        response.push(answer);
        return db.photosQuery(answer.answer_id).then((photos) => {
          answer['photos'] = photos.rows
        })
          .catch((err) => {
            console.log('errer getting answer photos', err)
            res.sendStatus(500);
          })
      }))
        .then(() => res.send(response))

    })
    .catch((err) => {
      console.log('error getting answers', err)
    })
});

app.post('/qa/questions/:question_id/answers', (req, res) => {
  req.body.question_id = req.params.question_id;
  if (!req.body.body || !req.body.name ||
    !req.body.email || !req.body.question_id) {
    res.sendStatus(422);
  } else {
    db.insertAnswer(req.body)
      .then((answer_id) => {
        if (!req.body.photos || req.body.photos.length === 0) {
          res.sendStatus(201)
        } else {
          Promise.all(req.body.photos.map((photo) => {
            photo.answer_id = answer_id;
            console.log(answer_id.rows)
            return db.insertPhoto({
              url: photo,
              answer_id: answer_id.rows[0].answer_id
            })
          }))
            .then(() => {
              res.sendStatus(201)
            })
            .catch((err) => {
              console.log('error inserting photos', err)
              res.sendStatus(422)
            })
        }
      })
      .catch((err) => {
        console.log('error posting answer', err)
        res.sendStatus(422);
      })
  }
});

app.put('/qa/questions/:question_id/helpful', (req, res) => {
  db.markHelpful('questions', 'question_id', req.params.question_id)
    .then(() => res.sendStatus(201))
    .catch((err) => {
      console.log(`error marking question as helpful`, err);
      res.sendStatus(500);
    });
});

app.put('/qa/questions/:question_id/report', (req, res) => {
  db.report('questions', 'question_id', req.params.question_id)
  .then(() => res.sendStatus(201))
  .catch(() => {
    console.log('error reporting question', err)
  });
});

app.put('/qa/answers/:answer_id/helpful', (req, res) => {
  db.markHelpful('answers', 'answer_id', req.params.answer_id)
    .then(() => res.sendStatus(201))
    .catch((err) => {
      console.log('error marking answer as helpful', err);
      res.sendStatus(500);
    })
});

app.put('/qa/answers/:answer_id/report', (req, res) => {
  db.report('answers', 'answer_id', req.params.answer_id)
  .then(() => res.sendStatus(201))
  .catch(() => {
    console.log('error reporting answer', err)
  });
});