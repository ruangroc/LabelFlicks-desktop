import { writable, derived } from 'svelte/store';

const server_port = import.meta.env.VITE_SERVER_PORT || 5000;


/*************************************************************/
// Data store for the frames in the current video
/*************************************************************/
export const videoFrames = writable([]);


/*************************************************************/
// Data store for the bounding boxes for the current frame
/*************************************************************/
export const currentBoxes = writable([]);


/*************************************************************/
// Function for fetching videos from a specific project
/*************************************************************/
export const fetchVideoFrames = async (videoID) => {
    try {
        const response = await fetch(`http://localhost:${server_port}/videos/${videoID}/frames`);
		const data = await response.json();
		videoFrames.set(data.frames);
    }
    catch (error) {
        console.log("Error in fetchVideoFrames:", error);
    }
};


/*************************************************************/
// Function for fetching videos from a specific project
/*************************************************************/
export const fetchBoundingBoxes = async (frameID) => {
    try {
        const response = await fetch(`http://localhost:${server_port}/frames/${frameID}/inferences`);
		const data = await response.json();
		currentBoxes.set(data.bounding_boxes);
    }
    catch (error) {
        console.log("Error in fetchBoundingBoxes:", error);
    }
};