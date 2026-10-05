import  bcrypt  from 'bcrypt';
import { createUser } from '../models/users.js';

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

export { showUserRegistrationForm, processUserRegistrationForm }; 




