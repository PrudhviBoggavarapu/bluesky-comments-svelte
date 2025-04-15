<!-- src/lib/components/ThreadView.svelte -->
<script lang="ts">
	import { AppBskyFeedDefs } from '@atproto/api';
	import PostCard from './PostCard.svelte';
	import ReplyList from './ReplyList.svelte';
	import type { ReplyUnion } from '$lib/types.js';

	export let thread: AppBskyFeedDefs.ThreadViewPost;
	export let getReplyKey: (reply: ReplyUnion) => string;

	const isPostView = AppBskyFeedDefs.isPostView;
</script>

<div>
	<!-- Replies Section -->
	<ReplyList replies={thread.replies as ReplyUnion[] | undefined} {getReplyKey} />
</div>
