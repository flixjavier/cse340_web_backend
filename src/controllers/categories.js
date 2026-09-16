import { getAllCategories } from '../models/categories.js';


const showCategoriesPage = async (req, res) => {
  try{
    const categories = await getAllCategories();
    //console.log('Service categories:', categories);
    const title = 'Categories';
    res.render('categories', { title, categories });
  } catch (error) {
    console.error('Error fetching categories:', error.message);
    res.status(500).send('Failed to load categories: ' + error.message);
  }
};

export { showCategoriesPage };