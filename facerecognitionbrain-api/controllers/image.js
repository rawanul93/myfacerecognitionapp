const Clarifai = require('clarifai');

const app = new Clarifai.App({
    apiKey: 'e90591a3861f4791acb6988dc524fd2f'
  });

const handleApiCall = (req, res) => {
    app.models
    .predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
    .then(data => {
        res.json(data)
    })
    .catch(err=> res.status(400).json('unable to work with api'))
}


  const updateEntries = (req, res, db) => {
    const { id } = req.body;
    
    db('users').where('id','=',id)
    .increment('entries', 1) //increment(column, amount) is a knex feature. Instead of having to select the entries again
    .returning('entries') //another knex feature. Instead of selecting the entries all over again, returning() just returns the value
    .then(entries => {
        res.json(entries[0]); //doing [0] since we get an array and there will always be one item only
    })
    .catch(err=> res.status(400).json('unable to get entries'))
}

module.exports = {
    updateEntries = updateEntries,
    handleApiCall = handleApiCall
}