<!-- https://svelte.dev/repl/7b02f45e49744502bf5f03cb61375f9f?version=3.31.0 -->
<script>
	import { status } from "../types.ts";

	export let tableData = [];
	export let alignData = "text-left"; // can be text-left or text-center
	export let onClick = () => {};
</script>

<table class="w-full border-collapse">
	<thead class={alignData}>
		<tr>
			{#each Object.keys(tableData[0]) as columnHeading}
				{#if columnHeading === "_icon"}
					<th />
				{:else}
					<th class="text-md font-semibold border-collapse"
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
						<td class="m-px py-4 center border-collapse">
							<button>
								<img
									class="w-4 h-4"
									src={cell.data}
									alt={cell.image_alt}
								/>
							</button>
						</td>
					{:else}
						<td class="m-px py-4 border-collapse {alignData}">
							{#if cell === status.Done}
								<img
									class="mx-auto w-4 h-4"
									src="src/static/green_checkmark.jpg"
									alt="done icon: green checkmark"
								/>
								Completed
							{:else if cell === status.InProgress}
								<img
									class="mx-auto w-4 h-4"
									src="src/static/loading.gif"
									alt="in progress icon: loading gif"
								/>
								In Progress
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
