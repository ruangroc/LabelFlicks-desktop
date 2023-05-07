<script>
	import { selectedProject } from "../stores/projects";
</script>

<header class="shadow-md bg-white px-1">
	<nav>
		<div class="flex justify-center">
			<button>
				<a class="flex items-center text-sm py-4 px-6 h-12 text-gray-900 hover:bg-gray-200 transition duration-300 ease-in-out" href="/">
					Home
				</a>
			</button>
			<button class={Object.keys($selectedProject).length == 0 ? "disabled" : "text-gray-900"}>
				<a class="flex items-center text-sm py-4 px-6 h-12 hover:bg-gray-200 transition duration-300 ease-in-out" href="#/upload">
					1. Upload Videos
				</a>
			</button>
			<button class={Object.keys($selectedProject).length == 0 ? "disabled" : "text-gray-900"}>
				<a class="flex items-center text-sm py-4 px-6 h-12 hover:bg-gray-200 transition duration-300 ease-in-out" href="#/preprocess">
					2. Preprocess Videos
				</a>
			</button>
			<button class={Object.keys($selectedProject).length == 0 ? "disabled" : "text-gray-900"}>
				<a class="flex items-center text-sm py-4 px-6 h-12 hover:bg-gray-200 transition duration-300 ease-in-out" href="#/label">
					3. Label Videos
				</a>
			</button>
			<button class={Object.keys($selectedProject).length == 0 ? "disabled" : "text-gray-900"}>
				<a class="flex items-center text-sm py-4 px-6 h-12 hover:bg-gray-200 transition duration-300 ease-in-out" href="#/export">
					4. Export Labels
				</a>
			</button>
		</div>
	</nav>
</header>

<style>
	.disabled {
		pointer-events: none;
		cursor: not-allowed;
		color: darkgray;
	}
</style>