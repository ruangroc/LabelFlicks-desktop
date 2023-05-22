<script>
    import { selectedProject } from "../../stores/projects";
    import { projectVideos } from "../../stores/videos";
    import { videoFrames, currentBoxes, projectLabels, fetchVideoFrames, fetchBoundingBoxes, fetchLabels } from "../../stores/labeling";
    import { onMount } from "svelte";
    import { Stretch } from 'svelte-loading-spinners';

    let showLoadingSymbol = true;
    let selectedVideoID = $projectVideos[0].id;
    let selectedFrame = "";
    let frameIndex = 0;
    let defaultStyle = "border-solid border-2 border-gray-400 mx-1 p-1 rounded text-sm";

    onMount(async () => {
        await fetchLabels($selectedProject.id);
        await fetchVideoFrames(selectedVideoID);
        selectedFrame = $videoFrames[frameIndex];
        showLoadingSymbol = false;
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

    function changeFrame(value) {
        frameIndex += value;
        selectedFrame = $videoFrames[frameIndex];
    }
</script>

<div class="flex flex-col items-center w-5/6 mx-auto">
    <div class="flex flex-row w-full justify-end my-2">
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

    {#if showLoadingSymbol}
        <Stretch size="60" color="#FF3E00" unit="px" duration="1s" />
    {:else}
        <div class="grid grid-cols-2">
            <!-- Display current frame and player controls -->
            <div class="flex flex-col">
                <img class="h-3/4" src="{selectedFrame.frame_url}" alt="still frame from the video" />

                <div class="my-1 grid grid-cols-4">

                    <div class="col-span-1 mx-auto">
                        <p class="mr-6">
                            Frame: {selectedFrame ? selectedFrame.frame_url.split("/").at(-1) : ""}
                        </p>
                    </div>
                    
                    <div class="col-span-2 mx-auto">
                        <button 
                            class={`${frameIndex === 0 ? "disabled" : ""} ${defaultStyle}`} 
                            on:click={() => changeFrame(-1)}
                        >
                            Back
                        </button>

                        <button class="border-solid border-2 border-gray-400 ml-1 p-1 rounded text-sm">
                            Play/Pause
                        </button>

                        <button 
                            class={`${frameIndex === $videoFrames.length-1 ? "disabled" : ""} ${defaultStyle}`} 
                            on:click={() => changeFrame(1)}
                        >
                            Next
                        </button>
                    </div>

                    <div class="col-span-1 mx-auto">
                        <button class="border-solid border-2 border-gray-400 mr-1 p-1 rounded text-sm">
                            Add Bounding Box
                        </button>
                        <button class="border-solid border-2 border-gray-400 mr-1 p-1 rounded text-sm">
                            Finetune Predictions
                        </button>
                    </div>
                    
                </div>
            </div>
            
            <!-- Display labels -->
            <div class="pl-4 overflow-y-auto">
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
                        <!-- TODO: add colored segments where labels are detected -->
                        <div class="w-full h-4 bg-gray-300 mt-1 mb-4"></div>
                    {/each}
                </div>
            </div>
        </div>
    {/if}
</div>

<style>
	.disabled {
		pointer-events: none;
		cursor: not-allowed;
		color: darkgray;
	}
</style>