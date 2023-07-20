<script>

    import { currentBoxes, labelIdToName } from "../stores/labeling";

</script>

<div class="flex flex-col w-full">
    <h2 class="text-lg py-2">Individual Box Selection</h2>
    {#each $currentBoxes as box, boxIndex}
        <label class="text-md">
            <input type="checkbox" bind:checked={box.checked} />
            Box: {boxIndex}  |  Label: {$labelIdToName[box.label_id]}
        </label>
    {/each}
</div>
