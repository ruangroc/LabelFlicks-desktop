<script>
	export let name, skin, price;

    let colour = '';
    switch(price)
    {
        case 875: 
            colour = "blue";
            break;

        case 1275: 
            colour = "green";
            break;

        case 1775: 
            colour = "purple";
            break;

        case 2475: 
            colour = "yellow";
            break;

        default: 
            colour = "orange";
            break;
    }

</script>


<div class="bg-white rounded-md transition hover:drop-shadow-xl duration-500">

    <h3 class="mt-1 text-gray-700 text-center font-bold text-xl">{name}</h3>
    <div class="w-full overflow-hidden bg-white xl:aspect-w-7 xl:aspect-h-8 pt-2 pb-4 h-28">
        <img
            src="{skin}"
            alt="{name}"
            class="object-contain h-24 w-full object-center drop-shadow-md"
        />
    </div>
    <div class="bg-{colour}-500 rounded-md rounded-t-none flex items-center justify-center py-1">
        <img 
            src="https://media.valorant-api.com/currencies/85ad13f7-3d1b-5128-9eb2-7cd8ee0b5741/displayicon.png"
            alt="VP"
            class="h-5 flex-row"
        />
        <p class="px-1 text-lg font-medium text-white flex-row">{price}</p>
    </div>

</div>
<!--<span class="hidden bg-blue-500 bg-green-500 bg-purple-500 bg-yellow-500 bg-orange-500"></span>-->