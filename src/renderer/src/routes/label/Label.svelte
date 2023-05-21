<script>
    import { selectedProject } from "../../stores/projects";
    import { projectVideos } from "../../stores/videos";
    import { videoFrames, currentBoxes, projectLabels, fetchVideoFrames, fetchBoundingBoxes, fetchLabels } from "../../stores/labeling";
    import { onMount } from "svelte";

    let selectedVideoID = $projectVideos[0].id;
    let selectedFrame = "";

    onMount(async () => {
        await fetchLabels($selectedProject.id);
        await fetchVideoFrames(selectedVideoID);
        selectedFrame = $videoFrames[0];
    });

    function getPercentFramesLabeled() {
        let numLabeled = 0;
        for (var frame of $videoFrames) {
            if (frame.human_reviewed === true)
                numLabeled += 1;
        }
        let percent = 100 * (numLabeled / $videoFrames.length);
        return percent;
    }
</script>

<div class="flex flex-col items-center w-5/6 mx-auto mt-2">
    <div class="flex flex-row w-full justify-end mb-1">
        <button class="bg-gray-300 ml-auto p-2 rounded"
            ><a href="/">Save</a></button
        >
        <button class="bg-green-300 ml-3 p-2 rounded"
            ><a href="#/preprocess">Done Labeling</a></button
        >
    </div>

    <div class="flex flex-row flex-wrap w-full justify-start mb-2 py-1">
        <h1 class="text-left text-lg font-semibold w-full">
            Project: {$selectedProject.name}
        </h1>
    </div>
    
    <div class="flex flex-row flex-wrap w-full justify-start mb-2 py-1">
        <div class="flex flex-row w-full py-1">
            <label class="pr-2" for="select-video"><h2>Current video:</h2></label>
            <select name="select-video" bind:value={selectedVideoID} on:change="{fetchVideoFrames(selectedVideoID)}">
                {#each $projectVideos as video}
                    <option value="{video.id}">{video.name}</option>
                {/each}
            </select>
        </div>
        <div class="w-full py-1">
            <p> {getPercentFramesLabeled()}% of {$videoFrames.length} total frames labeled </p>
        </div>
    </div>

    <div class="flex flex-row w-full justify-start mb-2 py-1">
        <!-- Display current frame and player controls -->
        <!-- TODO: make responsive. It's only fine in full screen rn -->
        <div class="w-1/2 flex flex-col">
            <img src="{selectedFrame.frame_url}" alt="still frame from the video" />
            <div class="my-1 flex flex-row">
                <p class="mr-6">
                    Frame: {selectedFrame ? selectedFrame.frame_url.split("/").at(-1) : ""}
                </p>
                <button class="border-solid border-2 border-gray-400 mr-1 p-1 rounded text-sm">
                    Speed
                </button>
                <button class="border-solid border-2 border-gray-400 ml-1 p-1 rounded text-sm">
                    Play/Pause
                </button>
                <button class="border-solid border-2 border-gray-400 mx-1 p-1 rounded text-sm">
                    Back
                </button>
                <button class="border-solid border-2 border-gray-400 mr-6 p-1 rounded text-sm">
                    Next
                </button>
                <button class="border-solid border-2 border-gray-400 mr-1 p-1 rounded text-sm">
                    Add Bounding Box
                </button>
                <button class="border-solid border-2 border-gray-400 mr-1 p-1 rounded text-sm">
                    Finetune Predictions
                </button>
            </div>
        </div>
        
        <!-- Display labels -->
        <div class="w-1/2 pl-4">
            <div class="flex flex-row">
                <h2 class="text-left text-lg font-semibold my-1">Object Detection Labels</h2>
                <button class="border-solid border-2 border-gray-400 ml-auto p-1 rounded text-sm">
                    Add Label
                </button>
            </div>
            
            <div class="flex flex-col">
                {#each $projectLabels as label}
                    <div class="flex flex-row">
                        <p class="mr-4">{label.name}</p>
                        <button class="border-solid border-2 border-gray-400 mx-1 p-1 rounded text-sm">
                            Rename
                        </button>
                        <button class="border-solid border-2 border-gray-400 mx-1 p-1 rounded text-sm">
                            Color
                        </button>
                        <button class="border-solid border-2 border-gray-400 mx-1 p-1 rounded text-sm">
                            Delete
                        </button>
                    </div>
                    <div class="w-full h-4 bg-gray-300 mt-1 mb-4"></div>
                    
                {/each}
            </div>
        </div>
    </div>
    

    
    <!-- Experimentation below -->

    <!-- <label for="select-frame"><h2>Select frame:</h2></label>
    <select name="select-frame" bind:value={selectedFrame.id} on:change="{fetchBoundingBoxes(selectedFrame.id)}">
        {#each $videoFrames as frame}
            <option value="{frame.id}">{frame.id}</option>
        {/each}
    </select>

    <p>Number of boxes: {$currentBoxes.length}</p>

    <label for="select-label"><h2>Select label:</h2></label>
    <select name="select-label" bind:value={selectedLabelID}>
        {#each $projectLabels as label}
            <option value="{label.id}">{label.name}</option>
        {/each}
    </select>

    {#each $videoFrames as frame}
        <img src="{frame.frame_url}" alt="still frame from the video" />
    {/each} -->
</div>