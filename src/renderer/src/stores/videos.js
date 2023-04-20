import { writable, derived } from 'svelte/store';
import { status } from "../types.ts";
import { allProjects, selectedProject } from "./projects.js";

const server_port = import.meta.env.VITE_SERVER_PORT || 5000;


/*************************************************************/
// Data store for the videos in the selected project
/*************************************************************/
export const projectVideos = writable([]);


/*************************************************************/
// Data derived from projectVideos store, transforms data to look good in the videos table
/*************************************************************/
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
});


/*************************************************************/
// Data derived from projectVideos store, transforms data to look good in the preprocessing status table
/*************************************************************/
export const preprocessingTableData = derived(projectVideos, ($projectVideos) => {
    // desired format = [
	// 	{
	// 		"Name": "my-video-1.mp4",
	// 		"Date Uploaded": "2023-03-19",
    //      "Status": status.Done or status.InProgress
	// 	},
    // ...
	// ];
    return $projectVideos.map(video => ({
        "Name": video.name,
        "Date Uploaded": String(video.date_uploaded),
        "Status": video.done_preprocessing ? status.Done : status.InProgress
    }));
});


/*************************************************************/
// Function for fetching videos from a specific project
/*************************************************************/
export const fetchVideos = async (projectID) => {
    try {
        const response = await fetch(`http://localhost:${server_port}/projects/${projectID}/videos`);
		const data = await response.json();
		projectVideos.set(data.videos);
    }
    catch (error) {
        console.log("Error in fetchVideos:", error);
    }
};

/*************************************************************/
// Function for uploading a video to a specific project
/*************************************************************/
export const uploadVideo = async (projectID, data) => {
    try {
        await fetch(`http://localhost:${server_port}/projects/${projectID}/videos`, {
			method: 'POST',
			body: data
		});
    }
    catch (error) {
        console.log("Error in uploadVideo:", error);
    }
};
