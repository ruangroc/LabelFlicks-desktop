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
        stroke: rgb(2 132 199); /* tailwind css sky-600 */
        fill: rgb(125 211 252); /* tailwind css sky-300 */
        fill-opacity: 0.35;
    }
    rect.predicted {
        stroke: rgb(185 28 28); /* tailwind css red-700 */
        fill: rgb(248 113 113); /* tailwind css red-400 */
        fill-opacity: 0.35;
    }
</style>