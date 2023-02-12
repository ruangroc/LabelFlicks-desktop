<script>
    export let name, characterName, rank, url, team;
</script>

<div class="bg-{team.toLowerCase()}-500 h-20 rounded-lg border-2 border-white overflow-hidden">
    <img 
        src="{url}"
        alt="{characterName}"
        class="flex float-left object-contain h-20"
    />
    <h1>{characterName}</h1>
    <h1>{name}</h1>
    <h1>{rank}</h1>
</div>