<script>
	import Table from "../../components/Table.svelte";
    import { status } from "../../types.ts";

	let mockLoadingData = [
		{
			Name: 'my-video-1.mp4',
			'Extract Frames': status.Done,
			'Feature Extraction': status.Done,
			'Object Detection': status.Done,
			'Label Prediction': status.Done,
			'Similarity Grouping': status.InProgress
		},
		{
			Name: 'my-video-2.mp4',
			'Extract Frames': status.Done,
			'Feature Extraction': status.Done,
			'Object Detection': status.InProgress,
			'Label Prediction': status.NotStarted,
			'Similarity Grouping': status.NotStarted
		},
		{
			Name: 'my-video-3.mp4',
			'Extract Frames': status.InProgress,
			'Feature Extraction': status.NotStarted,
			'Object Detection': status.NotStarted,
			'Label Prediction': status.NotStarted,
			'Similarity Grouping': status.NotStarted
		}
	];
	let alignData = 'text-center';
</script>

<div class="flex flex-col items-center w-3/4 mx-auto mt-2">
    <div class="flex flex-row w-full justify-end mb-1">
        <button class="bg-gray-300 ml-auto p-2 rounded"><a href="#/upload">Cancel</a></button>
		<button class="bg-green-300 ml-3 p-2 rounded"><a href="#/label">Next Step</a></button>
    </div>

    <div class="flex items-center w-full mt-2 mb-4">
        <h1 class="text-center text-lg font-semibold">
            Preprocessing your videos, please be patient...
        </h1>
    </div>
    <Table tableData={mockLoadingData} alignData={alignData} />
</div>