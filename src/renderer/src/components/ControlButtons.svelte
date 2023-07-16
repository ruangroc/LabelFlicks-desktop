<script>
    import { selectedProject } from "../stores/projects";
    import { 
        selectedFrame, 
        videoFrames, 
        selectedFrameIndex, 
        currentBoxes, 
        sendUpdatedBoundingBoxes,
        updateBoundingBoxesNoPredictions,
        updateReviewedFrames,
        selectedVideoID
    } from "../stores/labeling";
    import SvelteTooltip from 'svelte-tooltip';

    let autoPlayTimeout;
    let paused = true;
    let defaultStyle =
        "border-solid border-2 border-gray-400 p-1 rounded text-sm";

    async function changeFrame(value) {
        if ($selectedFrame === {}) return;
        if ($selectedFrameIndex === $videoFrames.length - 1 && value > 0) {
            paused = true;
            return;
        }

        // Once the frame changes and no additional edits are made,
        // assume all boxes in frame have been human-reviewed 
        // i.e. all boxes look good to the user 
        // but only if moving forward in the video, not back
        if (Number(value) > 0) {
            $videoFrames[$selectedFrameIndex].human_reviewed = true;
            $currentBoxes.forEach(box => box.prediction = false);
            await updateBoundingBoxesNoPredictions();
            await updateReviewedFrames();
        }

        // Then move onto the next frame
        $selectedFrameIndex += value;
    }

    function autoPlayFrames() {
        changeFrame(1);
        if ($selectedFrameIndex === $videoFrames.length - 1) paused = true;
        else autoPlayTimeout = setTimeout(autoPlayFrames, 2000);
    }

    function clickPlayPause() {
        paused = !paused;

        if (paused) clearTimeout(autoPlayTimeout);
        else autoPlayFrames();
    }

    async function submitHumanEdits(labelDeleted=false) {
        // showLoadingSymbol = true;
        await sendUpdatedBoundingBoxes($selectedProject.id, $selectedVideoID);

        // Get the updated unique labels per frame
        // if (labelDeleted) labelDeleted = false;
        // refreshScreen(frameIndex);
        // showLoadingSymbol = false;
    }
</script>

{#if $selectedFrame}
    <!-- Single timeline for navigation purposes-->
    <div class="timeline-wrap mb-1 w-full">
        <svg
            id="timeline-container"
            width="100%"
            height="20px"
        >
            {#each $videoFrames as frame, frame_index}
                <rect 
                    x="{frame_index * (1/$videoFrames.length*100)}%"
                    y="0"
                    width="{1/$videoFrames.length*100}%" 
                    height="10px"
                    class={
                        (frame_index === $selectedFrameIndex) ? "fill-gray-700" : "fill-gray-300"
                    }
                    on:click={() => {$selectedFrameIndex = frame_index}}
                    on:keypress={() => {$selectedFrameIndex = frame_index}}
                >
                    <title>{((frame_index === $selectedFrameIndex) ? "Current: " : "") + frame.frame_url.split("/").at(-1)}</title>
                </rect>
            {/each}
        </svg>
    </div>
    
    <div class="my-1 grid grid-cols-5">
        <div class="col-span-1 mx-auto text-left">
            <p class="mr-6">
                Frame: {$selectedFrame ? $selectedFrame.frame_url.split("/").at(-1) : ""}
            </p>
        </div>

        <div class="col-span-2 mx-auto">
            <button
                class={`${
                    $selectedFrameIndex === 0 ? "disabled" : ""
                } ${defaultStyle}`}
                on:click={() => changeFrame(-1)}
            >
                Back
            </button>

            <button
                class={`${
                    $selectedFrameIndex === $videoFrames.length - 1
                        ? "disabled"
                        : ""
                } ${defaultStyle}`}
                on:click={() => clickPlayPause()}
            >
                {paused ? "Play" : "Pause"}
            </button>

            <button
                class={`${
                    $selectedFrameIndex === $videoFrames.length - 1
                        ? "disabled"
                        : ""
                } ${defaultStyle}`}
                on:click={() => changeFrame(1)}
            >
                Next
            </button>
        </div>

        <div class="col-span-2 mx-auto">
            <!-- <button
                class="border-solid border-2 border-gray-400 mr-1 p-1 rounded text-sm"
            >
                Add Bounding Box
            </button> -->

            <SvelteTooltip 
                tip="Use AI to re-predict the labels for the bounding boxes you have yet to review based on what you have reviewed so far" 
                bottom 
                color="#FFB74D"
            >
                <button
                    class="border-solid border-2 border-gray-400 p-1 rounded text-sm"
                    on:click={submitHumanEdits}
                >
                    Predict Unreviewed Labels
                </button>
            </SvelteTooltip>
            
        </div>
    </div>
{/if}

<style>
    .disabled {
        pointer-events: none;
        cursor: not-allowed;
        color: darkgray;
    }
</style>