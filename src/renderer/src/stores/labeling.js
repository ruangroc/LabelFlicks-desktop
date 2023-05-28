import { writable, derived, get } from 'svelte/store';

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
        // add property to denote when boxes have been edited
        let boxesWithEditedField = data.bounding_boxes.map(box => ({ ...box, "edited": false }));
        currentBoxes.set(boxesWithEditedField);
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


/*************************************************************/
// Function for sending updated boxes to the backend
/*************************************************************/
export const sendUpdatedBoundingBoxes = async () => { 
    // Determine which boxes were edited
    let editedBoxes = get(currentBoxes).filter(box => box.edited === true);

    // Drop the "edited" property from each box as it won't be accepted
    // by the backend and only the frontend needs to know about it
    editedBoxes = editedBoxes.map(({ edited, ...box }) => box);

    // Send only the edited boxes
    const response = await fetch(`http://localhost:${server_port}/boundingboxes`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(editedBoxes)
    });
};