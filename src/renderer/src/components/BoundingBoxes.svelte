<script>
    import { onMount } from "svelte";
    import { currentBoxes, labelIdToName } from "../stores/labeling";

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

<style>
    rect.bounding-box {
        stroke: blue;
        fill: blue;
        fill-opacity: 0.1;
    }
    rect.bounding-box-label-bg {
        fill: blue;
        fill-opacity: 0.8;
    }
    text.bounding-box-label {
        fill: white;
        fill-opacity: 0.9;
        font-size: 9px;
        font-family: monospace;
    }
    svg {
        position: absolute;
        top: 0;
        left: 0;
    }
</style>


{#if displayBoxes}
    <svg
        id="bounding-box-container"
        width="{renderedFrameProperties.width}px"
        height="{renderedFrameProperties.height}px"
    >
        {#each $currentBoxes as bbox}
            <!-- translate(x,y) moves the box to where the detected object is -->
            <g transform="translate({bbox.x_top_left * widthRatio}, {bbox.y_top_left * heightRatio})">
                <!-- the rectangle is the actual drawn bounding box -->
                <rect 
                    class="bounding-box" 
                    x="0"
                    y="0"
                    width="{bbox.width * widthRatio}" 
                    height="{bbox.height * heightRatio}">
                </rect>

                <!-- write out the label name at the top of each bounding box -->
                {#if bbox.hasOwnProperty("label_id")}
                    <rect class="bounding-box-label-bg" x="0" y="-9" width="{$labelIdToName[bbox.label_id].length*6}" height="9" />
                    <text class="bounding-box-label">{$labelIdToName[bbox.label_id]}</text>
                {/if}
            </g>
        {/each}
    </svg>
{/if}