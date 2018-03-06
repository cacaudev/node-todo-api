let {User} = require('./../server/models/user');

let authenticate = (req, res, next) => {
  let token = req.header('x-auth');

  User.findByToken(token).then((user) => {
    if (!user) return Promise.reject();
    req.user = user;
    req.token = token;
    next();
  }).catch((error) => {
    res.sendStatus(401);
  });
};


module.exports = {authenticate};