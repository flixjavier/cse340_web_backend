//import any necessary models
import { getAllProjects } from '../models/projects.js';
import { getUpcomingProjects, getProjectDetails } from '../models/projects.js';

const NUMBER_OF_UPCOMING_PROJECTS = 5; // Adjust this number as needed

const showProjectsPage = async (req, res, next) => {
  try {
    const projects = await getUpcomingProjects(NUMBER_OF_UPCOMING_PROJECTS);

    res.render('projects', { title: 'Upcoming Service Projects', projects });

    //console.log('Service projects:', projects);

  } catch (error) {
    console.error('Error fetching service projects:', error.message);
    res.status(500).send('Failed to load service projects: ' + error.message);
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
        return res.status(404).send('Project not found');
      }
      res. render('project', { title: project.title, project });
    }
    catch (error) {
      console.error('Error fetching project details:', error.message);
      res.status(500).send('Failed to load project details: ' + error.message);
    }
}

export { showProjectsPage, showProjectDetailsPage };
