const jwt = require('jsonwebtoken');
const CustomAPIError = require('../errors/custom-error');

const login = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    //usando bd esto se podria validar con mongoose.Otra forma es usando joi
    throw new CustomAPIError('Please provide email and password', 400);
  }

  //just for demo, normally provided by DB!!!!
  const id = new Date().getDate();

  // try to keep payload small, better experience for user
  // just for demo, in production use long, complex and unguessable string value!!!!!!!!!
  const token = jwt.sign({ id, username }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });

  res.status(200).send({ msg: 'user created', token });
};

const dashboard = async (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new CustomAPIError('No token provided', 401);
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded);

    const luckyNumber = Math.floor(Math.random() * 100);

    res.status(200).json({
      msg: `Hello,${decoded.username}`,
      secret: `Here is your authorized data,your lucky number is ${luckyNumber}`, // para demostrar que son diferentes requests(al dar numeros diferentes)
    }); // decode tiene id,username que son los del payload al hacer sign,entre otros
  } catch (error) {
    throw new CustomAPIError('Not authorized to access this route', 401); // si por ejemplo el token expiro
  }
  //console.log(req.headers);
};

module.exports = {
  login,
  dashboard,
};
