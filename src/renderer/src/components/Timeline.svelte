<script>
    import { onMount } from "svelte";
    import { videoFrames, projectLabels, deleteLabel, selectedFrameIndex, fetchLabels } from "../stores/labeling";
    import { selectedProject } from "../stores/projects";

    let displayLabels = false;
    let timelineWidth = 0;
    let timelineHeight = 20;
    let frameWidth = 0;
    let colors = ["fill-red-300", "fill-orange-300", "fill-teal-300", "fill-sky-300", "fill-violet-300", "fill-rose-300"];

    onMount(() => {
        pollTitleRenderStatus();
    });

    function pollTitleRenderStatus() {
        let element = document.getElementById("labels-title-row");
        if (!element) {
            setTimeout(pollTitleRenderStatus, 100);
            return;
        }
        let rendered = element.getBoundingClientRect().width;
        if (!rendered) {
            setTimeout(pollTitleRenderStatus, 100);
            return;
        }
        else {
            displayLabels = true;
            timelineWidth = 0.9 * document.getElementById("labels-title-row").getBoundingClientRect().width;
            frameWidth = timelineWidth / $videoFrames.length;
        }
    }

    async function handleDeleteLabel(labelId) {
        console.log("Label ID:", labelId);
        await deleteLabel($selectedProject.id, labelId);
        // labelDeleted = true;
        await fetchLabels($selectedProject.id);
    }
</script>

{#if displayLabels}
    <div class="flex flex-col overflow-auto h-4/5">
        {#each $projectLabels as label, label_index}
            <div class="flex flex-row">
                <p class="mr-4">{label.name}</p>
                <!-- <button class="border-solid border-2 border-gray-400 mx-1 p-1 rounded text-sm">
                    Rename
                </button> -->
                <button 
                    class="border-solid border-2 border-gray-400 mx-1 p-1 rounded text-sm"
                    on:click={() => handleDeleteLabel(label.id)}
                >
                    Delete
                </button>
                <button 
                    class="border-solid border-2 border-gray-400 mx-1 p-1 rounded text-sm" 
                    on:click={() => label.hidden = !label.hidden}
                >
                    {#if label.hidden}
                    Show
                    {:else}
                    Hide
                    {/if}
                </button>
            </div>
            <div class="timeline-wrap mt-1 mb-4">
                <svg
                    id="timeline-container"
                    width="{timelineWidth}px"
                    height="{timelineHeight}px"
                >
                    {#each $videoFrames as frame, frame_index}
                        <rect 
                            x="{frame_index * frameWidth}"
                            y="0"
                            width="{frameWidth}px" 
                            height="{timelineHeight}px"
                            class={
                                (frame.labels.find(x => x === label.id) && frame.human_reviewed === false) ? colors[label_index % colors.length] + " stroke-red-500 stroke-2" : 
                                (frame.labels.find(x => x === label.id) ? colors[label_index % colors.length] : "fill-gray-300")
                            }
                            on:click={() => {$selectedFrameIndex = frame_index}}
                            on:keypress={() => {$selectedFrameIndex = frame_index}}
                        >
                            <title>{frame.human_reviewed === false ? "Unreviewed" : "Reviewed"}</title>
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
    svg rect {
        cursor: pointer;
    }
    .timeline-wrap {
        position: relative;
        display: inline-block;
        transition: transform 150ms ease-in-out;
    }
</style>