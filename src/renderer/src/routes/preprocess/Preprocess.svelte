<script>
	import Table from "../../components/Table.svelte";
	import { status } from "../../types.ts";
	import { selectedProject } from "../../stores/projects";
	import { preprocessingTableData, fetchVideos } from "../../stores/videos";

	let alignData = "text-center";

	let preprocessingCompleted = false;
	
	// Upon any change to the preprocessing data store, check statuses
	const unsubscribe = preprocessingTableData.subscribe((videos) => {
		let preprocessingStatusPerVideo = videos.map(video => video["Status"]);

		// Proceed if and only if all videos are done being processed
		if (!preprocessingStatusPerVideo.includes(status.InProgress)) {
			preprocessingCompleted = true;
		}
	})

	async function pollPreprocessingStatus() {
		while (!preprocessingCompleted) {
			// Refresh the videos data store every 30 seconds,
			// which will also refresh the derived preprocessing status store
			setTimeout(await fetchVideos($selectedProject.id), 30000);
		}
	}
	
	pollPreprocessingStatus();
</script>

<div class="flex flex-col items-center w-3/4 mx-auto mt-2">
	<div class="flex flex-row w-full justify-end mb-1">
		<button class="bg-gray-300 ml-auto p-2 rounded"
			><a href="#/upload">Cancel</a></button
		>
		<!-- Disable the next button until all videos have been preprocessed -->
		<button class={(preprocessingCompleted ? "bg-green-300" : "disabled bg-gray-200 text-gray-500") + " ml-3 p-2 rounded"}
			><a href="#/label">Next Step</a></button
		>
	</div>

	<div class="flex items-center w-full mt-2 mb-4">
		<h1 class="text-center text-lg font-semibold">
			Preprocessing your videos, please be patient...
		</h1>
	</div>
	<Table tableData={$preprocessingTableData} {alignData} />
</div>

<style>
	.disabled {
		pointer-events: none;
		cursor: not-allowed;
	}
</style>
