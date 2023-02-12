<script>
	import Router, {location, link} from 'svelte-spa-router';
	import Home from "./routes/Home.svelte";
	import Navbar from "./routes/Navbar.svelte";
	import Store from "./routes/store/Store.svelte";
	import Match from "./routes/match/CurrentMatchPlayers.svelte"
</script>

<body class="h-screen bg-gray-800">
	<div class="grid grid-cols-5">
		<div class="col-span-1">
			<Navbar />
		</div>
		<div class="col-span-4">
			<Router routes={{
				'/': Home,
				'/store': Store,
				'/match': Match
			}} />
		</div>
	</div>
</body>
