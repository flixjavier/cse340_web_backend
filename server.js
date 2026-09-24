import express from 'express';
import {fileURLToPath} from 'url';
import path from 'path';
import { testConnection } from './src/models/db.js';
import router from './src/routes.js';

// Define the application environment
const NODE_ENV = process.env.NODE_ENV?.toLowerCase() || 'production';

//Define the port number the server will listen on
const PORT = process.env.PORT || 3000;

// Get the current file path and directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create an instance of the Express application
const app = express();
// set ejs as the templating engine
app.set('view engine', 'ejs');

//tell express where to find your templates
app.set('views', path.join(__dirname, 'src/views'));

/**
 * configure Express middleware
 */
// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

//middleware to parse URL-encoded data and JSON data from POST
//Allow express to recieve and process common POST
app.use(express.urlencoded({extended: true})); 
app.use(express.json()); 

// where to find your templates
app.set('views', path.join(__dirname, 'src/views'));

//middleware to log all incoming requests
app.use((req, res, next) => {
  if (NODE_ENV === 'development') {
    console.log(`${req.method} ${req.url}`);
  }
  next();
});

//middleware to make NODE_ENV available in all templates
app.use((req,res,next)=> {
  res.locals.NODE_ENV = NODE_ENV;
  next(); 
})
/**
 * Routes
 */

app.use(router);

//catch all route for 404 errors

app.use((req,res,next) => {
  const err = new Error('Page Not Found');
  err.status = 404;
  next(err);
});

//global error handler
app.use((err,req,res,next) => {
  console.error('Error Occurred:', err.message);
  console.error('Stack Trace:', err.stack);

  //Determine the status and template
  const status = err.status || 500; 
  const template = status === 404 ? '404' : '500';
  
  //prepare data for the template
  const context = {
    title: status === 404 ? 'Page Not Found' : 'Server Error',
    error: err.message,
    stack: err.stack
  };

  //send response
  res.status(status).render(`errors/${template}`, context);
});

// Start the server and listen on the specified port

app.listen(PORT, async() => {
  try{
    await testConnection();
    console.log(`server is running at http://127.0.0.1:${PORT}`);
    console.log(`Environment: ${NODE_ENV}`);

  } catch (error) {
    console.error('Failed to start server:', error.message);
  }
});
