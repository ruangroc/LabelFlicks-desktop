<script>
    import { selectedProject } from "../../stores/projects";
    import { projectVideos } from "../../stores/videos";
    import {
        currentBoxes,
        videoFrames,
        percentReviewedFrames,
        fetchVideoFrames,
        fetchBoundingBoxes,
        fetchLabels,
        sendUpdatedBoundingBoxes,
        updateBoundingBoxesNoPredictions,
        updateReviewedFrames,
        createLabel,
    } from "../../stores/labeling";
    import { onMount } from "svelte";
    import { Stretch } from "svelte-loading-spinners";
    import BoundingBoxes from "../../components/BoundingBoxes.svelte";
    import Timeline from "../../components/Timeline.svelte";
    import Modal from "../../components/Modal.svelte";

    let showLoadingSymbol = true;
    let selectedVideoID = $projectVideos[0].id;
    let selectedFrame = {};
    let frameIndex;
    $: refreshFrame(frameIndex);
    let defaultStyle =
        "border-solid border-2 border-gray-400 mx-1 p-1 rounded text-sm";
    let paused = true;
    let autoPlayTimeout;
    let showCreateLabelModal = false;
    let newLabelName = "";
    let labelDeleted = false;
    $: submitHumanEdits(labelDeleted);

    onMount(async () => {
        frameIndex = 0;
        await refreshScreen(frameIndex);
    });

    async function refreshScreen(frame_index) {
        showLoadingSymbol = true;
        await fetchLabels($selectedProject.id);
        await fetchVideoFrames(selectedVideoID);
        refreshFrame(frame_index);
        showLoadingSymbol = false;
    }

    async function refreshFrame(frame_index) {
        if (selectedFrame === {}) return;

        frameIndex = frame_index;
        selectedFrame = $videoFrames[frameIndex];
        await fetchBoundingBoxes(selectedFrame.id);
    }

    async function changeFrame(value) {
        if (selectedFrame === {}) return;
        if (frameIndex === $videoFrames.length - 1) {
            paused = true;
            return;
        }

        // Once the frame changes and no additional edits are made,
        // assume all boxes in frame have been human-reviewed 
        // i.e. all boxes look good to the user 
        // but only if moving forward in the video, not back
        if (Number(value) > 0) {
            $videoFrames[frameIndex].human_reviewed = true;
            $currentBoxes.forEach(box => box.prediction = false);
            await updateBoundingBoxesNoPredictions();
            await updateReviewedFrames();
        }

        // Then move onto the next frame
        frameIndex += value;
        selectedFrame = $videoFrames[frameIndex];
        await fetchBoundingBoxes(selectedFrame.id);
    }

    function autoPlayFrames() {
        changeFrame(1);
        if (frameIndex === $videoFrames.length - 1) paused = true;
        else autoPlayTimeout = setTimeout(autoPlayFrames, 2000);
    }

    function clickPlayPause() {
        paused = !paused;

        if (paused) clearTimeout(autoPlayTimeout);
        else autoPlayFrames();
    }

    async function submitHumanEdits(labelDeleted=false) {
        showLoadingSymbol = true;
        await sendUpdatedBoundingBoxes($selectedProject.id, selectedVideoID);

        // Get the updated unique labels per frame
        if (labelDeleted) labelDeleted = false;
        refreshScreen(frameIndex);
        showLoadingSymbol = false;
    }

    async function createNewLabel() {
        await createLabel($selectedProject.id, newLabelName);
		showCreateLabelModal = false;
		newLabelName = "";
        await refreshScreen(frameIndex);
    }
</script>

