# Svelte Bluesky Thread Viewer

A reusable Svelte component library to fetch and display Bluesky post threads, including replies, directly from a post's HTTPS URL. Built with SvelteKit, TypeScript, `@atproto/api`, and styled with Tailwind CSS.

## Features

- Fetches Bluesky post thread data using only the standard post URL (e.g., `https://bsky.app/profile/user.bsky.social/post/xxxxxxxxxxxxx`).
- Handles handle resolution (converting handles to DIDs).
- Displays the main post and its replies in a nested, comment-section style.
- Handles loading and error states gracefully.
- Provides both a main all-in-one component and individual primitive components for custom layouts.
- Includes underlying API fetching logic that can be used independently in non-Svelte projects.
- Styled with Tailwind CSS (requires Tailwind setup in the consuming project).

## Installation

```bash
npm install your-package-name @atproto/api
# or
yarn add your-package-name @atproto/api
# or
pnpm add your-package-name @atproto/api
```

_(Replace `your-package-name` with the actual name you publish this library under on npm)_

**Peer Dependencies:**

This library relies on `@atproto/api`. You also need `tailwindcss` set up in your project for the default styling to work correctly.

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

Follow the [Tailwind CSS SvelteKit installation guide](https://tailwindcss.com/docs/guides/sveltekit) if you haven't already set it up.

## Basic Usage (Svelte/SvelteKit)

Import the main component and provide the `postUrl` prop.

```svelte
<script lang="ts">
	// If using locally within the same project:
	// import BlueskyPostThread from '$lib'; // Or '$lib/components/BlueskyPostThread.svelte'

	// If installed as a package:
	import BlueskyPostThread from 'your-package-name';

	const blueskyUrl = 'https://bsky.app/profile/jay.bsky.social/post/3klp4w2ik4v2q';
</script>

<div class="container mx-auto p-4">
	<h1 class="mb-4 text-2xl font-bold">Bluesky Thread</h1>
	<BlueskyPostThread postUrl={blueskyUrl} />
</div>
```

## Component API (`BlueskyPostThread`)

The main component accepts the following props:

| Prop      | Type                 | Default                         | Description                                                                                        |
| :-------- | :------------------- | :------------------------------ | :------------------------------------------------------------------------------------------------- |
| `postUrl` | `string`             | **Required**                    | The full HTTPS URL of the Bluesky post (e.g., `https://bsky.app/profile/handle/post/rkey`).        |
| `agent`   | `AtpAgent` \| `null` | `null`                          | An optional, pre-configured `@atproto/api` agent instance. If provided, `service` prop is ignored. |
| `service` | `string`             | `'https://public.api.bsky.app'` | The Bluesky PDS endpoint to use if no `agent` is provided.                                         |

## Using Primitive Components (Svelte/SvelteKit)

For more control over layout and styling, you can import and use the individual components:

```typescript
// src/lib/index.ts (or your package entry point) exports these:
import BlueskyPostThread from './components/BlueskyPostThread.svelte'; // Default

export { default as ThreadView } from './components/ThreadView.svelte';
export { default as PostCard } from './components/PostCard.svelte';
export { default as ReplyList } from './components/ReplyList.svelte';
export { default as ReplyItem } from './components/ReplyItem.svelte';
export { default as LoadingIndicator } from './components/primitive/LoadingIndicator.svelte';
export { default as ErrorDisplay } from './components/primitive/ErrorDisplay.svelte';
export { default as NotFoundPlaceholder } from './components/primitive/NotFoundPlaceholder.svelte';
export { default as BlockedPlaceholder } from './components/primitive/BlockedPlaceholder.svelte';
export { getPostDataFromHttpsUrl } from './api_stuff';
export type { ReplyUnion } from './types';
```

**Example (Conceptual):**

```svelte
<script lang="ts">
	import { PostCard, LoadingIndicator, ErrorDisplay } from 'your-package-name';
	import { getPostDataFromHttpsUrl } from 'your-package-name';
	import { onMount } from 'svelte';
	import type { AppBskyFeedDefs } from '@atproto/api';

	let postViewPromise: Promise<AppBskyFeedDefs.PostView | null>; // Example: Fetch only the main post view

	// Simplified fetch logic for example purposes
	onMount(async () => {
		// You would need more robust logic here similar to the main component
		try {
			const thread = await getPostDataFromHttpsUrl('some-url');
			postViewPromise = Promise.resolve(thread?.post ?? null);
		} catch (err) {
			postViewPromise = Promise.reject(err);
		}
	});
</script>

{#if postViewPromise}
	{#await postViewPromise}
		<LoadingIndicator />
	{:then postView}
		{#if postView}
			<div class="my-custom-wrapper bg-blue-100 p-5">
				<PostCard {postView} size="large" />
			</div>
		{:else}
			<p>Post not found.</p>
		{/if}
	{:catch error}
		<ErrorDisplay {error} />
	{/await}
{/if}
```

Refer to the source code of `BlueskyPostThread.svelte` and `ThreadView.svelte` to see how the primitives are composed.

## Usage Without Svelte (JavaScript/TypeScript)

You can use the underlying data-fetching logic in any JavaScript or TypeScript project (Node.js, React, Vue, Vanilla JS, etc.). You will need to handle the rendering yourself.

1.  **Install the core dependency:**

    ```bash
    npm install @atproto/api
    # or yarn add / pnpm add
    ```

2.  **Copy or Adapt the API Logic:**
    Take the `src/lib/api_stuff.ts` file from this library (or install the library and import the function if using Node.js/bundler). Ensure you have the necessary types (like `ReplyUnion` from `src/lib/types.ts` if needed).

3.  **Use the `getPostDataFromHttpsUrl` function:**

    ```typescript
    // Example in a generic async context (e.g., Node.js script, framework component method)

    // If installed as a package and exported:
    // import { getPostDataFromHttpsUrl } from 'your-package-name';

    // Or if you copied the file:
    import { getPostDataFromHttpsUrl } from './path/to/api_stuff'; // Adjust path
    import { AppBskyFeedDefs } from '@atproto/api'; // For typing the result and using type guards

    async function displayBlueskyThread(url: string) {
    	console.log(`Fetching thread for: ${url}`);
    	try {
    		// This function handles URL parsing, handle resolution, and fetching
    		const threadData: AppBskyFeedDefs.ThreadViewPost = await getPostDataFromHttpsUrl(url);

    		console.log('Successfully fetched thread data!');

    		// --- Render the data using your framework/UI logic ---
    		// Example: Accessing main post text
    		if (AppBskyFeedDefs.isPostView(threadData.post)) {
    			const record = threadData.post.record as AppBskyFeedDefs.PostRecord; // Type assertion often needed
    			console.log(`Main Post by ${threadData.post.author.handle}: ${record?.text}`);
    		}

    		// Example: Looping through replies
    		if (threadData.replies && threadData.replies.length > 0) {
    			console.log('\nReplies:');
    			threadData.replies.forEach((reply) => {
    				if (AppBskyFeedDefs.isThreadViewPost(reply)) {
    					const postView = reply.post;
    					const record = postView.record as AppBskyFeedDefs.PostRecord;
    					console.log(`- Reply by ${postView.author.handle}: ${record?.text}`);
    					// Recursively render reply.replies if needed
    				} else if (AppBskyFeedDefs.isNotFoundPost(reply)) {
    					console.log(`- [Deleted Reply: ${reply.uri}]`);
    				} else if (AppBskyFeedDefs.isBlockedPost(reply)) {
    					console.log(`- [Blocked Reply: ${reply.uri}]`);
    				}
    			});
    		}
    		// --- End Rendering Logic ---
    	} catch (error) {
    		console.error('Failed to fetch or display Bluesky thread:', error);
    		// Display the error appropriately in your UI
    	}
    }

    // Example call
    displayBlueskyThread('https://bsky.app/profile/jay.bsky.social/post/3klp4w2ik4v2q');
    ```

## Styling

The components are styled using **Tailwind CSS utility classes**. For the components to render correctly, your project must have Tailwind CSS configured, and Tailwind's base styles must be included.

If you don't use Tailwind, you can either:

1.  Install Tailwind and configure it to scan the library's component files in your `tailwind.config.js`.
2.  Fork the library and replace the Tailwind classes with your own CSS (using standard `<style>` blocks, CSS Modules, etc.).
3.  Use the primitive components and apply your own wrapper classes and styles.

## Contributing

Contributions are welcome! Please feel free to open an issue or submit a pull request. (Add more specific contribution guidelines if desired).

## License

[MIT](LICENSE) _(Choose and include an appropriate license file)_
