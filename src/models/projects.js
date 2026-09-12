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

export { getAllProjects };
