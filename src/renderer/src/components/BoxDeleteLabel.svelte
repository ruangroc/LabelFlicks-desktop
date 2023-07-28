<script>
    import { deleteBox, fetchBoundingBoxes, selectedFrame } from "../stores/labeling";

    // Props for the Box component
    export let bbox;
    export let heightRatio;

    async function handleDeleteLabel() {
        await deleteBox(bbox.id);
        await fetchBoundingBoxes($selectedFrame.id);
    }
</script>

<rect 
    class={bbox.prediction ? "predicted-label-bg" : "bounding-box-label-bg"} 
    x="0" y="{bbox.height * heightRatio - 9}" 
    width="35" height="9" 
/>
<text
    class="bounding-box-label" 
    x="0" y="{bbox.height * heightRatio - 2}"
    on:click={() => {handleDeleteLabel()}}
    on:keypress={() => {handleDeleteLabel()}}
>
    delete
</text>

<style>
    rect.bounding-box-label-bg {
        fill: blue;
        fill-opacity: 0.8;
        cursor: pointer;
    }
    text.bounding-box-label {
        fill: white;
        fill-opacity: 0.9;
        font-size: 9px;
        font-family: monospace;
        cursor: pointer;
    }
    rect.predicted-label-bg {
        fill: red;
        fill-opacity: 0.8;
        cursor: pointer;
    }
</style>