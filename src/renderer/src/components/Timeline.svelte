<script>
    import {
        videoFrames,
        projectLabels,
        deleteLabel,
        selectedFrameIndex,
        fetchLabels,
        currentBoxes,
    } from "../stores/labeling";
    import { selectedProject } from "../stores/projects";

    let timelineHeight = 20;

    async function handleDeleteLabel(labelId) {
        await deleteLabel($selectedProject.id, labelId);
        await fetchLabels($selectedProject.id);
    }

    function determineColorFromFrameInfo(labelId, frame) {
        if (frame.labels.find((x) => x === labelId) !== undefined && frame.human_reviewed === false) {
            return `fill-sky-300 stroke-sky-500 stroke-2`;
        }
        else if (frame.labels.find((x) => x === labelId) !== undefined) {
            return `fill-emerald-400`;
        }
        else {
            return "fill-gray-300";
        }
    }

    function reviewCurrentBoxes(labelId) {
        $currentBoxes.forEach(box => {
            if (box.label_id === labelId) {
                box.checked = !box.checked;
            }
        });
        $currentBoxes = $currentBoxes;
    }
</script>

{#if $projectLabels.length && $videoFrames.length}
    <div class="flex flex-col h-3/4 overflow-auto">
        {#each $projectLabels as label}
            <div class="flex flex-row">
                <p class="mr-4">{label.name}</p>
                <button
                    class="border-solid border-2 border-gray-400 mx-1 p-1 rounded text-sm"
                    on:click={() => handleDeleteLabel(label.id)}
                >
                    Delete
                </button>
                    {#if label.hidden}
                        <button
                            class="border-solid border-2 border-gray-400 mx-1 p-1 rounded text-sm bg-gray-300"
                            on:click={() => {label.hidden = !label.hidden; reviewCurrentBoxes(label.id);}}
                        >
                            Hidden
                        </button>
                    {:else}
                        <button
                            class="border-solid border-2 border-gray-400 mx-1 p-1 rounded text-sm"
                            on:click={() => {label.hidden = !label.hidden; reviewCurrentBoxes(label.id);}}
                        >
                            Shown
                        </button>
                    {/if}
                
            </div>
            <div class="timeline-wrap mt-1 mb-4">
                <svg
                    id="timeline-container"
                    width="100%"
                    height="{timelineHeight}px"
                >
                    {#each $videoFrames as frame, frame_index}

                        <!-- Current frame segments should have a dark grey border in addition to the base styling -->
                        {#if frame_index === $selectedFrameIndex}
                            <rect
                                x="{frame_index * (1/$videoFrames.length * 100)}%"
                                y="0"
                                width="{(1/$videoFrames.length) * 100}%"
                                height="{timelineHeight}px"
                                class={determineColorFromFrameInfo(label.id, frame) + " stroke-gray-700 stroke-2"}
                            >
                                <title
                                    >{frame.human_reviewed === false
                                        ? "Unreviewed"
                                        : "Reviewed"}</title
                                >
                            </rect>
                        {:else}
                            <rect
                                x="{frame_index * (1/$videoFrames.length * 100)}%"
                                y="0"
                                width="{1/$videoFrames.length * 100}%"
                                height="{timelineHeight}px"
                                class={determineColorFromFrameInfo(label.id, frame)}
                                on:click={() => {
                                    $selectedFrameIndex = frame_index;
                                }}
                                on:keypress={() => {
                                    $selectedFrameIndex = frame_index;
                                }}
                            >
                                <title
                                    >{frame.human_reviewed === false
                                        ? "Unreviewed"
                                        : "Reviewed"}</title
                                >
                            </rect>
                        {/if}
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
