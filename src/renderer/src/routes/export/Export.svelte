<script>
	import Table from "../../components/Table.svelte";
    import { status } from "../../types.ts";

	let mockExportData = [
		{
			Name: 'my-video-1.mp4',
			'Annotated Images': status.NotStarted,
			'Feature Vectors': status.InProgress,
			'Bounding Boxes': status.Done,
		},
		{
			Name: 'my-video-2.mp4',
			'Annotated Images': status.NotStarted,
			'Feature Vectors': status.InProgress,
			'Bounding Boxes': status.Done,
		},
		{
			Name: 'my-video-3.mp4',
			'Annotated Images': status.NotStarted,
			'Feature Vectors': status.InProgress,
			'Bounding Boxes': status.Done,
		}
	];
	let alignData = 'text-center';
</script>

<div class="flex flex-col items-center w-3/4 mx-auto mt-2">
    <div class="flex flex-row w-full justify-end mb-1">
        <button class="bg-gray-300 ml-auto p-2 rounded"><a href="#/label">Cancel</a></button>
		<button class="bg-red-300 ml-3 p-2 rounded"><a href="/">Exit Project</a></button>
    </div>

    <div class="flex flex-row w-full justify-start mb-6">
        <h1 class="text-center text-lg font-semibold mr-3 py-2">
            Select items you would like to save
        </h1>
        <button class="bg-green-300 mr-3 p-2 rounded">Download All</button>
		<button class="bg-green-300 mr-auto p-2 rounded">Download Selected</button>
    </div>

    <Table tableData={mockExportData} alignData={alignData} />
</div>