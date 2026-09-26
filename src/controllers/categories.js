import { getAllCategories, getCategoryDetails, getCategoriesByProjectId, updateCategoryAssignments } from '../models/categories.js';
import { getProjectsByCategoryId, getProjectDetails } from '../models/projects.js';


const showCategoriesPage = async (req, res, next) => {
  try{
    const categories = await getAllCategories();
    //console.log('Service categories:', categories);
    const title = 'Categories';
    res.render('categories', { title, categories });
  } catch (error) {
    console.error('Error fetching categories:', error.message);
    next(error); // Pass the error to the next middleware for centralized error handling
  }
};

const showCategoryDetailsPage = async (req, res, next) => {
  try {
    const categoryId = req.params.id;
    if (!/^[1-9]\d*$/.test(categoryId)) {
      return res.status(400).send('Invalid category ID');
    }
    const categoryDetails = await getCategoryDetails(categoryId); 
    if (!categoryDetails) {
      const error = new Error('Category not found'); 
      error.status = 404; 
      return next(error);
    }
    const projects = await getProjectsByCategoryId(categoryId); 
    const title = 'Category Details'; 
    res.render('category', { title, categoryDetails, projects });  

  } catch (error) {
    console.error('Error fetching category details:', error.message);
    next(error); // Pass the error to the next middleware for centralized error handling
  }
}; 

const showAssignCategoriesForm = async (req, res, next) => {
  try {
    const projectId = req.params.projectId
    const projectDetails = await getProjectDetails(projectId)
    if (!projectDetails) {
      const error = Error('Project not Found');
      error.status = 404;
      return next(error);
    }
    const categories = await getAllCategories();
    const assignedCategories = await getCategoriesByProjectId(projectId);

    const title = 'Assign Categories to Project.'
    res.render('assign-categories', { title, projectId, projectDetails, categories, assignedCategories })
  } catch (error) {
    next(error)
  }
};

const processAssignCategoriesForm = async (req, res, next) => {
  try {
    const projectId = req.params.projectId;
    const selectedCategoryIds = req.body.categoryIds || [];
    const categoryIdsArray = Array.isArray(selectedCategoryIds) ? selectedCategoryIds:[selectedCategoryIds];
    await updateCategoryAssignments(projectId, categoryIdsArray); 
    req.flash('success','Categories updated successfully')
    //redirect to /project/
    return res.redirect(`/project/${projectId}`);
  } catch (error) {
    next(error)
  }
};


export { showCategoriesPage, showCategoryDetailsPage, showAssignCategoriesForm, processAssignCategoriesForm };