<div class="flex flex-col items-center w-5/6 mx-auto">
    <div class="flex flex-row w-full justify-end mt-2">
        <button class="bg-gray-300 ml-auto p-2 rounded"
            ><a href="/">Save</a></button
        >
        <button class="bg-green-300 ml-3 p-2 rounded"
            ><a href="#/export">Done Labeling</a></button
        >
    </div>

    <div class="flex flex-row flex-wrap w-full justify-start mb-1">
        <h1 class="text-left text-lg font-semibold w-full">
            Project: {$selectedProject.name}
        </h1>
    </div>

    <div class="flex flex-row flex-wrap w-full justify-start mb-2 py-1">
        <div class="flex flex-row w-full py-1">
            <label class="pr-2" for="select-video"
                ><h2>Current video:</h2></label
            >
            <select
                name="select-video"
                bind:value={selectedVideoID}
                on:change={() => {refreshScreen(0)}}
            >
                {#each $projectVideos as video}
                    <option value={video.id}>{video.name}</option>
                {/each}
            </select>
        </div>
        <div class="w-full py-1">
            {#if !showLoadingSymbol && $videoFrames && $percentReviewedFrames}
            <p>
                {$percentReviewedFrames}% of {$videoFrames.length} total frames reviewed
            </p>
            {:else}
            <p>
                Calculating percent of total frames reviewed
            </p>
            {/if}
        </div>
    </div>

    {#if showLoadingSymbol || !$videoFrames || !selectedFrame}
        <Stretch size="60" color="#FF3E00" unit="px" duration="1s" />
    {:else}
        <div class="grid grid-cols-2">
            <!-- Display current frame and player controls -->
            <div class="flex flex-col">
                <!-- Container for frame and bounding boxes -->
                <div class="img-overlay-wrap">
                    <img
                        id="frame-img"
                        src={selectedFrame.frame_url}
                        alt="still frame from the video"
                    />
                    <BoundingBoxes bind:selectedFrame />
                </div>

                <div class="my-1 grid grid-cols-5">
                    <div class="col-span-2 mx-auto text-left">
                        <p class="mr-6">
                            Frame: {selectedFrame
                                ? selectedFrame.frame_url.split("/").at(-1)
                                : ""}
                        </p>
                    </div>

                    <div class="col-span-2 mx-auto">
                        <button
                            class={`${
                                frameIndex === 0 ? "disabled" : ""
                            } ${defaultStyle}`}
                            on:click={() => changeFrame(-1)}
                        >
                            Back
                        </button>

                        <button
                            class={`${
                                frameIndex === $videoFrames.length - 1
                                    ? "disabled"
                                    : ""
                            } ${defaultStyle}`}
                            on:click={() => clickPlayPause()}
                        >
                            {paused ? "Play" : "Pause"}
                        </button>

                        <button
                            class={`${
                                frameIndex === $videoFrames.length - 1
                                    ? "disabled"
                                    : ""
                            } ${defaultStyle}`}
                            on:click={() => changeFrame(1)}
                        >
                            Next
                        </button>
                    </div>

                    <div class="col-span-1 mx-auto">
                        <!-- <button
                            class="border-solid border-2 border-gray-400 mr-1 p-1 rounded text-sm"
                        >
                            Add Bounding Box
                        </button> -->
                        <button
                            class="border-solid border-2 border-gray-400 mr-1 p-1 rounded text-sm"
                            on:click={submitHumanEdits}
                        >
                            Finetune Predictions
                        </button>
                    </div>
                </div>
            </div>

            <!-- Display labels -->
            <div class="pl-4 overflow-y-auto">
                <div id="labels-title-row" class="flex flex-row">
                    <h2 class="text-left text-lg font-semibold my-1">
                        Object Detection Labels
                    </h2>
                    <button
                        class="border-solid border-2 border-gray-400 ml-auto p-1 rounded text-sm"
                        on:click={() => showCreateLabelModal = true}
                    >
                        Add Label
                    </button>
                </div>

                {#if showCreateLabelModal}
                <Modal>
                    <h2 slot="header">
                        Create a New Label
                    </h2>
                
                    <div slot="body">
                        <div class="flex flex-row flex-wrap w-full justify-start mb-2 py-1">
                            <h1 class="text-left text-lg font-semibold w-full my-1">
                                Label Name
                            </h1>
                            <input
                                type="text"
                                placeholder="project-name"
                                bind:value={newLabelName}
                                class="w-full h-8 rounded bg-gray-200 p-2 text-md"
                            />
                        </div>
                    
                        <button 
                            class="bg-gray-300 hover:bg-gray-400 ml-auto p-2 rounded" 
                            on:click={() => showCreateLabelModal = false}
                        >
                            Cancel
                        </button>
                        <button class="bg-green-300 hover:bg-green-400 ml-3 p-2 rounded" on:click={createNewLabel}>
                            Create Label
                        </button>
                    </div>
                </Modal>
                {/if}

                <Timeline bind:frameIndex bind:labelDeleted />
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

    .img-overlay-wrap {
        position: relative;
        display: inline-block; /* <= shrinks container to image size */
        transition: transform 150ms ease-in-out;
    }

    .img-overlay-wrap img {
        /* <= optional, for responsiveness */
        display: block;
        max-width: 100%;
        height: auto;
    }
</style>
