//import any necessary models
import { getAllOrganizations, getOrganizationDetails } from '../models/organizations.js';
import { getProjectsByOrganizationId } from '../models/projects.js';

const showOrganizationsPage = async (req, res) => {
  try {
    const organizations = await getAllOrganizations();
    const title = 'Organizations';
    res.render('organizations', { title, organizations });
  } catch (error) {
    console.error('Error fetching organizations:', error.message);
    res.status(500).send('Failed to load organizations: ' + error.message);
  }
};

const showOrganizationDetailsPage = async (req, res) => {
  try {
    const organizationId = req.params.id; 
    const organizationDetails = await getOrganizationDetails(organizationId); 
    const projects = await getProjectsByOrganizationId(organizationId);
    const title = 'Organization Details';

    res.render('organization', { title, organizationDetails, projects });
  } catch (error) {
    console.error('Error fetching organization details:', error.message);
    res.status(500).send('Failed to load organization details: ' + error.message);
  }
}; 

export { showOrganizationsPage, showOrganizationDetailsPage };  
  