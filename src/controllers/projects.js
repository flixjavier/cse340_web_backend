//import any necessary models
import { getUpcomingProjects, getProjectDetails, createProject } from '../models/projects.js';
import { getCategoriesByProjectId } from '../models/categories.js';
import { getAllOrganizations } from "../models/organizations.js";
import { body, validationResult } from "express-validator";

const projectValidation = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({min: 3,max: 200})
    .withMessage('Title must be between 3 and 200 characters'), 
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Description is required')
    .isLength({max: 1000})
    .withMessage('Description must be at most 1000 characters'), 
  body('location')
    .trim()
    .notEmpty()
    .withMessage('Location is required')
    .isLength({max: 200})
    .withMessage('Location must be at most 200 characters'),
  body('date')
    .trim()
    .notEmpty()
    .withMessage('Date is required')
    .isISO8601()
    .withMessage('Date must be valid, for example 2026-10-15'),
  body('organizationId')
    .trim()
    .notEmpty()
    .withMessage('Organization is required')
    .isInt()
    .withMessage('Organization must be a valid integer'),
  ]; 


const NUMBER_OF_UPCOMING_PROJECTS = 5; // Adjust this number as needed

const showProjectsPage = async (req, res, next) => {
  try {
    const projects = await getUpcomingProjects(NUMBER_OF_UPCOMING_PROJECTS);
    res.render('projects', { title: 'Upcoming Service Projects', projects });

    //console.log('Service projects:', projects);

  } catch (error) {
    console.error('Error fetching service projects:', error.message);
    next(error); // Pass the error to the next middleware for centralized error handling
  }
};

const showNewProjectForm = async (req, res, next) => {
  try {
    const organizations = await getAllOrganizations()
    res.render('new-project', { title: 'Add new Service Project', organizations });


  } catch (error) {
    console.error('Error fetching service organizations:', error.message);
    next(error); // Pass the error to the next middleware for centralized error handling
  }
};

const showProjectDetailsPage = async (req, res, next) => {
    try {
      const id = req.params.id;
      if (!/^[1-9]\d*$/.test(id)) {
        return res.status(400).send('Invalid project ID');
      }
      const project = await getProjectDetails(id);
      if (!project) {
        const error = new Error('Project not found');
        error.status = 404;
        return next(error);
      }
      const categories = await getCategoriesByProjectId(id);
      res.render('project', { title: project.title, project, categories });
    }
    catch (error) {
      console.error('Error fetching project details:', error.message);
      next(error); // Pass the error to the next middleware for centralized error handling
    }
}

const processNewProjectForm = async (req,res,next) => {
  try {
    const results = validationResult(req);
    if (!results.isEmpty()) {
      results.array().forEach((error) => {
      req.flash('error', error.msg);
      });
      //redirect to /new-organization
      return res.redirect('/new-project');
    }
    const { title, description, location, date, organizationId} = req.body; 
    await createProject (title, description, location, date, organizationId);
    //set a success flash message
    req.flash('success',`Service project ${title} created`)
    res.redirect(`/projects`);
  } catch (error) {
    next(error)
  }
}

export { showProjectsPage, showProjectDetailsPage, showNewProjectForm, processNewProjectForm, projectValidation};
