import { getAllCategories, getCategoryDetails, getCategoriesByProjectId, updateCategoryAssignments, createCategory, updateCategory } from '../models/categories.js';
import { getProjectsByCategoryId, getProjectDetails } from '../models/projects.js';
import { body, validationResult } from "express-validator";


// Define validation and sanitization rules for category form

const categoryValidation = [
  body('categoryName')
    .trim()
    .notEmpty()
    .withMessage('Category name required')
    .isLength({min: 3,max: 100})
    .withMessage('Category name must be between 3 and 100 characters'),
  ]; 

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

const showNewCategoryForm = async (req,res) => {
  const title = `Add New Category`; 

  res.render(`new-category`, { title }); 
}

const processNewCategoryForm = async (req, res, next) => {
  try {
    //check Validations
    const results = validationResult(req);
    if (!results.isEmpty()) {
      //validation failed - loop through errors
      results.array().forEach((error) => {
        req.flash('error', error.msg);
      });
      //redirect to /new-category
      return res.redirect('/new-category');
    }
    const { categoryName } = req.body; 
    const categoryId = await createCategory(categoryName); 
    //set a success flash message
    req.flash('success',`${categoryName} added successfully`)
  
    res.redirect(`/category/${categoryId}`);  

  } catch (error) {
    next(error)
  }
};

const showEditCategoryForm = async (req,res,next) => {
  try {
    const categoryId = req.params.id; 
    const categoryDetails = await getCategoryDetails(categoryId); 
    if (!categoryDetails) {
      const error = new Error('Category not found');
      error.status = 404;
      return next(error);
    }
    const title = 'Edit Category';

    res.render('edit-category', { title, categoryDetails});
  } catch (error) {
    console.error('Error fetching category details:', error.message);
    next(error); // Pass the error to the next middleware for centralized error handling
  }
}; 

const processEditCategoryForm = async (req, res, next) => {
  try {
    //valiation
    const results = validationResult(req);
    if (!results.isEmpty()) {
    //validation failed - loop through errors
    results.array().forEach((error) => {
      req.flash('error', error.msg);
    });
    //redirect to /edit-category/
    return res.redirect(`/edit-category/${req.params.id}`);
  }

    const categoryId = req.params.id;
    const { categoryName } = req.body; 

    await updateCategory (categoryId, categoryName); 
    //set a success flash message
    req.flash('success',`${categoryName} was updated`)

    res.redirect(`/category/${categoryId}`);
  } catch (error) {
    console.error('Error updating category:', error.message);
    next(error); // Pass the error to the next middleware for centralized error handling
  } 
  
}; 



export { showCategoriesPage, showCategoryDetailsPage, showAssignCategoriesForm, processAssignCategoriesForm, categoryValidation, showNewCategoryForm, processEditCategoryForm, processNewCategoryForm, showEditCategoryForm };