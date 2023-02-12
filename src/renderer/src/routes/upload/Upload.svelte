<script>
	import Table from "../../components/Table.svelte";

	let projectName = '';
	let videosMockData = [
		{
			Name: 'my-video-1.mp4',
			Date: 'July 12, 2022',
			Size: '85 MB'
		},
		{
			Name: 'my-video-2.mp4',
			Date: 'July 12, 2022',
			Size: '99 MB'
		},
		{
			Name: 'my-video-3.mp4',
			Date: 'July 12, 2022',
			Size: '76 MB'
		}
	];
	let alignData = 'text-left';
</script>

<div class="flex flex-col items-center w-3/4 mx-auto mt-2">
    <div class="flex flex-row w-full justify-end mb-1">
        <button class="bg-gray-300 ml-auto p-2 rounded"><a href="/">Cancel</a></button>
		<button class="bg-green-300 ml-3 p-2 rounded"><a href="#/preprocess">Next Step</a></button>
    </div>

    <div class="flex flex-row flex-wrap w-full justify-start mb-2 py-1">
        <h1 class="text-left text-lg font-semibold w-full my-1">
            Project Name
        </h1>
        <input 
        type="text" placeholder="project-name" bind:value={projectName} 
        class="w-full h-8 rounded bg-gray-200 p-2 text-md"
        />
    </div>

    <div class="flex justify-start w-full my-2 py-2">
        <h1 class="text-center text-lg font-semibold">
            Frame Extraction Rate
        </h1>
        <div class="pl-4 align-center">
			<input type="number" value={1} class="w-8 h-8 rounded bg-gray-200 text-sm"/> 
            frame(s) for every 
            <input type="number" value={1} class="w-8 h-8 rounded bg-gray-200 text-sm"/> 
            second(s)
		</div>
    </div>

    <div class="flex items-center w-full my-2">
        <h1 class="text-center text-lg font-semibold">
            Videos in your project
        </h1>
        <button class="ml-auto bg-gray-300 p-2 rounded">
            Upload a Video
        </button>
    </div>
    <Table tableData={videosMockData} alignData={alignData} />
</div>