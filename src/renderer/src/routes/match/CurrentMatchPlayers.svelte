<script>
    let data = [
        {
            "name": "headspoppin#0000",
            "puuid": "3f3579e1-7601-5839-986a-35104dc757f3",
            "rankRating": 8,
            "rank": 16,
            "rankName": "PLATINUM 2",
            "team": "Blue",
            "charater": {
            "agentID": "a3bfb853-43b2-7238-a4f1-ad90e9e46bcc",
            "agentName": "Reyna",
            "url": "https://media.valorant-api.com/agents/a3bfb853-43b2-7238-a4f1-ad90e9e46bcc/displayicon.png"
            }
        },
        {
            "name": "Sabu Dana#MGTOW",
            "puuid": "c4d58572-760b-562d-bfd1-7603203cb6b3",
            "rankRating": 62,
            "rank": 11,
            "rankName": "SILVER 3",
            "team": "Blue",
            "charater": {
            "agentID": "117ed9e3-49f3-6512-3ccf-0cada7e3823b",
            "agentName": "Cypher",
            "url": "https://media.valorant-api.com/agents/117ed9e3-49f3-6512-3ccf-0cada7e3823b/displayicon.png"
            }
        },
        {
            "name": "Chal Nikal#2002",
            "puuid": "b2a15490-a3f7-5576-b6f5-f9801b129585",
            "team": "Blue",
            "charater": {
            "agentID": "601dbbe7-43ce-be57-2a40-4abd24953621",
            "agentName": "KAY/O",
            "url": "https://media.valorant-api.com/agents/601dbbe7-43ce-be57-2a40-4abd24953621/displayicon.png"
            }
        },
        {
            "name": "InstaVimraaj#LUKHA",
            "puuid": "cc8655fc-abf9-5029-a35e-d686d6c443fa",
            "rankRating": 0,
            "rank": 17,
            "rankName": "PLATINUM 3",
            "team": "Blue",
            "charater": {
            "agentID": "add6443a-41bd-e414-f6ad-e58d267f4e95",
            "agentName": "Jett",
            "url": "https://media.valorant-api.com/agents/add6443a-41bd-e414-f6ad-e58d267f4e95/displayicon.png"
            }
        },
        {
            "name": "HAWKEYE#191",
            "puuid": "d2dc5edb-bbcf-5225-b156-9fb39e044369",
            "rankRating": 71,
            "rank": 12,
            "rankName": "GOLD 1",
            "team": "Blue",
            "charater": {
            "agentID": "569fdd95-4d10-43ab-ca70-79becc718b46",
            "agentName": "Sage",
            "url": "https://media.valorant-api.com/agents/569fdd95-4d10-43ab-ca70-79becc718b46/displayicon.png"
            }
        },
        {
            "name": "Sc3nE#9999",
            "puuid": "9c0572c5-f1e6-5f3c-854e-78d7ef9562cb",
            "rankRating": 70,
            "rank": 11,
            "rankName": "SILVER 3",
            "team": "Red",
            "charater": {
            "agentID": "8e253930-4c05-31dd-1b6c-968525494517",
            "agentName": "Omen",
            "url": "https://media.valorant-api.com/agents/8e253930-4c05-31dd-1b6c-968525494517/displayicon.png"
            }
        },
        {
            "name": "SageSimp#7424",
            "puuid": "1bf47d61-d56e-50ef-aef4-7f5aac22ce53",
            "rankRating": 31,
            "rank": 17,
            "rankName": "PLATINUM 3",
            "team": "Red",
            "charater": {
            "agentID": "6f2a04ca-43e0-be17-7f36-b3908627744d",
            "agentName": "Skye",
            "url": "https://media.valorant-api.com/agents/6f2a04ca-43e0-be17-7f36-b3908627744d/displayicon.png"
            }
        },
        {
            "name": "rohan warghade#4603",
            "puuid": "232b3ae1-7f35-5501-936f-8e1e2f9e6009",
            "rankRating": 54,
            "rank": 12,
            "rankName": "GOLD 1",
            "team": "Red",
            "charater": {
            "agentID": "bb2a4828-46eb-8cd1-e765-15848195d751",
            "agentName": "Neon",
            "url": "https://media.valorant-api.com/agents/bb2a4828-46eb-8cd1-e765-15848195d751/displayicon.png"
            }
        },
        {
            "name": "Haram#2209",
            "puuid": "a2f9f0f9-6cc7-5ef0-8cde-7e9515340122",
            "rankRating": 0,
            "rank": 19,
            "rankName": "DIAMOND 2",
            "team": "Red",
            "charater": {
            "agentID": "eb93336a-449b-9c1b-0a54-a891f7921d69",
            "agentName": "Phoenix",
            "url": "https://media.valorant-api.com/agents/eb93336a-449b-9c1b-0a54-a891f7921d69/displayicon.png"
            }
        },
        {
            "name": "RW SlAY3Riwni#3271",
            "puuid": "c85b673b-822a-5340-9f4e-eb4efd176dc1",
            "rankRating": 40,
            "rank": 18,
            "rankName": "DIAMOND 1",
            "team": "Red",
            "charater": {
            "agentID": "7f94d92c-4234-0a36-9646-3a87eb8b5c89",
            "agentName": "Yoru",
            "url": "https://media.valorant-api.com/agents/7f94d92c-4234-0a36-9646-3a87eb8b5c89/displayicon.png"
            }
        }
    ];
    
    import MatchPlayerRow from "./MatchPlayerRow.svelte";
    import { onMount } from 'svelte';
    
    let players = [];
	onMount(async () => {
		fetch('http://localhost:3000/match/currentRanks')
		.then((x) => x.json())
		.then(res => {
			console.log(res)
			players = res
		});
	});
</script>

<div class="grid grid-cols-2">
    <div class="px-5 py-5">
        <h1 class="text-xl font-poppins">Your Team</h1>
        <div class="grid gap-y-10 py-0">
            {#each players as player}
                {#if player.team.toLowerCase() == "blue"}
                    <MatchPlayerRow name={player.name} characterName={player.charater.agentName} 
                        rank={player.rankName} url={player.charater.url} team={player.team}/>
                {/if}
            {/each}
        </div>
    </div>

    <div class="px-5 py-5">
        <h1 class="font-bold text-xl">Enemy Team</h1>
        <div class="grid gap-y-10 py-0">
            {#each players as player}
                {#if player.team.toLowerCase() == "red"}
                    <MatchPlayerRow name={player.name} characterName={player.charater.agentName} 
                        rank={player.rankName} url={player.charater.url} team={player.team}/>
                {/if}
            {/each}
        </div>
    </div>

</div>
<!--<span class="hidden bg-blue-500 bg-red-500"></span>-->