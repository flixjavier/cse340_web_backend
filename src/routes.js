import express from 'express';
import {showHomePage} from './controllers/index.js';
import { showOrganizationsPage } from './controllers/organizations.js';
import { showProjectsPage } from './controllers/projects.js';
import { testErrorRoute } from './controllers/errors.js';
import { showOrganizationDetailsPage, showNewOrganizationForm } from './controllers/organizations.js';
import { showProjectDetailsPage } from './controllers/projects.js';
import { showCategoriesPage, showCategoryDetailsPage } from './controllers/categories.js';
import { processNewOrganizationForm } from './controllers/organizations.js';


const router = express.Router();
// Define routes
router.get('/', showHomePage);
router.get('/organizations', showOrganizationsPage);
router.get('/projects', showProjectsPage);
router.get('/categories', showCategoriesPage);

// Route for organization details page
router.get('/organization/:id', showOrganizationDetailsPage);

// Route for project details page
router.get('/project/:id', showProjectDetailsPage);

//error handling route for testing 500 errors
router.get('/test-error', testErrorRoute);
router.get('/category/:id', showCategoryDetailsPage); 

//Route for new organization page
router.get('/new-organization', showNewOrganizationForm); 

//Route to handle new organization form submission
router.post(`/new-organization`, processNewOrganizationForm); 


export default router;
