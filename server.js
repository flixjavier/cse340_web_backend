import express from 'express';
import {fileURLToPath} from 'url';
import path from 'path';


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

/**
 * Routes
 */

app.get('/', async(req, res) => {
  const title = 'Home';
  res.render('home', { title });
});

app.get('/organizations', async(req, res) => {
  const title = 'Organizations';
  res.render('organizations', { title });
});

app.get('/projects', async(req, res) => {
  const title = 'Projects';
  res.render('projects', { title });
});

app.get('/categories', async(req, res) => {
  const title = 'Categories';
  res.render('categories', { title });
});

// Start the server and listen on the specified port

app.listen(PORT, () => {
  console.log(`Server is running at http://127.0.0.1:${PORT}`);
  console.log(`Environment: ${NODE_ENV}`);
});


