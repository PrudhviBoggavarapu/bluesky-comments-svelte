// src/lib/types.ts
import type { AppBskyFeedDefs } from '@atproto/api';

/**
 * Represents the possible types for a reply item in a thread view.
 */
export type ReplyUnion =
    | AppBskyFeedDefs.ThreadViewPost
    | AppBskyFeedDefs.NotFoundPost
    | AppBskyFeedDefs.BlockedPost;

// Add any other shared types here in the future
