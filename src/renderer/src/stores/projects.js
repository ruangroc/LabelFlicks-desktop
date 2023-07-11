import { writable, derived } from 'svelte/store';

const server_port = import.meta.env.VITE_SERVER_PORT || 5000;


/*************************************************************/
// Data store for the selected project
/*************************************************************/
export const selectedProject = writable({});


/*************************************************************/
// Data store for all projects fetched from the API, untransformed
/*************************************************************/
export const allProjects = writable([]);


/*************************************************************/
// Data derived from allProjects store, transforms data to look good in the projects table
/*************************************************************/
export const projectsTableData = derived(allProjects, ($allProjects) => {
    // desired format = [
	// 	{
	// 		"Project Name": "seattle-wildlife-project",
	// 		"Number of Videos": "6",
	// 		"Percent Labeled": "78%"
	// 	},
    // ...
	// ];
    return $allProjects.map(project => ({
        "Project Name": project.name,
        "Number of Videos": String(project.video_count),
        "Percent Labeled": project.percent_labeled + "%"
    }));
  });


/*************************************************************/
// Function for fetching info about all projects
/*************************************************************/
export const fetchProjects = async () => {
    try {
        const response = await fetch(`http://localhost:${server_port}/projects`);
        const data = await response.json();
        allProjects.set(data);
    }
    catch (error) {
        console.log("Error in fetchProjects:", error);
    }
};


/*************************************************************/
// Function for creating a new project
/*************************************************************/
export const createNewProject = async (projectName) => {
    try {
        const response = await fetch(`http://localhost:${server_port}/projects`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Accept': 'application/json'
			},
			body: JSON.stringify({"name": projectName})
		});
        const newProject = await response.json();

        allProjects.update(projects => {
            projects.push(newProject)
            return projects;
        });
    }
    catch (error) {
        console.log("Error in createProject:", error);
    }
};


/*************************************************************/
// Save images and annotations from all videos in the project
/*************************************************************/
export const downloadAnnotations = async (selectedProjectID) => {
    try {
        const response = await fetch(`http://localhost:${server_port}/projects/${selectedProjectID}/annotations`);
        const data = await response.json();
        return data;
    }
    catch (error) {
        console.log("Error in downloadAnnotations:", error);
    }
}
