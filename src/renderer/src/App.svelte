<script>
	import Router, {location, link} from 'svelte-spa-router';
	import Home from "./routes/Home.svelte";
	import Navbar from "./routes/Navbar.svelte";
	import Upload from './routes/upload/Upload.svelte';
	import Preprocess from './routes/preprocess/Preprocess.svelte';
	import Label from './routes/label/Label.svelte';
	import Export from './routes/export/Export.svelte';
</script>

<body class="h-screen bg-gray-100">
	<div class="grid grid-rows-5">
		<div class="row-span-1">
			<Navbar />
		</div>
		<div class="row-span-4">
			<Router routes={{
				'/': Home,
				'/upload': Upload,
				'/preprocess': Preprocess,
				'/label': Label,
				'/export': Export
			}} />
		</div>
	</div>
</body>
