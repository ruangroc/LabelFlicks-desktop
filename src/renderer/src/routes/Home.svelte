<script>
	import { onMount } from "svelte";
	import { allProjects, projectsTableData } from "../store";
	import Table from "../components/Table.svelte";

	onMount(async () => {
		fetch("http://localhost:5000/projects")
		.then(response => response.json())
		.then(data => {
			allProjects.set(data);
		}).catch(error => {
			console.log(error);
		});
	});

	let alignData = "text-center";
</script>

<div class="flex flex-col items-center w-3/4 mx-auto mt-2">
	<h1 class="text-center text-xl mx-px mb-8">
		Welcome to Anita's Video Labeling Project (Official Name TBD)
	</h1>

	<button class="bg-gray-200 hover:bg-gray-300 mx-px mb-8 w-1/3 h-8">
		<h2 class="text-center text-lg">Create a new project</h2>
	</button>

	{#if $projectsTableData.length > 0}
	<Table tableData={$projectsTableData} {alignData} />
	{/if}
</div>
