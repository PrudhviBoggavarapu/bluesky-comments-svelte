<!-- src/routes/+page.svelte -->
<script lang="ts">
	// Import the component (assuming it's exported from $lib/index.ts or directly)
	// Adjust the path if necessary, e.g., '$lib/components/BlueskyPostThread.svelte'
	import BlueskyPostThread from '$lib/index.js';

	// The specific URL you provided
	const postUrlToShow = 'https://bsky.app/profile/thethornyrose.bsky.social/post/3lmt4spz4522x';

	// You could also make this dynamic, e.g., using SvelteKit's load function
	// or user input, but for a simple demo, a constant is fine.
</script>

<div class="container mx-auto p-4">
	<h1 class="mb-6 text-center text-2xl font-bold text-gray-800 dark:text-gray-200">
		Bluesky Post Thread Demo
	</h1>

	<p class="mb-4 text-center text-gray-600 dark:text-gray-400">
		Displaying thread for: <a
			href={postUrlToShow}
			target="_blank"
			rel="noopener noreferrer"
			class="break-all text-blue-600 hover:underline dark:text-blue-400">{postUrlToShow}</a
		>
	</p>

	<hr class="my-6 border-gray-300 dark:border-gray-600" />

	<!-- Render the component, passing the URL -->
	<BlueskyPostThread postUrl={postUrlToShow} />
	

</div>

<style>
</style>
