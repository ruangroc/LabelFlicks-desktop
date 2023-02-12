<script>
	import Table from "../components/Table.svelte";

	let existingProjectsMockData = [
		{
			'Project Name': 'seattle-wildlife-project',
			'Date Created': 'June 20, 2022',
			'Number of Videos': '6',
			'Percent Labeled': '78%'
		},
		{
			'Project Name': 'olympia-state-park',
			'Date Created': 'July 3, 2022',
			'Number of Videos': '12',
			'Percent Labeled': '16%'
		},
		{
			'Project Name': 'montana-black-bears',
			'Date Created': 'May 4, 2022',
			'Number of Videos': '46',
			'Percent Labeled': '100%'
		}
	];
	let alignData = 'text-left';
</script>

<div class="flex flex-col items-center w-3/4 mx-auto mt-2">
    <h1 class="text-center text-xl mx-px mb-8">
        Welcome to Anita's Video Labeling Project (Official Name TBD)
    </h1>

    <button class="bg-gray-200 hover:bg-gray-300 mx-px mb-8 w-1/3 h-8">
        <h2 class="text-center text-lg">Create a new project</h2>
    </button>

    <!-- <h2 class="text-center text-lg mx-px mb-8 w-1/3 h-8">Current Projects</h2> -->
    <Table tableData={existingProjectsMockData} alignData={alignData} />
</div>