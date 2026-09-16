import express from 'express';
import {showHomePage} from './controllers/index.js';
import { showOrganizationsPage } from './controllers/organizations.js';
import { showProjectsPage } from './controllers/projects.js';
import { showCategoriesPage } from './controllers/categories.js';
import { testErrorRoute } from './controllers/errors.js';

const router = express.Router();

// Define routes
router.get('/', showHomePage);
router.get('/organizations', showOrganizationsPage);
router.get('/projects', showProjectsPage);
router.get('/categories', showCategoriesPage);

//error handling route for testing 500 errors
router.get('/test-error', testErrorRoute);

export default router;
