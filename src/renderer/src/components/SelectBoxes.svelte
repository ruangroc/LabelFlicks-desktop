<script>

    import { currentBoxes, labelIdToName } from "../stores/labeling";

</script>

<div class="flex flex-col w-full h-48 overflow-auto">
    <h2 class="text-lg py-2">Individual Box Selection</h2>
    {#each $currentBoxes as box, box_index}
        <label class="text-md" data-testid="checkbox-label">
            <input type="checkbox" bind:checked={box.checked}/>
            Label: {$labelIdToName[box.label_id]} | Box Index: {box_index}
        </label>
    {/each}
</div>
