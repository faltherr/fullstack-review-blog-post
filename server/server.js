const express = require('express')
const session = require('express-session')
const massive = require('massive')
const bodyParser = require('body-parser')
require('dotenv').config()

const AuthCtrl = require('./controllers/AuthController')
const PostCtrl = require ('./controllers/PostsController')

const app = express()
const port = process.env.PORT || 4007

massive(process.env.CONNECTION_SESSION).then(db => {
  app.set('db', db)
  console.log('db is connected!')
})

app.use(session({
  secret: process.env.SESSION_SECRET,
  saveUninitialized: false,
  resave: false
}))

app.use(bodyParser.json())

//Endpoints

//User information Block
app.get("/auth/callback", AuthCtrl.auth)

app.get("/api/currentUser", (req, res)=> {
    res.send(req.session.user)
} )

app.get('/api/logout', (req,res) => {
    req.session.destroy()
    res.sendStatus(200)
})


//Post controller block
app.get('/api/posts', PostCtrl.read)

app.post('/api/posts', PostCtrl.create)


app.listen(port, () => {
  console.log('listening on port:', port)
})