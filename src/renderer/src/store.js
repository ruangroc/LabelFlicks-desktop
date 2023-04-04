import { writable, derived } from 'svelte/store';

// Data store for all projects fetched from the API, untransformed
export const allProjects = writable([]);

// Data derived from allProjects store, transforms data to look good in the projects table
export const projectsTableData = derived(allProjects, ($allProjects) => {
    // desired format = [
	// 	{
	// 		"Project Name": "seattle-wildlife-project",
	// 		"Number of Videos": "6",
	// 		"Percent Labeled": "78%",
    //      "Frame Extraction Rate": "1"
	// 	},
    // ...
	// ];
    return $allProjects.map(project => ({
        "Project Name": project.name,
        "Number of Videos": String(project.video_count),
        "Percent Labeled": project.percent_labeled + "%",
        "Frame Extraction Rate": String(project.frame_extraction_rate),
    }));
  });

// Data store for the selected project
export const selectedProject = writable({});