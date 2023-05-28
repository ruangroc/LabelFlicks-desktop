import { writable, derived } from 'svelte/store';

const server_port = import.meta.env.VITE_SERVER_PORT || 5000;


/*************************************************************/
// Data store for the frames in the current video
/*************************************************************/
export const videoFrames = writable([]);

/*************************************************************/
// Derived store for figuring out number of human-reviewed frames
/*************************************************************/
export const percentReviewedFrames = derived(videoFrames, ($videoFrames) => {
    let numReviewed = 0;
    $videoFrames.forEach(frame => {
        if (frame.human_reviewed) numReviewed += 1
    });
    return 100 * (numReviewed / $videoFrames.length);
});

/*************************************************************/
// Data store for the bounding boxes for the current frame
/*************************************************************/
export const currentBoxes = writable([]);


/*************************************************************/
// Data store for the labels for the current project
/*************************************************************/
export const projectLabels = writable([]);

/*************************************************************/
// Derived store mapping label IDs to label names
/*************************************************************/
export const labelIdToName = derived(projectLabels, ($projectLabels) => {
    let mapping = {};
    $projectLabels.forEach(label => mapping[label.id] = label.name);
    return mapping;
});

/*************************************************************/
// Derived store mapping label names to label IDs
/*************************************************************/
export const nameToLabelId = derived(projectLabels, ($projectLabels) => {
    let mapping = {};
    $projectLabels.forEach(label => mapping[label.name] = label.id);
    return mapping;
});

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
// Function for fetching bounding boxes for a specific frame
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


/*************************************************************/
// Function for fetching labels from a specific project
/*************************************************************/
export const fetchLabels = async (projectID) => {
    try {
        const response = await fetch(`http://localhost:${server_port}/projects/${projectID}/labels`);
		const data = await response.json();
		projectLabels.set(data.labels);
    }
    catch (error) {
        console.log("Error in fetchLabels:", error);
    }
};