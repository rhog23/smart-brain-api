const handleRegister = (req, res, db, bcrypt) => {
  const { email, name, password } = req.body;

  if (!email || !name || !password) {
    return res.status(400).json("incorrect form submission");
  }

  const saltRounds = 10;
  const hash = bcrypt.hashSync(password, saltRounds);

  db.transaction(trx => {
    trx
      .insert({
        hash: hash,
        email: email
      })
      .into("login")
      .then(() => {
        return trx("users")
          .insert({
            email: email,
            name: name,
            joined: new Date()
          })
          .then(user => {
            db.select("*")
              .from("users")
              .where("id", "=", user[0])
              .then(data => {
                res.json(data[0]);
              });
          });
      })
      .then(trx.commit)
      .catch(trx.rollback);
  }).catch(err => res.status(400).json("Unable to register"));
};

module.exports = {
  handleRegister: handleRegister
};
