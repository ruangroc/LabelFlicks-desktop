<script>
    import { onMount } from "svelte";
    import { videoFrames, projectLabels, labelsPerFrame } from "../stores/labeling";

    // total frames = videoFrames.length
    // projectLabels = list of unique labels
    // videoFrames = list of frames and the labels detected in each

    // figure out total slots and width of each slot (to represent one frame)
    // for each unique label, determine whether each frame should be colored

    // probably will need to scale this somehow for longer videos, but
    // should be one pass through the frames array

    let displayLabels = false;
    let timelineWidth = 0;
    let timelineHeight = 20;
    let frameWidth = 0;
    let colors = ["fill-red-300", "fill-orange-300", "fill-teal-300", "fill-sky-300", "fill-violet-300", "fill-rose-300"];

    onMount(() => {
        pollTitleRenderStatus();
        console.log($labelsPerFrame);
    });

    function pollTitleRenderStatus() {
        let element = document.getElementById("labels-title-row");
        let rendered = element.getBoundingClientRect().width;
        if (!rendered) {
            setTimeout(pollTitleRenderStatus, 100);
        }
        else {
            displayLabels = true;
            timelineWidth = document.getElementById("labels-title-row").getBoundingClientRect().width;
            frameWidth = timelineWidth / $videoFrames.length;
        }
    }
</script>

{#if displayLabels}
    <div class="flex flex-col">
        {#each $projectLabels as label, label_index}
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
            <!-- <div class="w-full h-4 bg-gray-300 mt-1 mb-4"></div> -->
            <div class="timeline-wrap mt-1 mb-4">
                <svg
                    id="timeline-container"
                    width="{timelineWidth}px"
                    height="{timelineHeight}px"
                >
                    {#each $labelsPerFrame as frameLabels, frame_index}
                            <rect 
                                x="{frame_index * frameWidth}"
                                y="0"
                                width="{frameWidth}px" 
                                height="{timelineHeight}px"
                                class={frameLabels.find(x => x === label.id) ? colors[label_index % colors.length] : "fill-gray-300"}
                            >
                            </rect>
                    {/each}
                </svg>
            </div>
        {/each}
    </div>
{/if}

<style>
    svg {
        position: relative;
        top: 0;
        left: 0;
    }
    .timeline-wrap {
        position: relative;
        display: inline-block;
        transition: transform 150ms ease-in-out;
    }
</style>