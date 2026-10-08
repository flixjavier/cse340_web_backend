import express from 'express';
import {showHomePage} from './controllers/index.js';
import { showOrganizationsPage } from './controllers/organizations.js';
import { showProjectsPage , showNewProjectForm, processNewProjectForm, showEditProjectForm, processEditProjectForm } from './controllers/projects.js';
import { testErrorRoute } from './controllers/errors.js';
import { showOrganizationDetailsPage, showNewOrganizationForm } from './controllers/organizations.js';
import { showProjectDetailsPage, projectValidation } from './controllers/projects.js';
import { showCategoriesPage, showCategoryDetailsPage, showAssignCategoriesForm, processAssignCategoriesForm, categoryValidation, showNewCategoryForm, processEditCategoryForm, processNewCategoryForm, showEditCategoryForm } from './controllers/categories.js';
import { processNewOrganizationForm, organizationValidation, showEditOrganizationForm, processEditOrganizationForm } from './controllers/organizations.js';
import { showUserRegistrationForm, processUserRegistrationForm, showLoginForm, processLoginForm, processLogout, requireLogin, showDashboard, requireRole, showUsersPage } from './controllers/users.js';


const router = express.Router();
// Define routes
router.get('/', showHomePage);
router.get('/organizations', showOrganizationsPage);
router.get('/projects', showProjectsPage);
router.get('/categories', showCategoriesPage);

// Route for organization details page
router.get('/organization/:id', showOrganizationDetailsPage);

//Route for edit-organization details page
router.get('/edit-organization/:id',requireRole('admin'), showEditOrganizationForm);


// Route for project details page
router.get('/project/:id', showProjectDetailsPage);

//error handling route for testing 500 errors
router.get('/test-error', testErrorRoute);
router.get('/category/:id', showCategoryDetailsPage); 

//Route for new organization page
router.get('/new-organization', requireRole('admin'), showNewOrganizationForm); 

//Route to handle new organization form submission
router.post(`/new-organization`, requireRole('admin'), organizationValidation, processNewOrganizationForm); 

//Route to handle organization update
router.post('/edit-organization/:id', requireRole('admin'), organizationValidation, processEditOrganizationForm); 

//Route to handle new project
router.get('/new-project', requireRole('admin'), showNewProjectForm);

//Route POST to handle new project
router.post('/new-project', requireRole('admin'), projectValidation, processNewProjectForm); 

//Route to handle assign categories
router.get('/assign-categories/:projectId',  requireRole('admin'), showAssignCategoriesForm);

router.post('/assign-categories/:projectId', requireRole('admin'), processAssignCategoriesForm)

//Route to handle edit projects
router.get('/edit-project/:id', requireRole('admin'), showEditProjectForm);

//Route POST to handle update project
router.post('/edit-project/:id',requireRole('admin'), projectValidation,processEditProjectForm); 

//Route for new categoy page
router.get('/new-category', requireRole('admin'), showNewCategoryForm); 

//Route POST to Handle new category form 
router.post(`/new-category`, requireRole('admin'), categoryValidation, processNewCategoryForm); 

//Route to handle edit category
router.get('/edit-category/:id', requireRole('admin'), showEditCategoryForm);

//Route POST to handle update category
router.post('/edit-category/:id',requireRole('admin'),categoryValidation,processEditCategoryForm); 

//Route for user registration page
router.get('/register', showUserRegistrationForm); 

router.post('/register', processUserRegistrationForm); 

//Route for user login page
router.get('/login', showLoginForm);

router.post('/login', processLoginForm);

//Route for user logout
router.get('/logout', processLogout);

//Route for dashboard page
router.get('/dashboard', requireLogin, showDashboard);

//Route for users page
router.get('/users', requireRole('admin', '/dashboard'), showUsersPage);

export default router;


