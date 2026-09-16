//import any necessary models
import { getAllProjects } from '../models/projects.js';


const showProjectsPage = async (req, res) => {
  try {
    const projects = await getAllProjects();

    //console.log('Service projects:', projects);

    const title = 'Projects';
    res.render('projects', { title, projects });
  } catch (error) {
    console.error('Error fetching service projects:', error.message);
    res.status(500).send('Failed to load service projects: ' + error.message);
  }
};

export { showProjectsPage };