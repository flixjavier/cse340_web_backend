//import any necessary models
import { getAllOrganizations, getOrganizationDetails } from '../models/organizations.js';
import { getProjectsByOrganizationId } from '../models/projects.js';
import { createOrganization } from '../models/organizations.js';
import { body, validationResult } from 'express-validator';

// Define validation and sanitization rules for organization form
// Define validation rules for organization form

const organizationValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Organization name required')
    .isLength({min: 3,max: 150})
    .withMessage('Organization name must be between 3 and 150 characters').escape(),
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Description can not be empty')
    .isLength( { max: 500 } )
    .withMessage('Description should be max of 500 characters').escape(),
  body('contactEmail')
    .trim()
    .notEmpty()
    .withMessage('Enter an email')
    .isEmail()
    .withMessage('Input a valid email')
    .normalizeEmail()
  ]; 



const showOrganizationsPage = async (req, res, next) => {
  try {
    const organizations = await getAllOrganizations();
    const title = 'Organizations';
    res.render('organizations', { title, organizations });
  } catch (error) {
    console.error('Error fetching organizations:', error.message);
    next(error); // Pass the error to the next middleware for centralized error handling
  }
};

const showOrganizationDetailsPage = async (req, res, next) => {
  try {
    const organizationId = req.params.id; 
    const organizationDetails = await getOrganizationDetails(organizationId); 
    if (!organizationDetails) {
      const error = new Error('Organization not found');
      error.status = 404;
      return next(error);
    }
    const projects = await getProjectsByOrganizationId(organizationId);
    const title = 'Organization Details';

    res.render('organization', { title, organizationDetails, projects });
  } catch (error) {
    console.error('Error fetching organization details:', error.message);
    next(error); // Pass the error to the next middleware for centralized error handling
  }
}; 

const showNewOrganizationForm = async (req,res) => {
  const title = `Add New Organization`; 

  res.render(`new-organizations`, { title }); 
}

const processNewOrganizationForm = async (req, res) => {
  //check Validations
  const results = validationResult(req);
  if (!results.isEmpty()) {
    //validation failed - loop through errors
    results.array().forEach((error) => {
      req.flash('error', error.msg);
    });
    //redirect to /new-organization
    return res.redirect('/new-organization');
  }
  const { name, description, contactEmail } = req.body; 
  const logoFilename = 'placeholder-logo.png';  //use the placeholder logo for all new organizations
  const organizationId = await createOrganization(name, description, contactEmail, logoFilename); 
  //set a success flash message
  req.flash('success',`${name} added successfuly`)

  res.redirect(`/organization/${organizationId}`); 
}

export { showOrganizationsPage, showOrganizationDetailsPage, showNewOrganizationForm, processNewOrganizationForm, organizationValidation};  
