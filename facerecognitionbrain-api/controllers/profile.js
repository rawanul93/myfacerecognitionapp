const getProfile = (req, res, db) => {

    //req.params will get the parameter id
    const { id } = req.params;
    db.select('*').from('users').where({
        id:id
    })
    .then(user => {
        if (user.length) {
            res.json(user[0]);
        }
        else {
            res.status(400).json('Not found');
        }
    })
    .catch(err => res.status(400).json('Error getting user'))
    //doest catch error without the if else above because even if the id doesnt exsist, 
    //db returns an empty array which is still considered a success.
    //so we have to check for array length to determine whether we actually found a user or not
}

module.exports = {
    getProfile: getProfile
}