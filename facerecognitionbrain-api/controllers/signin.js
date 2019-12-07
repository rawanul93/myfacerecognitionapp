const handleSignin = (req, res, db, bcrypt) => {

    const { password, email } = req.body;

    if(!email || !password) {
        return res.status(400).json('Incorrect form submition');
    }

    db.select('email','hash').from('login')
    .where('email', '=', email)
    .then(data => {
       const isValid =  bcrypt.compareSync(password, data[0].hash);
       if (isValid) {
           return db.select('*').from('users') //returning because we want the login database to know about it
           .where('email','=',email)
           .then(user => {
             res.json(user[0])
           })
           .catch(err => res.status(400).json('unable to find user'))
       }
       else {
           res.status(400).json('wrong credentials');
       }
    })
    .catch(err => res.status(400).json('wrong login information'))
}

module.exports = {
    handleSignin: handleSignin
};