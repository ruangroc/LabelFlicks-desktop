<script>
    import Table from "../../components/Table.svelte";
    import Modal from "../../components/Modal.svelte";
    import { Stretch } from 'svelte-loading-spinners';
    import { selectedProject } from "../../stores/projects";
	import { videosTableData, fetchVideos, uploadVideo } from "../../stores/videos";

    let projectName = $selectedProject.name || "";

    let alignData = "text-left";

    let showUploadVideoModal = false;
    let selectedVideo;
    let showLoadingSymbol = false;

    async function uploadVideos() {
        showUploadVideoModal = false;

        // Note that files are of type `FileList`, not an Array:
		// https://developer.mozilla.org/en-US/docs/Web/API/FileList
        // Must put the 0th FileList item into the FormData object
        const formData = new FormData();
        formData.append('video', selectedVideo[0]);
        showLoadingSymbol = true;

        await uploadVideo($selectedProject.id, formData);

        // let uploadResponse = await fetch(`http://localhost:${server_port}/projects/${$selectedProject.id}/videos`, {
		// 	method: 'POST',
		// 	body: formData
		// });
        // let uploadData = await uploadResponse.json();

        // let refreshResponse = await fetch(`http://localhost:${server_port}/projects/${$selectedProject.id}/videos`);
        // let refreshData = await refreshResponse.json();
        // projectVideos.set(refreshData.videos);
        await fetchVideos($selectedProject.id);
        showLoadingSymbol = false;
    }
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
        <button 
            class="ml-auto bg-gray-300 p-2 rounded" 
            on:click={() => showUploadVideoModal = true}
        >
            Upload a Video
        </button>
    </div>

    {#if showUploadVideoModal}
	<Modal>
		<h2 slot="header">
			Select a video to add to this project
		</h2>
	
		<div slot="body">
			<div class="flex flex-col w-full justify-start mb-2 py-4">
				<label for="video-select">Upload a video:</label>
                <input
                    accept="video/mp4"
                    bind:files={selectedVideo}
                    type="file"
                    class="py-4"
                    id="video-select"
                />
			</div>
		
			<button 
				class="bg-gray-300 hover:bg-gray-400 ml-auto p-2 rounded" 
				on:click={() => showUploadVideoModal = false}
			>
				Cancel
			</button>
			<button class="bg-green-300 hover:bg-green-400 ml-3 p-2 rounded" on:click={uploadVideos}>
				Upload
			</button>
		</div>
	</Modal>
	{/if}

    {#if $videosTableData.length > 0}
        {#if showLoadingSymbol}
            <Stretch size="60" color="#FF3E00" unit="px" duration="1s" />
        {:else}
            <Table tableData={$videosTableData} {alignData} />
        {/if}
    {/if}
</div>
