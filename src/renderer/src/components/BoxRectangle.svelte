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
        stroke: rgb(4 120 87); /* tailwind css emerald-700 */
        fill: rgb(52 211 153); /* tailwind css emerald-400 */
        fill-opacity: 0.3;
    }
    rect.predicted {
        stroke: rgb(2 132 199); /* tailwind css sky-600 */
        fill: rgb(125 211 252); /* tailwind css sky-300 */
        fill-opacity: 0.3;
    }
</style>