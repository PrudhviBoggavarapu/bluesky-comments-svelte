<!-- src/lib/components/BlueskyPostThread.svelte -->
<script lang="ts">
	// ... (script content remains the same) ...
	import { onMount } from 'svelte';
	import { getPostDataFromHttpsUrl } from '$lib/api_stuff.js';
	import { AtpAgent, AppBskyFeedDefs } from '@atproto/api';
	import LoadingIndicator from './primitive/LoadingIndicator.svelte';
	import ErrorDisplay from './primitive/ErrorDisplay.svelte';
	import ThreadView from './ThreadView.svelte';
	import type { ReplyUnion } from '$lib/types.js';

	export let postUrl: string;
	export let agent: AtpAgent | null = null;
	export let service: string = 'https://public.api.bsky.app';

	let postDataPromise: Promise<AppBskyFeedDefs.ThreadViewPost> | null = null;
	let currentAgent: AtpAgent;
	let previousPostUrl: string | null = null;
	let previousService: string | null = null;
	let previousAgent: AtpAgent | null = null;

	function fetchData() {
		if (postUrl && currentAgent) {
			postDataPromise = getPostDataFromHttpsUrl(postUrl, { agent: currentAgent });
			previousPostUrl = postUrl;
			previousService = service;
			previousAgent = agent;
		} else {
			postDataPromise = null;
		}
	}

	onMount(() => {
		if (agent) {
			currentAgent = agent;
		} else {
			currentAgent = new AtpAgent({ service });
		}
		previousService = service;
		previousAgent = agent;
		fetchData();
	});

	$: {
		if (currentAgent) {
			let needsRefetch = false;
			if (agent && agent !== previousAgent) {
				currentAgent = agent;
				needsRefetch = true;
			} else if (!agent && service !== previousService) {
				currentAgent = new AtpAgent({ service });
				needsRefetch = true;
			}
			if (postUrl !== previousPostUrl) {
				needsRefetch = true;
			}
			if (needsRefetch) {
				fetchData();
			}
		}
	}

	const isThreadViewPost = AppBskyFeedDefs.isThreadViewPost;
	const isNotFoundPost = AppBskyFeedDefs.isNotFoundPost;
	const isBlockedPost = AppBskyFeedDefs.isBlockedPost;

	function getReplyKey(reply: ReplyUnion): string {
		const typedReply = reply as ReplyUnion;
		if (isThreadViewPost(typedReply)) {
			return typedReply.post.uri;
		} else if (isNotFoundPost(typedReply) || isBlockedPost(typedReply)) {
			return typedReply.uri;
		}
		console.warn('Unknown reply type encountered for key generation:', reply);
		return Math.random().toString();
	}
</script>

<!-- *** STYLE CHANGE: Removed border, adjusted padding/margin *** -->
<div
	class="mx-auto my-6 max-w-2xl rounded-lg bg-white p-4 font-sans text-gray-900 shadow-sm sm:p-6 dark:bg-gray-800 dark:text-gray-100"
>
	{#if !postUrl}
		<p class="text-center text-gray-500 dark:text-gray-400">Please provide a postUrl prop.</p>
	{:else if !postDataPromise}
		<LoadingIndicator />
	{:else}
		{#await postDataPromise}
			<LoadingIndicator />
		{:then post_data}
			{#if post_data}
				<ThreadView thread={post_data} {getReplyKey} />
			{:else}
				<p class="text-center text-gray-600 dark:text-gray-400">Post data loaded but was empty.</p>
			{/if}
		{:catch error}
			<ErrorDisplay {error} />
		{/await}
	{/if}
</div>
