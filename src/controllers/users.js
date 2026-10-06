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
      res.redirect('/'); 
      
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

export { showUserRegistrationForm, processUserRegistrationForm, showLoginForm, processLoginForm, processLogout }; 




