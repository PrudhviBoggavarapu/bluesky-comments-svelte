<!-- src/lib/components/PostCard.svelte -->
<script lang="ts">
	import { AppBskyFeedDefs, type AppBskyFeedPost } from '@atproto/api';

	export let postView: AppBskyFeedDefs.PostView;
	export let size: 'large' | 'small' = 'large';

	function isPostRecord(record: unknown): record is AppBskyFeedPost.Record {
		return typeof record === 'object' && record !== null && 'text' in record;
	}

	$: avatarSizeClass = size === 'large' ? 'h-10 w-10' : 'h-8 w-8';
	$: textSizeClass = size === 'large' ? 'text-base' : 'text-sm';
	$: textMutedClass = size === 'large' ? 'text-base' : 'text-sm';
</script>

<div class="flex items-start space-x-3">
	<img
		src={postView.author.avatar}
		alt="Avatar for {postView.author.handle}"
		class="{avatarSizeClass} flex-shrink-0 rounded-full object-cover"
		loading="lazy"
	/>
	<div class="min-w-0 flex-1">
		<p class={textSizeClass}>
			<a
				href={`https://bsky.app/profile/${postView.author.handle}`}
				target="_blank"
				rel="noopener noreferrer"
				class="font-semibold break-words text-blue-600 hover:underline dark:text-blue-400"
			>
				{postView.author.displayName || `@${postView.author.handle}`}
			</a>
			{#if postView.author.displayName}
				<span class="ml-1 break-all text-gray-500 dark:text-gray-400"
					>@{postView.author.handle}</span
				>
			{/if}
		</p>
		{#if isPostRecord(postView.record)}
			<p
				class="mt-1 whitespace-pre-wrap {textMutedClass} break-words text-gray-800 dark:text-gray-200"
			>
				{postView.record.text}
			</p>
		{:else}
			<p class="mt-1 {textMutedClass} text-gray-500 italic dark:text-gray-400">
				[Could not display post content]
			</p>
		{/if}
	</div>
</div>
