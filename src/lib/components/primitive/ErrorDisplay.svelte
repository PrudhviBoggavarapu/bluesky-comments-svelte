<script lang="ts">
	export let error: unknown; // Accept unknown error type

	let errorMessage: string = 'An unknown error occurred.';
	let errorDetails: string | null = null;
	let hints: string[] = [];

	// Process the error object to extract useful info
	if (error instanceof Error) {
		errorMessage = error.message;
		// Add specific hints based on common error messages
		if (errorMessage.includes('Invalid Bluesky URL format')) {
			hints.push("Hint: Check if the URL looks like 'https://bsky.app/profile/handle/post/id'.");
		} else if (errorMessage.includes('Failed to resolve handle')) {
			hints.push("Hint: The user handle in the URL might be incorrect or the user doesn't exist.");
		} else if (errorMessage.includes('Post not found')) {
			hints.push(
				'Hint: The post may have been deleted, the URL might be wrong, or the API is temporarily unavailable.'
			);
		} else if (errorMessage.includes('Invalid URL provided')) {
			hints.push('Hint: The URL seems malformed.');
		} else if (errorMessage.includes('API error fetching post')) {
			hints.push('Hint: There was a problem communicating with the Bluesky API.');
		}
	} else {
		// Try to stringify non-Error objects for debugging
		try {
			errorDetails = JSON.stringify(error, null, 2);
		} catch {
			errorDetails = '[Could not stringify error object]';
		}
	}
</script>

<div
	class="relative rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700 dark:border-red-700 dark:bg-red-900 dark:text-red-200"
	role="alert"
>
	<strong class="font-bold">Error loading post data:</strong>
	<span class="ml-2 block sm:inline">{errorMessage}</span>

	{#if hints.length > 0}
		{#each hints as hint}
			<p class="mt-1 text-sm">{hint}</p>
		{/each}
	{/if}

	{#if errorDetails}
		<pre
			class="mt-2 overflow-x-auto rounded bg-red-50 p-2 text-xs dark:bg-red-800">{errorDetails}</pre>
	{/if}
</div>
