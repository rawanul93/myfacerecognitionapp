const handleRegister = (req, res, db, bcrypt) => {
    const { email, name, password } = req.body;
    //bcrypt.hash is asynchronos, meaning the rest of the code will keep running while this gets eexecuted
    //but we will use synchronous like below

    if(!email || !name || !password) {
       return res.status(400).json('Incorrect form submition');
       //return here means that since this whole thing is a function
       //if name, email or password is empty and the if statement is run
       //then the status 400 is returned and the function exits
       //thus not running the rest of the code underneath
    }

    const hash = bcrypt.hashSync(password);


    db.transaction(trx => { //we can use trx instead of db to make sure everything using trx is a transaction
        trx.insert({
            email: email,
            hash: hash
        })
        .into('login')
        .returning('email')
        .then(loginEmail => {
            return trx('users') //using trx thus making it part of that transaction
            .returning('*')
            .insert({
                email: loginEmail[0],
                name: name,
                joined: new Date()
            })
            .then(user => { //the response is the user registered due to knex .returning('*')
                res.json(user[0]); // 0 because the response is an array so we wanna grab the first and only data
             })
        })
        .then(trx.commit) //commits the above if there are no errors
        .catch(trx.rollback); //rolls back to before anything has been executed to the beginning if anything goes wrong 
    })
    .catch(err => res.status(400).json('Unable to Register')); //catch errors
}
module.exports = {
    handleRegister: handleRegister
};