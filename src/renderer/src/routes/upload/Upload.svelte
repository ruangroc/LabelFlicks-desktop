<script>
    import Table from "../../components/Table.svelte";
    import { selectedProject, videosTableData } from "../../store";

    const server_port = import.meta.env.VITE_SERVER_PORT || 5000;

    let projectName = $selectedProject.name || "";

    let alignData = "text-left";
</script>

<div class="flex flex-col items-center w-3/4 mx-auto mt-2">
    <div class="flex flex-row w-full justify-end mb-1">
        <button class="bg-gray-300 ml-auto p-2 rounded"
            ><a href="/">Cancel</a></button
        >
        <button class="bg-green-300 ml-3 p-2 rounded"
            ><a href="#/preprocess">Next Step</a></button
        >
    </div>

    <div class="flex flex-row flex-wrap w-full justify-start mb-2 py-1">
        <h1 class="text-left text-lg font-semibold w-full my-1">
            Project Name
        </h1>
        <input
            type="text"
            placeholder="project-name"
            bind:value={projectName}
            class="w-full h-8 rounded bg-gray-200 p-2 text-md"
        />
    </div>

    <div class="flex items-center w-full my-2">
        <h1 class="text-center text-lg font-semibold">
            Videos in your project
        </h1>
        <button class="ml-auto bg-gray-300 p-2 rounded">
            Upload a Video
        </button>
    </div>
    {#if $videosTableData.length > 0}
    <Table tableData={$videosTableData} {alignData} />
    {/if}
</div>
