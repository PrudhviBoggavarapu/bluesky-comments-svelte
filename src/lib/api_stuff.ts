// src/lib/api_stuff.ts
import { AtpAgent, BskyAgent, AppBskyFeedDefs } from "@atproto/api";

// Internal helper function - not exported
async function convertHttpsUrlToAtUri(
    url: string,
    agent: BskyAgent, // Use BskyAgent type which AtpAgent extends
): Promise<string> {
    // Throws specific errors on failure
    try {
        const parsedUrl = new URL(url);
        const pathSegments = parsedUrl.pathname.split("/").filter(Boolean);

        if (
            pathSegments.length !== 4 ||
            pathSegments[0] !== "profile" ||
            pathSegments[2] !== "post"
        ) {
            throw new Error(
                `Invalid Bluesky URL format. Expected '/profile/{handle_or_did}/post/{rkey}', got: ${parsedUrl.pathname}`,
            );
        }

        const identifier = pathSegments[1];
        const rkey = pathSegments[3];
        let did = "";

        if (identifier.startsWith("did:")) {
            did = identifier;
        } else {
            // console.log(`Identifier "${identifier}" is not a DID, resolving handle...`);
            try {
                const response = await agent.resolveHandle({ handle: identifier });
                did = response.data.did;
                // console.log(`Resolved handle "${identifier}" to DID: ${did}`);
            } catch (resolveError: any) {
                // Throw a more specific error for the UI
                throw new Error(
                    `Failed to resolve handle "${identifier}": ${resolveError?.message || "Unknown error"
                    }`,
                );
            }
        }
        return `at://${did}/app.bsky.feed.post/${rkey}`;
    } catch (error: any) {
        // Catch URL parsing errors or re-throw others
        if (error instanceof TypeError && error.message.includes("Invalid URL")) {
            throw new Error(`Invalid URL provided: ${url}`);
        }
        // Re-throw specific errors from above or other unexpected ones
        throw error;
    }
}

interface GetPostOptions {
    agent?: BskyAgent; // Allow passing a pre-configured agent
    service?: string; // Allow specifying service URL if no agent passed
}

/**
 * Fetches the thread data for a given Bluesky post HTTPS URL.
 * Uses a provided agent or creates one for the specified service.
 *
 * @param postUrl The HTTPS URL of the post (e.g., "https://bsky.app/profile/...")
 * @param options Optional configuration with agent or service URL.
 * @returns A Promise that resolves to the ThreadViewPost data.
 * @throws Throws specific errors on failure (URL format, handle resolution, post not found, fetch errors).
 */
export async function getPostDataFromHttpsUrl(
    postUrl: string,
    options: GetPostOptions = {},
): Promise<AppBskyFeedDefs.ThreadViewPost> {
    // Determine which agent to use
    const agentToUse =
        options.agent ||
        new AtpAgent({ service: options.service || "https://public.api.bsky.app" });

    let postUri: string;
    try {
        // 1. Convert the HTTPS URL to an AT URI (can throw)
        postUri = await convertHttpsUrlToAtUri(postUrl, agentToUse);
        // console.log(`Converted URL to AT URI: ${postUri}`);
    } catch (conversionError) {
        // Forward conversion/resolution errors
        throw conversionError;
    }

    // 2. Fetch the post thread using the AT URI
    try {
        const response = await agentToUse.getPostThread({ uri: postUri });

        if (
            response?.data?.thread &&
            AppBskyFeedDefs.isThreadViewPost(response.data.thread)
        ) {
            // Success! Return the thread data
            return response.data.thread;
        } else {
            // Should ideally be caught by the catch block, but handle unexpected structure
            console.warn(`Could not parse thread structure for URI: ${postUri}`);
            throw new Error(`Invalid thread data received for ${postUri}`);
        }
    } catch (error: any) {
        // Handle API errors
        if (error?.message?.includes("PostNotFound")) {
            // console.log(`Post not found via API for URI: ${postUri}`);
            // Throw a specific error for the UI
            throw new Error(`Post not found: ${postUri}`);
        } else {
            console.error(`Error fetching post thread for ${postUri}:`, error);
            // Re-throw other fetch errors
            throw new Error(
                `API error fetching post ${postUri}: ${error?.message || "Unknown error"
                }`,
            );
        }
    }
}
