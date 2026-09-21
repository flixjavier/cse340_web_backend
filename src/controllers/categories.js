import { getAllCategories, getCategoryDetails } from '../models/categories.js';
import { getProjectsByCategoryId } from '../models/projects.js';


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

export { showCategoriesPage, showCategoryDetailsPage };