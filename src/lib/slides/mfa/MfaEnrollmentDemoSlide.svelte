<script lang="ts">
	import { Slide, SpeakerNotes } from '@seb-buch/slyd';
	import DemoMfaApplication from '#lib/demo/components/DemoMfaApplication.svelte';
	import type { MfaAuthenticationState } from '#lib/demo/logic/mfa-flow.js';
	let { authenticationState = $bindable() }: { authenticationState: MfaAuthenticationState } =
		$props();
</script>

<Slide>
	<h3>MFA &ndash; Activer le deuxième facteur</h3>
	<DemoMfaApplication bind:authenticationState />
	<SpeakerNotes>
		<p>
			Je reprends le compte que nous venons de créer. Pas de nouvelle inscription : on ajoute une
			protection à un compte existant. [Se connecter avec le mot de passe.]
		</p>
		<p>
			Dans les paramètres de sécurité, j’active la double authentification. [Cliquer, puis scanner
			le QR code.] Mon application ajoute le compte et commence à afficher des codes. Je saisis le
			code qu’elle affiche pour confirmer que la configuration fonctionne.
		</p>
		<p>
			[Confirmer.] La double authentification est activée. Le QR code n’était donc pas simplement un
			lien : il a transmis de quoi produire les futurs codes. Regardons ce qui vient de se passer.
		</p>
		<p>
			[Si la MFA est déjà activée.] Ce compte est déjà configuré : on peut passer au schéma, puis à
			la connexion. Pour refaire le scan, utiliser un nouveau compte créé dans la démo mot de passe.
		</p>
	</SpeakerNotes>
</Slide>
