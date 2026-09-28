import db from './db.js';

const getAllCategories = async () => {
    const query = 'SELECT category_id, category_name FROM public.categories ORDER BY category_name';
    const result = await db.query(query);
    return result.rows;
};

const getCategoryDetails = async (id) => {
    const query = `
        SELECT c.category_id, c.category_name 
        FROM public.categories AS c
        WHERE c.category_id = $1; 
        `; 
    const result = await db.query(query, [id]);
    return result.rows[0] ?? null;
};

const getCategoriesByProjectId = async (projectId) => {
    const query = `
        SELECT c.category_id, c.category_name
        FROM public.categories AS c
        JOIN public.projects_categories AS pc
        ON pc.category_id = c.category_id
        WHERE pc.project_id = $1
        ORDER BY c.category_name;
        `;
    const result = await db.query(query, [projectId]);
    return result.rows;
};

const assignCategoryToProject = async (projectId, categoryId) => {
    const query = `
    INSERT INTO public.projects_categories (project_id, category_id)
    VALUES ($1, $2);
    `;
    await db.query(query, [projectId, categoryId]);
}

const updateCategoryAssignments = async (projectId, categoryIds) => {
    const query = `
    DELETE FROM public.projects_categories 
    WHERE project_id = $1
    `
    await db.query(query, [projectId]);

    for (const categoryId of categoryIds) {
        await assignCategoryToProject(projectId, categoryId)
    }
};

const createCategory = async (categoryName) => {
    const query = `
        INSERT INTO public.categories (category_name)
        VALUES ($1)
        RETURNING category_id
    `; 

    const queryParams = [categoryName]; 
    const result = await db.query(query, queryParams); 
    if (result.rows.length === 0) {
        throw new Error("Failed to create category");
    }

    if (process.env.ENABLE_SQL_LOGGING === 'true') {
        console.log('Created new category with ID:', result.rows[0].category_id);         
    }

    return result.rows[0].category_id;
}

const updateCategory = async (categoryId, categoryName) => {
    const query = `
        UPDATE public.categories
        SET category_name = $1
        WHERE category_id = $2
        RETURNING category_id
    `; 

    const queryParams = [categoryName, categoryId]; 
    const result = await db.query(query, queryParams); 
    if (result.rows.length === 0) {
        throw new Error("Failed to update category");
    }

    if (process.env.ENABLE_SQL_LOGGING === 'true') {
        console.log('Category with ID was updated correctly:', result.rows[0].category_id);         
    }

    return result.rows[0].category_id;
}








export { getAllCategories, getCategoryDetails, getCategoriesByProjectId, updateCategoryAssignments, createCategory, updateCategory};
