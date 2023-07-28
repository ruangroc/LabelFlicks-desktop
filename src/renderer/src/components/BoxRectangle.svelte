<script>
    export let bbox;
    export let widthRatio;
    export let heightRatio;
</script>

<!-- Display predicted, non-human-reviewed boxes in red -->
<rect 
    class={bbox.prediction ? "predicted" : "bounding-box"} 
    x="0"
    y="0"
    width="{bbox.width * widthRatio}" 
    height="{bbox.height * heightRatio}"
    data-testid="rect-{bbox.id}"
/>

<style>
    rect.bounding-box {
        stroke: blue;
        fill: blue;
        fill-opacity: 0.1;
    }
    rect.predicted {
        stroke: red;
        fill: red;
        fill-opacity: 0.1;
    }
</style>