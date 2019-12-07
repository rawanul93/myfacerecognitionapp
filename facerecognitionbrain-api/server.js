const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex') //for connecting to database.
const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');

const db = knex({ //from knex documentation and modify according to our needs.
    client: 'pg', //pg because we're using postgreSql.
    connection: {
      host : '127.0.0.1', //this is just local host
      user : '',
      password : '',
      database : 'smart-brain'
    }
});

const app = express();

//MIDDLEWARE
app.use(bodyParser.json()); //parsing all info as json
app.use(cors()); //lets us allow one localhost port to access another

//SIGN IN
app.post('/signin', (req, res) => { //for post methods we will have access to req.body
    signin.handleSignin(req, res, db, bcrypt);
})

//REGISTER
app.post('/register', (req, res) => { 
    register.handleRegister(req, res, db, bcrypt)
})

//GET ID
app.get('/profile/:id', (req, res) => { 
    profile.getProfile(req, res, db)
})

app.put('/image', (req,res) => {
    const { id } = req.body;
        db('users').where('id','=',id)
        .increment('entries', 1) //increment(column, amount) is a knex feature. Instead of having to select the entries again
        .returning('entries') //another knex feature. Instead of selecting the entries all over again, returning() just returns the value
        .then(entries => {
            res.json(entries[0]); //doing [0] since we get an array and there will always be one item only
        })
        .catch(err=> res.status(400).json('unable to get entries'))
})

//CONNECT TO LOCALHOST
app.listen(3000, () => { //second parameter is added as a function
    //that runs right after it connects to the port
    console.log('app is running on port 3000');
})

/*  PLANNING THE API
/--> res = this is working
/signin --> POST = success/fail (post req because we dont wanna send
                        password as a query string. We wanna
                        rather post in the body over https)
/resgister --> POST = user (new user object)
/profile/:userId --> GET = user 
/image -- > PUT = user (put because its an update)
*/