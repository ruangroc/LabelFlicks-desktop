<script>
    import Modal from "./Modal.svelte";
    import { createLabel, fetchLabels } from "../stores/labeling";
    import { selectedProject } from "../stores/projects";

    // Props for CreateLabel component
    export let showCreateLabelModal;
    
    let newLabelName;

    async function createNewLabel() {
        await createLabel($selectedProject.id, newLabelName);
		showCreateLabelModal = false;
		newLabelName = "";
        await fetchLabels($selectedProject.id);
    }
</script>

{#if showCreateLabelModal}
<Modal>
    <h2 slot="header" data-testid="modal-heading">
        Create a New Label
    </h2>

    <div slot="body">
        <div class="flex flex-row flex-wrap w-full justify-start mb-2 py-1">
            <h1 class="text-left text-lg font-semibold w-full my-1">
                Label Name
            </h1>
            <input
                type="text"
                placeholder="project-name"
                bind:value={newLabelName}
                class="w-full h-8 rounded bg-gray-200 p-2 text-md"
                data-testid="modal-input"
            />
        </div>
    
        <button 
            class="bg-gray-300 hover:bg-gray-400 ml-auto p-2 rounded" 
            on:click={() => showCreateLabelModal = false}
            data-testid="cancel-button"
        >
            Cancel
        </button>
        <button 
            class="bg-green-300 hover:bg-green-400 ml-3 p-2 rounded" 
            on:click={createNewLabel}
            data-testid="create-button"
        >
            Create Label
        </button>
    </div>
</Modal>
{/if}