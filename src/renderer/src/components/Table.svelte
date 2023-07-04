<!-- https://svelte.dev/repl/7b02f45e49744502bf5f03cb61375f9f?version=3.31.0 -->
<script>
	import { status } from "../types.ts";

	export let tableData = [];
	export let alignData = "text-left"; // can be text-left or text-center
	export let onClick = () => {};
	$: numHeadings = Object.keys(tableData[0]).length;
</script>

<table class="w-full mx-auto border-collapse">
	<thead class="text-left">
		<tr>
			{#each Object.keys(tableData[0]) as columnHeading}
				{#if columnHeading === "_icon"}
					<th />
				{:else}
					<th class={`text-md font-semibold border-collapse`}
						>{columnHeading}</th
					>
				{/if}
			{/each}
		</tr><tr />
	</thead>
	<tbody>
		{#each Object.values(tableData) as row}
			<tr class="hover:bg-gray-200 border-collapse" on:click={onClick(row)}>
				{#each Object.values(row) as cell}
					{#if cell.type === "image"}
						<td class={`py-4 center border-collapse`}>
							<button>
								<img
									class="w-4 h-4"
									src={cell.data}
									alt={cell.image_alt}
								/>
							</button>
						</td>
					{:else}
						<td class="m-4 py-4 border-collapse text-left">
							{#if cell === status.Done}
								<div class="mx-auto flex flex-row">
									<img
										class="w-6 h-6"
										src="src/static/green-checkmark.png"
										alt="done icon: green checkmark"
									/>
									<p class="ml-2">Completed</p>
								</div>
							{:else if cell === status.InProgress}
								<div class="mx-auto flex flex-row">
									<img
									class="w-6 h-6"
										src="src/static/loading.gif"
										alt="in progress icon: loading gif"
									/>
									<p class="ml-2">In Progress</p>
								</div>
							{:else if cell === status.NotStarted}
								<div />
							{:else if cell.type === "button"}
								<button>{cell.data}</button>
							{:else}
								{cell}
							{/if}
						</td>
					{/if}
				{/each}
			</tr>
		{/each}
	</tbody>
</table>

<style>
	table,
	th,
	td {
		border-bottom: 1px solid #acacac;
	}
</style>
