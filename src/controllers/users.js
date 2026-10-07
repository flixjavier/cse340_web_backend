import  bcrypt  from 'bcrypt';
import { createUser, authenticateUser } from '../models/users.js';

const showUserRegistrationForm = (req, res) => {
  res.render('register', {title: 'Register'}); 
};

const processUserRegistrationForm = async (req, res) =>{
  try {
    const { name, email, password } = req.body;
    const salt = await bcrypt.genSalt(10);

    const passwordHash = await bcrypt.hash(password, salt);

    const userId = await createUser(name, email, passwordHash);
    req.flash('success', 'Registration successful! please log in.');

    res.redirect('/');

  }
  catch (error) {
    console.error(error);
    req.flash('error', 'Registration failed, please try again.');
    res.redirect('/register'); 

  }

};

const showLoginForm = (req, res) => {
  res.render('login', { title: 'Login'}); 

};

const processLoginForm =async (req, res)=> {
  const {email, password} = req.body;
  try {
    const user = await authenticateUser(email, password); 
    if (user) {
      req.session.user = user;
      req.flash('success','Login successful!');
      res.locals.NODE_ENV === 'development' ? console.log('User logged in: ', user) : null;
      res.redirect('/dashboard'); 
      
    }
    else {
      req.flash('error','Invalid email or password');
      res.redirect('/login');
    }
  }
  catch (error) {
    console.error(error); 
    req.flash('error', 'An error occurred during login. Please try again.');
    res.redirect('/login');
  }
};

const processLogout = (req, res) => {
  if (req.session.user) {
    delete req.session.user; 
  }
  req.flash('success','You have been logged out.'); 
  res.redirect('/login');

};

const requireLogin = (req, res, next) => {
  if (!req.session || !req.session.user) {
    req.flash('error', 'You must be logged in to access this page.');
    return res.redirect('/login');
  }
  next();
};

const showDashboard = (req, res) => {
  const user = req.session.user;
  res.render('dashboard', { title: 'Dashboard', name: user.name, email: user.email });
};

const requireRole = (role) => {
  return (req, res, next) => {
    if (!req.session || !req.session.user) {
      req.flash('error', 'Please log in to access this page.');
      return res.redirect('/login');
    }
    if (req.session.user.role_name !== role){
      req.flash('error','User does not have the required permissions to access this page.');
      return res.redirect('/');
    }
    next();

  };
};


export { showUserRegistrationForm, processUserRegistrationForm, showLoginForm, processLoginForm, processLogout, requireLogin, showDashboard, requireRole }; 




