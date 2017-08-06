// const data = require('./data')
const express = require('express')
const path = require('path')
const mustacheExpress = require('mustache-express')
const bodyParser = require('body-parser')
const expressSession = require('express-session')
const app = express()
const pgPromise = require('pg-promise')()
const database = pgPromise({ database: 'RobotDatabase' })
const query = 'SELECT * FROM "robotdb"'

// Schema:
// CREATE TABLE robotDB (
// "id" SERIAL PRIMARY KEY,
// "username" VARCHAR(100) NOT NULL,
// “imageurl” VARCHAR(100) NULL,
// “email” VARCHAR(100) NULL,
// “university” VARCHAR(100) NULL,
// “address” VARCHAR(100) NULL,
// “city” VARCHAR(100) NULL,
// “state” VARCHAR(100) NULL,
// “postal_code” VARCHAR(100) NULL,
// “job” VARCHAR(100) NULL,
// “company” VARCHAR(100) NULL,
// “year_built” VARCHAR(100) NULL,
// “next_service_date” DATE,
// “is_active” BOOLEAN);
app.use(
  expressSession({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
  })
)
app.use(express.static('public'))
app.use(bodyParser.json())
app.engine('mustache', mustacheExpress())
app.set('views', './views')
app.set('view engine', 'mustache')
//Can use mst instead of mustache. This is apparently very common.
// app.listen(3000, () => {
//   console.log("Let's do this!")
// })
app.get('/users/:id', (req, res) => {
  // Pull out the ID from the url
  const id = parseInt(req.params.id)

  // Go find the todo with this ID in the database
  //database.one('SELECT * FROM "todos" WHERE id = $1', idFromTheParamsWeGotFromTheURL)
  database
    .one('SELECT * FROM "todos" WHERE id = $(id)', { id: id })
    // Bring back its details!
    .then(rows => {
      // Render a template
      res.render('users', rows)
    })
})
app.get('/', (req, res) => {
  database.any(query).then(rows => {})
  res.render('index', rows)
})
app.get('/users/:id', (req, res) => {
  const userData = {
    id: req.params.id
  }
  function findUser(user) {
    return user.id === userData.id
  }
  const oneUser = data.users.find(findUser)
  res.render('users', oneUser)
})
