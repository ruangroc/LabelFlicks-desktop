<script>
	import { onMount } from "svelte";
	import { allProjects, projectsTableData, selectedProject, projectVideos } from "../store";
	import Table from "../components/Table.svelte";
	import Modal from "../components/Modal.svelte";
	import {push, pop, replace} from 'svelte-spa-router';

	const server_port = import.meta.env.VITE_SERVER_PORT || 5000;

	onMount(async () => {
		fetch(`http://localhost:${server_port}/projects`)
		.then(response => response.json())
		.then(data => {
			allProjects.set(data);
		}).catch(error => {
			console.log(error);
		});
	});

	let alignData = "text-center";

	let showCreateProjectModal = false;
	let projectName = "";
	let numFrames = 1;
	let numSeconds = 1;

	async function createProject(event) {
		fetch(`http://localhost:${server_port}/projects`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Accept': 'application/json'
			},
			body: JSON.stringify({
				"name": projectName,
				"frame_extraction_rate": Math.round(numFrames / numSeconds),
			})
		})
		.then(response => response.json())
		.then(newProject => {
			console.log(newProject);
			$allProjects = [...$allProjects, newProject];
			showCreateProjectModal = false;
			projectName = "";
			numFrames = 1;
			numSeconds = 1;
		}).catch(error => {
			console.log(error);
		});
	}

	function projectClicked(row) {
		const projectName = row["Project Name"];
		selectedProject.set($allProjects.find(project => project.name === projectName));
		fetch(`http://localhost:${server_port}/projects/${$selectedProject.id}/videos`)
		.then(response => response.json())
		.then(data => {
			projectVideos.set(data.videos);
		}).catch(error => {
			console.log(error);
		});
		// route to the Upload Videos page
		push("#/upload");
	}
</script>

<div class="flex flex-col items-center w-3/4 mx-auto mt-2">
	<h1 class="text-center text-xl mx-px mb-8">
		Welcome to Anita's Video Labeling Project (Official Name TBD)
	</h1>

	<button 
		class="bg-gray-200 hover:bg-gray-300 mx-px mb-8 w-1/3 h-8"
		on:click={() => showCreateProjectModal = true}
	>
		<h2 class="text-center text-lg">Create a new project</h2>
	</button>

	{#if $projectsTableData.length > 0}
	<Table tableData={$projectsTableData} {alignData} onClick={projectClicked} />
	{/if}

	{#if showCreateProjectModal}
	<Modal bind:showModal={showCreateProjectModal}>
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
		
			<div class="flex justify-start w-full my-2 py-2">
				<h1 class="text-center text-lg font-semibold">Frame Extraction Rate</h1>
				<div class="pl-4 align-center">
					<input
						type="number"
						bind:value={numFrames}
						class="w-8 h-8 rounded bg-gray-200 text-sm"
					/>
					frame(s) for every
					<input
						type="number"
						bind:value={numSeconds}
						class="w-8 h-8 rounded bg-gray-200 text-sm"
					/>
					second(s)
				</div>
			</div>
		
			<button 
				class="bg-gray-300 ml-auto p-2 rounded" 
				on:click={() => showCreateProjectModal = false}
			>
				Cancel
			</button>
			<button class="bg-green-300 ml-3 p-2 rounded" on:click={createProject}>
				Create Project
			</button>
		</div>
	</Modal>
	{/if}
</div>
