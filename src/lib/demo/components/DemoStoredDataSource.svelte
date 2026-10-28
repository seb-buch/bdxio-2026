<script lang="ts">
	let { example, loading, message }: { example: boolean; loading: boolean; message: string } =
		$props();
</script>

<p class="data-source" aria-live="polite">
	{example ? 'Données d’exemple' : 'Données du compte connecté'}
	{#if loading}
		— Chargement des données du compte…{/if}
	{#if message}
		— {message} Les données d’exemple sont affichées.{/if}
</p>

<style>
	.data-source {
		margin: 8px 0 0;
		color: #617087;
		font-size: 18px;
	}
</style>
