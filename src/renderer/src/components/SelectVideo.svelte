<script>
    import { projectVideos } from "../stores/videos";
    import { selectedVideoID } from "../stores/labeling";
</script>

<div class="flex flex-row w-full py-1">
    <label class="pr-2" for="select-video"
        ><h2>Video:</h2></label
    >
    <select
        name="select-video"
        class="w-full"
        bind:value={$selectedVideoID}
    >
        {#each $projectVideos as video}
            <option class="text-sm" value={video.id}>{video.name}</option>
        {/each}
    </select>
</div>