<script>
	import Table from "../../components/Table.svelte";
    import { selectedProject, downloadAnnotations } from "../../stores/projects";
	import { videosExportTableData } from "../../stores/videos";
	import { Stretch } from 'svelte-loading-spinners';

	let showLoadingSymbol = false;

	async function handleDownload() {
		const data = await downloadAnnotations($selectedProject.id);
		let savePath = data["annotations-path"].replaceAll("\\", "/");
		alert("Frame images and annotations saved here: \n" + savePath);
	}
</script>

<div class="flex flex-col items-center w-3/4 mx-auto mt-2">
	<div class="flex flex-row w-full justify-end mb-1">
		<button class="bg-gray-300 ml-auto p-2 rounded"
			><a href="#/label">Cancel</a></button
		>
		<button class="bg-red-300 ml-3 p-2 rounded"
			><a href="/">Exit Project</a></button
		>
	</div>

	<div class="flex items-center w-full flex-row mt-4 mb-6">
		<h1 class="text-center text-lg font-semibold">
			Videos in your project
		</h1>

		<button 
			class="bg-green-300 ml-auto p-2 rounded"
			on:click={handleDownload}
		>
			Download annotations for project: {$selectedProject.name}
		</button>
	</div>

	{#if $videosExportTableData.length > 0}
        {#if showLoadingSymbol}
            <Stretch size="60" color="#FF3E00" unit="px" duration="1s" />
        {:else}
            <Table tableData={$videosExportTableData} />
        {/if}
    {/if}
	
</div>
