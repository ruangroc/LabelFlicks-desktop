<script>
    import { nameToLabelId, projectLabels, currentBoxes } from "../stores/labeling";

    // Props for the BoxLabel component
    export let bbox;
    export let displayedLabel;
    export let boxIndex;

    $: labelDisplayLength = displayedLabel ? displayedLabel.length * 6 : 0;
    let isEditing = false;
    let selectedLabel = "";

    function keydown(event) {
		if (event.key == 'Escape') {
			event.preventDefault();
			isEditing = false;
		}
	}

    function submit() {
        // After the user changes the label on a box, the Box component
        // should update its label and save the changed label in the 
        // global store containing information on all the bounding boxes
        $currentBoxes[boxIndex].label_id = $nameToLabelId[selectedLabel];
        displayedLabel = selectedLabel;
        labelDisplayLength = displayedLabel.length * 6;
        $currentBoxes[boxIndex].edited = true;
        $currentBoxes[boxIndex].prediction = false;
		isEditing = false;
	}
</script>

{#if !isEditing}
    <!-- write out the label name at the inner left top corner of each bounding box -->
    <rect 
        class={bbox.prediction ? "predicted-label-bg" : "bounding-box-label-bg"} 
        x="0" y="0" width="{labelDisplayLength}" height="9" 
        data-testid="label-rect-{bbox.id}"
    />
    <text 
        class="bounding-box-label" 
        x="0" y="6"
        on:click={() => isEditing = true}
        on:keypress={() => isEditing = true}
        data-testid="label-text-{bbox.id}"
    >
        {displayedLabel}
    </text>
{:else}
    <foreignObject width="400" height="400" x="0" y="-9">
        <form on:submit|preventDefault={submit} on:keydown={keydown}>
            <select 
                class="select-label" 
                style="width:{labelDisplayLength + 15}px; " 
                bind:value={selectedLabel} 
                on:change={submit} 
                required name="label"
            >
                {#each $projectLabels as label}
                    <option value={label.name}>{label.name}</option>
                {/each}
            </select>
        </form>
    </foreignObject>
{/if}

<style>
    rect.bounding-box-label-bg {
        fill: rgb(3 105 161); /* tailwind css sky-700 */
        fill-opacity: 0.9;
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
        fill: rgb(185 28 28); /* tailwind css red-700 */
        fill-opacity: 0.9;
        cursor: pointer;
    }
</style>