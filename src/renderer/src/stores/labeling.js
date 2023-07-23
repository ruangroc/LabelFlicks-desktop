import { writable, derived, get } from 'svelte/store';

const server_port = import.meta.env.VITE_SERVER_PORT || 5000;


/*************************************************************/
// Data stores for information shared between components
/*************************************************************/
export const selectedVideoID = writable(undefined);
export const selectedFrame = writable({});
export const selectedFrameIndex = writable(0);
export const videoFrames = writable([]);
export const currentBoxes = writable([]);
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
    if (!videoID) return;
    try {
        const response = await fetch(`http://localhost:${server_port}/videos/${videoID}/frames`);
        const data = await response.json();

        // Frames may be out of order, so put them back in order according to the
        // frame_url path stored with each frame
        let framesWithIDField = data.frames.map(frame => ({ ...frame, "sort_id": frame.frame_url.split("/").at(-1).replace(".jpg", "") }));
        framesWithIDField.sort((a, b) => parseInt(a.sort_id) - parseInt(b.sort_id));

        // Then drop the "sort_id" field from each frame before storing them
        let framesWithoutSortID = framesWithIDField.map(({ sort_id, ...frame }) => frame);
        videoFrames.set(framesWithoutSortID);
    }
    catch (error) {
        console.log("Error in fetchVideoFrames:", error);
    }
};


/*************************************************************/
// Function for fetching bounding boxes for a specific frame
/*************************************************************/
export const fetchBoundingBoxes = async (frameID) => {
    if (!frameID) return;
    try {
        const response = await fetch(`http://localhost:${server_port}/frames/${frameID}/inferences`);
        const data = await response.json();
        // add property to denote when boxes have been edited
        let boxesWithEditedField = data.bounding_boxes.map(box => ({ ...box, "edited": false, "checked": true }));
        boxesWithEditedField.sort((a,b) => a.id > b.id);
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
    if (!projectID) return;
    try {
        const response = await fetch(`http://localhost:${server_port}/projects/${projectID}/labels`);
        const data = await response.json();
        // add property to denote when boxes with specified labels should be hidden
        let labelsWithHiddenField = data.labels.map(box => ({ ...box, "hidden": false }));
        projectLabels.set(labelsWithHiddenField);
    }
    catch (error) {
        console.log("Error in fetchLabels:", error);
    }
};


/*************************************************************/
// Function for sending updated boxes to the backend to 
// finetune label predictions
/*************************************************************/
export const sendUpdatedBoundingBoxes = async (selectedProjectID, selectedVideoID) => { 
    if (!selectedProjectID || !selectedVideoID) return;

    // Determine which boxes were edited
    let editedBoxes = get(currentBoxes).filter(box => box.edited === true);

    // Drop the "edited" property from each box as it won't be accepted
    // by the backend and only the frontend needs to know about it
    editedBoxes = editedBoxes.map(({ edited, checked, ...box }) => box);
    console.log("About to send boxes for finetuning predictions:", editedBoxes);

    // Make sure to send project_id and video_id as well
    // let requestBody = {
    //     "project_id": selectedProjectID,
    //     "video_id": selectedVideoID,
    //     "updated_boxes": editedBoxes
    // }

    // Send only the edited boxes and specify query parameters to update the boxes
    // in the correct project and video
    try {
        await fetch(`http://localhost:${server_port}/boundingboxes?project_id=${selectedProjectID}&video_id=${selectedVideoID}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(editedBoxes)
        });
    }
    catch (error) {
        console.log("Error in sendUpdatedBoundingBoxes:", error);
    }
};


/*************************************************************/
// Function for sending reviewed boxes to the backend without
// finetuning the predictions
/*************************************************************/
export const updateBoundingBoxesNoPredictions = async () => { 
    // Drop the "edited" property from each box as it won't be accepted
    // by the backend and only the frontend needs to know about it
    let boxes = get(currentBoxes).map(({ edited, checked, ...box }) => box);

    // Send only the edited boxes and specify query parameters to update the boxes
    // in the correct project and video
    try {
        await fetch(`http://localhost:${server_port}/boundingboxes`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(boxes)
        });
    }
    catch (error) {
        console.log("Error in updateBoundingBoxesNoPredictions:", error);
    }
};


/*************************************************************/
// Function for sending reviewed frames to the backend
/*************************************************************/
export const updateReviewedFrames = async () => { 
    let frames = get(videoFrames);

    // Send frames that should have been updated to be marked as "human reviewed"
    try {
        await fetch(`http://localhost:${server_port}/frames`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(frames)
        });
    }
    catch (error) {
        console.log("Error in updateReviewedFrames:", error);
    }
};


/*************************************************************/
// Create new label for this project
/*************************************************************/
export const createLabel = async (selectedProjectID, newLabelName) => { 
    try {
        await fetch(`http://localhost:${server_port}/projects/${selectedProjectID}/labels`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(Array(newLabelName))
        });
    }
    catch (error) {
        console.log("Error in createLabel:", error);
    }
};


/*************************************************************/
// Delete the specified bounding box
/*************************************************************/
export const deleteBox = async (selectedBoxID) => { 
    try {
        await fetch(`http://localhost:${server_port}/boundingboxes/${selectedBoxID}`, {
            method: 'DELETE'
        });
    }
    catch (error) {
        console.log("Error in deleteBox:", error);
    }
};


/*************************************************************/
// Delete the specified label
/*************************************************************/
export const deleteLabel = async (selectedProjectID, selectedLabelID) => { 
    try {
        await fetch(`http://localhost:${server_port}/projects/${selectedProjectID}/labels/${selectedLabelID}`, {
            method: 'DELETE'
        });
    }
    catch (error) {
        console.log("Error in deleteLabel:", error);
    }
};
