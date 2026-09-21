//import any necessary models
import { getAllOrganizations, getOrganizationDetails } from '../models/organizations.js';
import { getProjectsByOrganizationId } from '../models/projects.js';

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

export { showOrganizationsPage, showOrganizationDetailsPage };  
  