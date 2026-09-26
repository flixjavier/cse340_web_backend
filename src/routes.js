import express from 'express';
import {showHomePage} from './controllers/index.js';
import { showOrganizationsPage } from './controllers/organizations.js';
import { showProjectsPage , showNewProjectForm, processNewProjectForm, showEditProjectForm, processEditProjectForm } from './controllers/projects.js';
import { testErrorRoute } from './controllers/errors.js';
import { showOrganizationDetailsPage, showNewOrganizationForm } from './controllers/organizations.js';
import { showProjectDetailsPage, projectValidation } from './controllers/projects.js';
import { showCategoriesPage, showCategoryDetailsPage, showAssignCategoriesForm, processAssignCategoriesForm } from './controllers/categories.js';
import { processNewOrganizationForm, organizationValidation, showEditOrganizationForm, processEditOrganizationForm } from './controllers/organizations.js';


const router = express.Router();
// Define routes
router.get('/', showHomePage);
router.get('/organizations', showOrganizationsPage);
router.get('/projects', showProjectsPage);
router.get('/categories', showCategoriesPage);

// Route for organization details page
router.get('/organization/:id', showOrganizationDetailsPage);

//Route for edit-organization details page
router.get('/edit-organization/:id', showEditOrganizationForm);


// Route for project details page
router.get('/project/:id', showProjectDetailsPage);

//error handling route for testing 500 errors
router.get('/test-error', testErrorRoute);
router.get('/category/:id', showCategoryDetailsPage); 

//Route for new organization page
router.get('/new-organization', showNewOrganizationForm); 

//Route to handle new organization form submission
router.post(`/new-organization`, organizationValidation, processNewOrganizationForm); 

//Route to handle organization update
router.post('/edit-organization/:id',organizationValidation,processEditOrganizationForm); 

//Route to handle new project
router.get('/new-project', showNewProjectForm);

//Route POST to handle new project
router.post('/new-project',projectValidation,processNewProjectForm); 

//Route to handle assign categories
router.get('/assign-categories/:projectId', showAssignCategoriesForm);

router.post('/assign-categories/:projectId', processAssignCategoriesForm)

//Route to handle edit projects
router.get('/edit-project/:id', showEditProjectForm);

//Route POST to handle update project
router.post('/edit-project/:id',projectValidation,processEditProjectForm); 


export default router;
