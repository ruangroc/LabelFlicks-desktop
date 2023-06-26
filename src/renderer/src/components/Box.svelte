<script>
    import { labelIdToName, nameToLabelId, projectLabels, currentBoxes, deleteBox, fetchBoundingBoxes } from "../stores/labeling";

    export let bbox;
    export let widthRatio;
    export let heightRatio;
    export let boxIndex;
    export let selectedFrameID;

    let isEditing = false;
    let selectedLabel = "";
    let displayedLabel = $labelIdToName[bbox.label_id];
    let labelDisplayLength = displayedLabel.length * 6;
    let projectLabelIndex = $projectLabels.findIndex(label => label.name === displayedLabel);

    function keydown(event) {
		if (event.key == 'Escape') {
			event.preventDefault();
			isEditing = false;
		}
	}

    function submit() {
        $currentBoxes[boxIndex].label_id = $nameToLabelId[selectedLabel];
        displayedLabel = selectedLabel;
        labelDisplayLength = displayedLabel.length * 6;
        $currentBoxes[boxIndex].edited = true;
        $currentBoxes[boxIndex].prediction = false;
		isEditing = false;
	}
</script>


<!-- Display the box only if its corresponding labeling timeline is not hidden -->
{#if $projectLabels && $projectLabels[projectLabelIndex] && !$projectLabels[projectLabelIndex].hidden}

    <!-- translate(x,y) moves the box to where the detected object is -->
    <g transform="translate({bbox.x_top_left * widthRatio}, {bbox.y_top_left * heightRatio})">
        <!-- the rectangle is the actual drawn bounding box -->
        <rect 
            class={bbox.prediction ? "predicted" : "bounding-box"} 
            x="0"
            y="0"
            width="{bbox.width * widthRatio}" 
            height="{bbox.height * heightRatio}">
        </rect>

        {#if !isEditing}
            <!-- write out the label name at the inner left top corner of each bounding box -->
            <rect class={bbox.prediction ? "predicted-label-bg" : "bounding-box-label-bg"} x="0" y="0" width="{labelDisplayLength}" height="9" />
            <text 
                class="bounding-box-label" 
                x="0" y="6"
                on:click={() => isEditing = true}
                on:keypress={() => isEditing = true}
            >
                {displayedLabel}
            </text>

            <!-- Write out an X for the delete button -->
            <rect class={bbox.prediction ? "predicted-label-bg" : "bounding-box-label-bg"} x="0" y="{bbox.height * heightRatio - 9}" width="35" height="9" />
            <text
                class="bounding-box-label" 
                x="0" y="{bbox.height * heightRatio - 2}"
                on:click={() => {deleteBox(bbox.id); fetchBoundingBoxes(selectedFrameID);}}
                on:keypress={() => {deleteBox(bbox.id); fetchBoundingBoxes(selectedFrameID);}}
            >
                delete
            </text>
        {:else}
            <foreignObject width="400" height="400" x="0" y="-9">
                <form on:submit|preventDefault={submit} on:keydown={keydown}>
                    <select class="select-label" style="width:{labelDisplayLength + 15}px; " bind:value={selectedLabel} on:change={submit} required name="label">
                        <!-- <option disabled selected value="select">Select a new label</option> -->
                        {#each $projectLabels as label}
                            <option value={label.name}>{label.name}</option>
                        {/each}
                    </select>
                </form>
            </foreignObject>
        {/if}
    </g>
{/if}


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
    rect.predicted {
        stroke: red;
        fill: red;
        fill-opacity: 0.1;
    }
    rect.predicted-label-bg {
        fill: red;
        fill-opacity: 0.8;
    }
</style>