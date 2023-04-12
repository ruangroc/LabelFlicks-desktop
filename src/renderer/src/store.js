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

// Data store for the videos in the selected project
export const projectVideos = writable([]);

export const videosTableData = derived(projectVideos, ($projectVideos) => {
    // desired format = [
	// 	{
	// 		"Name": "my-video-1.mp4",
	// 		"Date Uploaded": "2023-03-19",
	// 		"Percent Labeled": "18%",
    //      "Number of Frames": "100"
	// 	},
    // ...
	// ];
    return $projectVideos.map(video => ({
        "Name": video.name,
        "Date Uploaded": String(video.date_uploaded),
        "Percent Labeled": video.percent_labeled + "%",
        "Number of Frames": String(video.number_of_frames),
    }));
})