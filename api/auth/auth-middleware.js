const Users = require('../users/users-model');

/*
  If the user does not have a session saved in the server

  status 401
  {
    "message": "You shall not pass!"
  }
*/
function restricted(req, res, next) {
  console.log('restricted');
  next();
}

/*
  If the username in req.body already exists in the database

  status 422
  {
    "message": "Username taken"
  }
*/
async function checkUsernameFree(req, res, next) {
  try {
    const usernames = await Users.findBy({ username: req.body.username });
    if (!usernames.length) {
      next();
    } else {
      next({ status: 422, message: 'Username taken' });
    }
  } catch (err) {
    next(err);
  }
}

/*
  If the username in req.body does NOT exist in the database

  status 401
  {
    "message": "Invalid credentials"
  }
*/
async function checkUsernameExists(req, res, next) {
  try {
    const usernames = await Users.findBy({ username: req.body.username });
    if (usernames.length) {
      next();
    } else {
      next({
        status: 401,
        message: 'Invalid credentials'
      });
    }
  } catch (err) {
    next(err);
  }
  next();
}

/*
  If password is missing from req.body, or if it's 3 chars or shorter

  status 422
  {
    "message": "Password must be longer than 3 chars"
  }
*/
function checkPasswordLength(req, res, next) {
  const { password } = req.body;
  if (!password || password.length < 3) {
    next({
      status: 422,
      message: 'Password must be longer than 3 chars'
    });
  } else {
    next();
  }
  //get password from req.body
  //if no password err
  //if password move on
  //if password is too small err
  //if password move on
  //if either no password of password short err 422 - same message

}

// Don't forget to add these to the `exports` object so they can be required in other modules
module.exports = {
  restricted,
  checkUsernameFree,
  checkUsernameExists,
  checkPasswordLength
};