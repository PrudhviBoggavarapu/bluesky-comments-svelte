<!-- src/lib/components/ReplyItem.svelte -->
<script lang="ts">
	import { AppBskyFeedDefs } from '@atproto/api';
	// *** Import ReplyList for recursion ***
	import ReplyList from './ReplyList.svelte';
	import PostCard from './PostCard.svelte';
	import NotFoundPlaceholder from './primitive/NotFoundPlaceholder.svelte';
	import BlockedPlaceholder from './primitive/BlockedPlaceholder.svelte';
	import type { ReplyUnion } from '$lib/types.ts';

	export let reply: ReplyUnion;
	// *** Accept getReplyKey function as a prop ***
	export let getReplyKey: (reply: ReplyUnion) => string;

	const isThreadViewPost = AppBskyFeedDefs.isThreadViewPost;
	const isNotFoundPost = AppBskyFeedDefs.isNotFoundPost;
	const isBlockedPost = AppBskyFeedDefs.isBlockedPost;

	let hasNestedReplies: boolean = false;
	// No need for nestedReplyCount variable anymore

	$: {
		if (isThreadViewPost(reply)) {
			hasNestedReplies = !!(reply.replies && reply.replies.length > 0);
		} else {
			hasNestedReplies = false;
		}
	}
</script>

<!-- No changes needed to the li element itself -->
<li class="">
	{#if isThreadViewPost(reply)}
		<!-- Render the current reply's post card -->
		<PostCard postView={reply.post} size="small" />

		<!-- *** Render nested replies underneath if they exist *** -->
		{#if hasNestedReplies}
			<!-- Add indentation and optional threading line -->
			<div class="mt-4 ml-5 border-l-2 border-gray-200 pl-4 dark:border-gray-600">
				<!-- Render ReplyList recursively -->
				<!-- Pass down the replies array and the key function -->
				<ReplyList replies={reply.replies as ReplyUnion[] | undefined} {getReplyKey} />
			</div>
		{/if}
	{:else if isNotFoundPost(reply)}
		<div class="py-2">
			<NotFoundPlaceholder uri={reply.uri} />
		</div>
	{:else if isBlockedPost(reply)}
		<div class="py-2">
			<BlockedPlaceholder uri={reply.uri} />
		</div>
	{:else}
		<div class="py-2">
			<p class="text-sm text-gray-500 italic dark:text-gray-400">[Unknown reply type]</p>
		</div>
	{/if}
</li>
