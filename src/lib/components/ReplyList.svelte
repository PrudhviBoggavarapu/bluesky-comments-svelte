<!-- src/lib/components/ReplyList.svelte -->
<script lang="ts">
	// *** Import ReplyItem directly for clarity ***
	import ReplyItem from './ReplyItem.svelte';
	import type { ReplyUnion } from '$lib/types.ts';

	export let replies: ReplyUnion[] | undefined | null;
	export let getReplyKey: (reply: ReplyUnion) => string;
</script>

<!-- *** STYLE CHANGE: Reduced space-y slightly for nested look *** -->
<div class="replies-section">
	<!-- Only show heading for the top-level list, maybe? Or remove heading entirely? -->
	<!-- For now, keeping the heading logic as is, but adjusting spacing -->
	{#if replies && replies.length > 0}
		<!-- Reduced space-y for potentially nested lists -->
		<ul class="list-none space-y-4 p-0">
			{#each replies as reply (getReplyKey(reply))}
				<!-- *** Pass getReplyKey down to ReplyItem *** -->
				<ReplyItem {reply} {getReplyKey} />
			{/each}
		</ul>
	{:else}
		<!-- Don't show "No replies yet" if it's a nested list that's empty -->
		<!-- This logic might need refinement depending on desired behavior -->
		<!-- <p class="text-gray-500 dark:text-gray-400">No replies yet.</p> -->
	{/if}
</div>
