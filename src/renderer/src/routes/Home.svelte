<script>
	import { onMount } from "svelte";
	import Table from "../components/Table.svelte";
	import Modal from "../components/Modal.svelte";
	import { push } from 'svelte-spa-router';
	import { selectedProject, allProjects, projectsTableData, fetchProjects, createNewProject } from "../stores/projects";
	import { fetchVideos } from "../stores/videos";

	onMount(fetchProjects);

	let showCreateProjectModal = false;
	let projectName = "";

	async function createProject(event) {
		await createNewProject(projectName);
		showCreateProjectModal = false;
		projectName = "";
	}

	async function projectClicked(row) {
		const projectName = row["Project Name"];
		selectedProject.set($allProjects.find(project => project.name === projectName));
		await fetchVideos($selectedProject.id);

		// automatically move on to the Upload Videos page
		push("#/upload");
	}
</script>

<div class="flex flex-col items-center w-3/4 mx-auto mt-2">
	<h1 class="text-center text-xl mx-px mb-8">
		Welcome to Anita's Video Labeling Project (Official Name TBD)
	</h1>

	<button 
		class="rounded bg-green-300 hover:bg-green-400 mx-px mb-8 w-1/3"
		on:click={() => showCreateProjectModal = true}
	>
		<h2 class="text-center text-lg p-2">Create a new project</h2>
	</button>

	{#if $projectsTableData.length > 0}
	<Table tableData={$projectsTableData} onClick={projectClicked} />
	{/if}

	{#if showCreateProjectModal}
	<Modal>
		<h2 slot="header">
			Create a New Labeling Project
		</h2>
	
		<div slot="body">
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
		
			<button 
				class="bg-gray-300 hover:bg-gray-400 ml-auto p-2 rounded" 
				on:click={() => showCreateProjectModal = false}
			>
				Cancel
			</button>
			<button class="bg-green-300 hover:bg-green-400 ml-3 p-2 rounded" on:click={createProject}>
				Create Project
			</button>
		</div>
	</Modal>
	{/if}
</div>
