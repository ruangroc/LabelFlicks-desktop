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

    // Using the displayedLabel variable directly in the HTML code
    // below produces buggy label assignments
    let displayedLabel;
    $: projectLabelIndex = $projectLabels.findIndex(label => label.name === $labelIdToName[bbox.label_id]);
</script>

<!-- Display the box only if its corresponding labeling timeline is not hidden -->
{#if bbox.checked && $projectLabels && $projectLabels[projectLabelIndex] && !$projectLabels[projectLabelIndex].hidden}

    <!-- translate(x,y) moves the box to where the detected object is -->
    <g transform="translate({bbox.x_top_left * widthRatio}, {bbox.y_top_left * heightRatio})">
        <BoxRectangle bbox={bbox} widthRatio={widthRatio} heightRatio={heightRatio} />
        <BoxLabel bbox={bbox} bind:displayedLabel={$labelIdToName[bbox.label_id]} boxIndex={boxIndex} />
        <BoxDeleteLabel bbox={bbox} heightRatio={heightRatio}/>
    </g>
{/if}
