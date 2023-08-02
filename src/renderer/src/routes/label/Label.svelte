<script>
    import { selectedProject } from "../../stores/projects";
    import { projectVideos } from "../../stores/videos";
    import {
        videoFrames,
        fetchVideoFrames,
        fetchBoundingBoxes,
        fetchLabels,
        selectedVideoID,
        selectedFrame,
        selectedFrameIndex,
    } from "../../stores/labeling";
    import { onMount } from "svelte";
    import SelectVideo from "../../components/SelectVideo.svelte";
    import PercentFramesReviewed from "../../components/PercentFramesReviewed.svelte";
    import StillFrame from "../../components/StillFrame.svelte";
    import { Stretch } from "svelte-loading-spinners";
    import Timeline from "../../components/Timeline.svelte";
    import CreateLabel from "../../components/CreateLabel.svelte";

    let showLoadingSymbol = true;
    let showCreateLabelModal = false;

    // Auto-refresh the screen when video changes
    selectedVideoID.subscribe(async (videoID) => {
        $selectedFrameIndex = 0;
        showLoadingSymbol = true;
        await fetchVideoFrames(videoID);
        $selectedFrame = $videoFrames[$selectedFrameIndex];
        if ($selectedFrame) await fetchBoundingBoxes($selectedFrame.id);
        await fetchLabels($selectedProject.id);
        showLoadingSymbol = false;
    });

    // Auto-refresh the "video player" when frame index changes
    selectedFrameIndex.subscribe(async () => {
        await fetchVideoFrames($selectedVideoID);
        $selectedFrame = $videoFrames[$selectedFrameIndex];
        if ($selectedFrame) await fetchBoundingBoxes($selectedFrame.id);
    })

    onMount(async () => {
        $selectedVideoID = $projectVideos[0].id;
    });

    
</script>

<div class="flex flex-col items-center w-5/6 mx-auto mt-2">
    <div class="flex flex-row w-full justify-end mt-2">
        <button class="bg-gray-300 ml-auto p-2 rounded"
            ><a href="/">Save & Exit Project</a></button
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

    {#if !showLoadingSymbol}
        <div class="grid grid-cols-2">
            <div class="flex flex-col col-span-1">
                <div class="flex flex-row flex-wrap w-full justify-start mb-2 py-1">
                    <SelectVideo />
                    <PercentFramesReviewed />
                </div>
        
                <StillFrame />
            </div>

            <div class="pl-4">
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

                <div class="flex flex-row my-2">
                    <svg width="50%" height="25px">
                        <rect 
                            x="0"
                            y="0"
                            width="15px" 
                            height="15px"
                            fill="rgb(125 211 252)"
                        />
                        <text x="10%" y="50%">Human-reviewed frame</text>
                    </svg>
                    <svg y="40%" width="50%" height="25px">
                        <rect 
                            x="0"
                            y="0"
                            width="15px" 
                            height="15px"
                            fill="rgb(248 113 113)"
                        />
                        <text x="10%" y="50%">Predicted frame</text>
                    </svg>
                </div>

                <Timeline />

                <CreateLabel bind:showCreateLabelModal />
            </div>
        </div>

    {:else}
        <Stretch size="60" color="#FF3E00" unit="px" duration="1s" />
    {/if}
</div>