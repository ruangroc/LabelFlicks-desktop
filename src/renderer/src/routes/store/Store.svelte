<script>
    import StoreItem from "./StoreItem.svelte";
	import { onMount } from 'svelte';
    
    let items = [];
	onMount(async () => {
		fetch('http://localhost:3000/store')
		.then((x) => x.json())
		.then(res => {
			console.log(res)
			items = res
		})
	});
</script>
<div class="bg-gray-100">
    <div class="mx-auto max-w-2xl py-16 px-4 lg:max-w-7xl lg:px-8">
        <h1 class="font-bold text-center pb-4 text-2xl">STORE</h1>
        <div class="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8 rounded-lg">
            {#each items as item}
                <StoreItem 
                    name={item.name} 
                    skin={item.url}
                    price={item.price}
                />
            {/each}
        </div>
    </div>
</div>