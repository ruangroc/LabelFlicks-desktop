<script>
    import { selectedProject } from "../../stores/projects";
    import { projectVideos } from "../../stores/videos";
    import { videoFrames, currentBoxes, fetchVideoFrames, fetchBoundingBoxes } from "../../stores/labeling";
    import { onMount } from "svelte";

    let selectedVideoID = $projectVideos[0].id;
    let selectedFrameID = "";

    onMount(async () => {
        await fetchVideoFrames(selectedVideoID);
    })
</script>

<div class="flex flex-col items-center w-3/4 mx-auto mt-2">
    <h1>Project: {$selectedProject.name}</h1>

    <label for="select-video"><h2>Select video:</h2></label>
    <select name="select-video" bind:value={selectedVideoID} on:change="{fetchVideoFrames(selectedVideoID)}">
        {#each $projectVideos as video}
            <option value="{video.id}">{video.name}</option>
        {/each}
    </select>

    <p>Selected video ID: {selectedVideoID}</p>
    <p>Number of frames: {$videoFrames.length}</p>

    <label for="select-frame"><h2>Select frame:</h2></label>
    <select name="select-frame" bind:value={selectedFrameID} on:change="{fetchBoundingBoxes(selectedFrameID)}">
        {#each $videoFrames as frame}
            <option value="{frame.id}">{frame.id}</option>
        {/each}
    </select>

    <p>Number of boxes: {$currentBoxes.length}</p>

</div>