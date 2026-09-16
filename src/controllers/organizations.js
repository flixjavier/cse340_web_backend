//import any necessary models
import { getAllOrganizations } from '../models/organizations.js';

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

export { showOrganizationsPage };