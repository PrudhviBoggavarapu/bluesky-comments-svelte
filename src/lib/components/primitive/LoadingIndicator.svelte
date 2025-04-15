<script lang="ts">
	export let message: string = 'Loading post data...';
</script>

<div class="flex items-center justify-center p-4">
	<div class="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-500"></div>
	<p class="ml-3 text-gray-600 dark:text-gray-300">{message}</p>
</div>
