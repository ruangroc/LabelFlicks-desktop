<script>
    import { videoFrames } from "../stores/labeling";

    $: percentReviewedFrames = calculateFramesReviewed($videoFrames);
    
    function countingFunction(accumulator, currentFrame) {
        if (currentFrame.human_reviewed === true) return accumulator + 1;
        else return accumulator;
    }

    function calculateFramesReviewed(frames) {
        if (!frames) return 0;

        // Count number of frames marked as "human-reviewed"
        // Reduce accepts a callback function and an initial value
        const numReviewed = frames.reduce(countingFunction, 0);
        const numReviewedPercent = 100 * (numReviewed / frames.length);
        return numReviewedPercent;
    }
</script>

<div class="w-full py-1" data-testid="percent-reviewed">
    {#if percentReviewedFrames !== undefined}
        <p>
            {percentReviewedFrames}% of {$videoFrames.length} total frames reviewed
        </p>
    {:else}
        <p>
            Calculating percent of total frames reviewed
        </p>
    {/if}
</div>