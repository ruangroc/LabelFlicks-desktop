<script>
    import { labelIdToName, projectLabels } from "../stores/labeling";
    import BoxDeleteLabel from "./BoxDeleteLabel.svelte";
    import BoxLabel from "./BoxLabel.svelte";
    import BoxRectangle from "./BoxRectangle.svelte";

    // Props for the Box component
    export let bbox;
    export let widthRatio;
    export let heightRatio;
    export let boxIndex;
    export let selectedFrameID;

    let displayedLabel = $labelIdToName[bbox.label_id];
    let projectLabelIndex = $projectLabels.findIndex(label => label.name === displayedLabel);
</script>


<!-- Display the box only if its corresponding labeling timeline is not hidden -->
{#if $projectLabels && $projectLabels[projectLabelIndex] && !$projectLabels[projectLabelIndex].hidden}

    <!-- translate(x,y) moves the box to where the detected object is -->
    <g transform="translate({bbox.x_top_left * widthRatio}, {bbox.y_top_left * heightRatio})">
        <BoxRectangle bbox={bbox} widthRatio={widthRatio} heightRatio={heightRatio} />
        <BoxLabel bbox={bbox} displayedLabel={displayedLabel} boxIndex={boxIndex} />
        <BoxDeleteLabel bbox={bbox} heightRatio={heightRatio} selectedFrameID={selectedFrameID}/>
    </g>
{/if}
