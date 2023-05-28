<script>
    import { onMount } from "svelte";
    import { currentBoxes } from "../stores/labeling";
    import Box from "./Box.svelte";

    export let selectedFrame;
    let displayBoxes = false;
    let renderedFrameProperties = {};
    let widthRatio = 0;
    let heightRatio = 0;

    onMount(() => {
        pollFrameRenderStatus();
    });

    function pollFrameRenderStatus() {
        let element = document.getElementById("frame-img");
        let rendered = element.getBoundingClientRect().width;
        if (!rendered) {
            setTimeout(pollFrameRenderStatus, 100);
        }
        else {
            displayBoxes = true;

            // There may be a discrepancy between the image size it was processed at
            // and the actual rendered size, but the ratios solve that problem
            renderedFrameProperties = document.getElementById("frame-img").getBoundingClientRect();
            widthRatio = renderedFrameProperties.width / selectedFrame.width;
            heightRatio = renderedFrameProperties.height / selectedFrame.height;
        }
    }

</script>


{#if displayBoxes}
    <svg
        id="bounding-box-container"
        width="{renderedFrameProperties.width}px"
        height="{renderedFrameProperties.height}px"
    >
        {#each $currentBoxes as bbox, boxIndex}
            <Box bbox={bbox} widthRatio={widthRatio} heightRatio={heightRatio} boxIndex={boxIndex} />
        {/each}
    </svg>
{/if}


<style>
    svg {
        position: absolute;
        top: 0;
        left: 0;
    }
</style>