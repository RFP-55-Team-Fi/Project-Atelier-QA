# Introduction

This is the server and database for the "Questions and Answers" micro-services which supports a retail web application, and is optimize to handle webscale traffic.

# Tech Stack 

![node](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![AWS](https://img.shields.io/badge/AWS-%23FF9900.svg?style=for-the-badge&logo=amazon-aws&logoColor=white)
![docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)
![Nginx](https://img.shields.io/badge/nginx-%23009639.svg?style=for-the-badge&logo=nginx&logoColor=white)
![postgresql](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)

# System Architecture 

![Architecture diagram](./docs/diagram3.png?raw=true)

# API Routes

## 1. List Questions
GET /qa/questions 
>Retrieves a list of questions for a particular product. This list does not include any reported questions.

Parameters

| Parameter  |	Type   |	Description                                                     |
| ---------- | ------- | ---------------------------------------------------------------- |
| product_id | integer | Specifies the product for which to retrieve questions.           |
| page	     | integer | Selects the page of results to return. Default 1.                |
| count      | integer | Specifies how many results per page to return. Default 5.        |

Response

**Status: 200 OK**

```
{
  "product_id": "5",
  "results": [{
        "question_id": 37,
        "question_body": "Why is this product cheaper here than other sites?",
        "question_date": "2018-10-18T00:00:00.000Z",
        "asker_name": "williamsmith",
        "question_helpfulness": 4,
        "reported": false,
        "answers": {
          68: {
            "id": 68,
            "body": "We are selling it here without any markup from the middleman!",
            "date": "2018-08-18T00:00:00.000Z",
            "answerer_name": "Seller",
            "helpfulness": 4,
            "photos": []
            // ...
          }
        }
      },
      {
        "question_id": 38,
        "question_body": "How long does it last?",
        "question_date": "2019-06-28T00:00:00.000Z",
        "asker_name": "funnygirl",
        "question_helpfulness": 2,
        "reported": false,
        "answers": {
          70: {
            "id": 70,
            "body": "Some of the seams started splitting the first time I wore it!",
            "date": "2019-11-28T00:00:00.000Z",
            "answerer_name": "sillyguy",
            "helpfulness": 6,
            "photos": [],
          },
          78: {
            "id": 78,
            "body": "9 lives",
            "date": "2019-11-12T00:00:00.000Z",
            "answerer_name": "iluvdogz",
            "helpfulness": 31,
            "photos": [],
          }
        }
      },
      // ...
  ]
}
```

## 2. Answers List
GET /qa/questions/:question_id/answers
>Returns answers for a given question. This list does not include any reported answers.

Parameters 

 | Parameter   | Type    | Description                                             |
 | ----------- | ------- | ------------------------------------------------------- | 
 | question_id | integer | Required ID of the question for wich answers are needed |
 
 Query Parameters
 
| Parameter |	Type    |	Description                                               |
|---------- | ------- | --------------------------------------------------------- |
| page	    | integer |	Selects the page of results to return. Default 1.         |
| count     |	integer |	Specifies how many results per page to return. Default 5. |

Response 

**Status: 200 OK**

```
{
  "question": "1",
  "page": 0,
  "count": 5,
  "results": [
    {
      "answer_id": 8,
      "body": "What a great question!",
      "date": "2018-01-04T00:00:00.000Z",
      "answerer_name": "metslover",
      "helpfulness": 8,
      "photos": [],
    },
    {
      "answer_id": 5,
      "body": "Something pretty durable but I can't be sure",
      "date": "2018-01-04T00:00:00.000Z",
      "answerer_name": "metslover",
      "helpfulness": 5,
      "photos": [{
          "id": 1,
          "url": "urlplaceholder/answer_5_photo_number_1.jpg"
        },
        {
          "id": 2,
          "url": "urlplaceholder/answer_5_photo_number_2.jpg"
        },
        // ...
      ]
    },
    // ...
  ]
}
```

## 3. Add a Question

Post /qa/questions
> Adds a question for the given product

Body Parameters

| Parameter  | Type    | Description                                                 |
| ---------- | ------- | ----------------------------------------------------------- |
| body	     | text    |	Text of question being asked                               |
| name	     | text	   | Username for question asker                                 |
| email	     | text    | Email address for question asker                            |
| product_id | integer | Required ID of the Product for which the question is posted |

Response

**Status: 201 CREATED**

## 4. Add an Answer

POST /qa/questions/:question_id/answers

Parameters

| Parameter	   | Type	   | Description                                        |
| ------------ | ------- | -------------------------------------------------- |
| question_id	 | integer | Required ID of the question to post the answer for |

Body Parameters 


| Parameter |	Type   | Description                                         |
| --------- | ------ | --------------------------------------------------- |
| body	    | text	 | Text of question being asked                        |
| name	    | text	 | Username for question asker                         |
| email	    | text	 | Email address for question asker                    |
| photos	  | [text] | An array of urls corresponding to images to display |

Response

**Status: 201 CREATED**

## 5. Mark Question as Helpful

PUT /qa/questions/:question_id/helpful
>Updates a question to show it was found helpful.

Parameters

| Parameter	  | Type	  | Description                           |
| ----------- | ------- | ------------------------------------- |
| question_id |	integer |	Required ID of the question to update |

Response 

**Status: 204 NO CONTENT**

## 6. Report Question

PUT /qa/questions/:question_id/report
>Updates a question to show it was reported. Note, this action does not delete the question, but the question will not be returned in the above GET request.

Parameters

| Parameter	  | Type	  | Description                           |
| ----------- | ------- | ------------------------------------- |
| question_id | integer | Required ID of the question to update |

Response
**Status: 204 NO CONTENT**

## 7. Mark Answer as Helpful

PUT /qa/answers.:answer_if/helpful
>Updates an answer to show it was found helpful.

Parameters

| Parameter	| Type	  | Description                         |
| --------- | ------- | ----------------------------------- |
| answer_id |	integer |	Required ID of the answer to update |

Response
**Status: 204 NO CONTENT**

## 8. Report Answer

PUT /qa/answers/:answer_id/report
>Updates an answer to show it has been reported. Note, this action does not delete the answer, but the answer will not be returned in the above GET request.

Parameters

| Parameter	| Type	  | Description                         |
| --------- | ------- | ----------------------------------- |
| answer_id |	integer |	Required ID of the answer to update |

Response

**Status: 204 NO CONTENT**
