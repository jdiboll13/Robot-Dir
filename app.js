// const data = require('./data')
const express = require('express')
const path = require('path')
const mustacheExpress = require('mustache-express')
const bodyParser = require('body-parser')
const expressSession = require('express-session')
const app = express()
const pgPromise = require('pg-promise')()
const database = pgPromise({ database: 'RobotDatabase' })
const query = 'SELECT * FROM robotdb'
const queryuser = 'SELECT * FROM robotdb WHERE id = ${id}'

app.use(
  expressSession({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
  })
)
app.use(express.static('public'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.engine('mustache', mustacheExpress())
app.set('views', './views')
app.set('view engine', 'mustache')

app.listen(3000, () => {
  console.log("Let's do this!")
})
app.get('/', (req, res) => {
  database.any(query).then(rows => {
    // rows.forEach()
    console.log(rows)
    res.render('index', rows)
  })
})
app.get('/users/:id', (req, res) => {
  // Pull out the ID from the url
  const id = req.params.id

  // Go find the todo with this ID in the database
  //database.one('SELECT * FROM "todos" WHERE id = $1', idFromTheParamsWeGotFromTheURL)
  database
    .one(queryuser, { id: id })
    // Bring back its details!
    .then(data => {
      console.log(data)
      // Render a template
      res.render('users', data)
    })
})

// app.get('/users/:id', (req, res) => {
//   const userData = {
//     id: req.params.id
//   }
//   function findUser(user) {
//     return user.id === userData.id
//   }
//   const oneUser = data.users.find(findUser)
//   res.render('users', oneUser)
// })
