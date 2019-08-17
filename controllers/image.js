const Clarifai = require("clarifai");

const app = new Clarifai.App({
  apiKey: "016bd6d73057404f9044493f16960b6d"
});

const handleAPICall = (req, res) => {
  app.models
    .predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
    .then(data => {
      res.json(data);
    })
    .catch(err => res.status(400).json("unable to work with API"));
};

const handleImage = (req, res, db) => {
  const { id } = req.body;
  db("users")
    .where("id", "=", id)
    .increment("entries", 1)
    .then(() => {
      return db("users")
        .select("entries")
        .where({ id })
        .then(data => {
          res.json(data[0].entries);
        });
    })
    .catch(err => res.status(400).json("unable to update entries"));
};

module.exports = {
  handleImage,
  handleAPICall
};
