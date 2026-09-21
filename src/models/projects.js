import db from './db.js';

const getAllProjects = async () => {
    const query = `
        SELECT
            sp.project_id,
            sp.organization_id,
            sp.title,
            sp.description,
            sp.location,
            sp.date AS project_date,
            o.name AS organization_name,
            o.logo_filename AS organization_logo_filename
        FROM public.service_projects AS sp
        JOIN public.organizations AS o
            ON sp.organization_id = o.organization_id
        ORDER BY sp.date, sp.title;
    `;

    const result = await db.query(query);
    return result.rows;
};

const getProjectsByOrganizationId = async (organizationId) => {
    const query = `
        SELECT
            project_id,
            organization_id,
            title,
            description,
            location,
            date
        FROM public.service_projects
        WHERE organization_id = $1
        ORDER BY date;
    `;

    const queryParams = [organizationId];
    const result = await db.query(query, queryParams);

    return result.rows;
};

const getUpcomingProjects = async (number_of_projects) => {
    const query = `
        SELECT p.project_id, p.title, p.description, p.date AS project_date, p.location, p.organization_id, o.name AS organization_name
        FROM public.service_projects AS p
        JOIN public.organizations AS o
        ON o.organization_id = p.organization_id
        WHERE p.date >= CURRENT_DATE
        ORDER BY p.date ASC, p.project_id ASC
        LIMIT $1; 
        `; 
    const result = await db.query(query, [number_of_projects]);
    return result.rows;
}; 

const getProjectDetails = async (id) => {
    const query = `
        SELECT p.project_id, p.title, p.description, p.date AS project_date, p.location, p.organization_id, o.name AS organization_name
        FROM public.service_projects AS p
        JOIN public.organizations AS o
        ON o.organization_id = p.organization_id
        WHERE p.project_id = $1; 
        `; 
    const result = await db.query(query, [id]);
    return result.rows[0] ?? null;
}; 

const getProjectsByCategoryId = async (categoryId) => {
    const query = `
        SELECT p.project_id, p.title
        FROM public.service_projects AS p
        JOIN public.projects_categories AS pc
        ON pc.project_id = p.project_id
        WHERE pc.category_id = $1
        ORDER BY p.title;
    `;
    const result = await db.query(query, [categoryId]);
    return result.rows;
};


export { getAllProjects, getProjectsByOrganizationId, getUpcomingProjects, getProjectDetails, getProjectsByCategoryId};
