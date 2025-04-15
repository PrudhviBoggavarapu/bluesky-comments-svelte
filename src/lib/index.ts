// src/lib/index.ts

// --- Main Container Component (Default Export) ---
import BlueskyPostThreadComponent from './components/BlueskyPostThread.svelte';
export default BlueskyPostThreadComponent;

// --- Core View Components (Named Exports) ---
export { default as ThreadView } from './components/ThreadView.svelte';
export { default as PostCard } from './components/PostCard.svelte';
export { default as ReplyList } from './components/ReplyList.svelte';
export { default as ReplyItem } from './components/ReplyItem.svelte';

// --- Primitive UI Components (Named Exports) ---
export { default as LoadingIndicator } from './components/primitive/LoadingIndicator.svelte';
export { default as ErrorDisplay } from './components/primitive/ErrorDisplay.svelte';
export { default as NotFoundPlaceholder } from './components/primitive/NotFoundPlaceholder.svelte';
export { default as BlockedPlaceholder } from './components/primitive/BlockedPlaceholder.svelte';

// --- API Utilities (Optional Named Export) ---
export { getPostDataFromHttpsUrl } from '$lib/api_stuff.js';
export { type ReplyUnion } from '$lib/types.js';

