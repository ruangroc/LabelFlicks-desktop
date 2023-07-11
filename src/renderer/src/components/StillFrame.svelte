<script>
    import { selectedFrame } from "../stores/labeling";
    import BoundingBoxes from "./BoundingBoxes.svelte";
</script>

{#if $selectedFrame}
<div class="img-overlay-wrap">
    <img
        id="frame-img"
        src={$selectedFrame.frame_url}
        alt="still frame from the video"
    />
    <BoundingBoxes />
</div>
{/if}

<style>
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

