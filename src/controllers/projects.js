//import any necessary models
import { getUpcomingProjects, getProjectDetails } from '../models/projects.js';
import { getCategoriesByProjectId } from '../models/categories.js';

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

export { showProjectsPage, showProjectDetailsPage };
