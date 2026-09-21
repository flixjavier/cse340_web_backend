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

export { getAllCategories, getCategoryDetails, getCategoriesByProjectId};
