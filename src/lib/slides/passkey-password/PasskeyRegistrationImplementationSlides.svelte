<script lang="ts">
	import type { PasskeyRegistrationExchange } from '#lib/demo/logic/passkey-client.js';
	import RegistrationFlow from './common/RegistrationFlow.svelte';
	import type { RegistrationTransitionExample } from './common/registration-transition';
	import {
		formatRegistrationOptions,
		formatRegistrationResponse
	} from './common/passkey-templates';
	import registrationOptions from './code/registration-options.ts?raw';
	import registrationCreate from './code/registration-create.ts?raw';
	import registrationVerify from './code/registration-verify.ts?raw';

	let { exchange }: { exchange?: PasskeyRegistrationExchange } = $props();

	const transitions = $derived([
		{ transition: 'request-options' },
		{
			transition: 'generate-options',
			codeSnippet: registrationOptions,
			highlightedLines: '|3,5,11,23|12,13|14-17|18-22|24'
		},
		{
			transition: 'return-options',
			codeSnippet: formatRegistrationOptions(exchange?.options),
			highlightedLines: '|2|3|4-8|9|10-15|16-21|22'
		},
		{
			transition: 'create-credential',
			codeSnippet: registrationCreate,
			highlightedLines: '|4,5|8-10'
		},
		{ transition: 'request-creation' },
		{ transition: 'generate-key-pair' },
		{
			transition: 'return-public-key',
			codeSnippet: registrationCreate,
			highlightedLines: '8-10|17'
		},
		{
			transition: 'return-credential',
			codeSnippet: formatRegistrationResponse(exchange?.response),
			highlightedLines: '|2-5|7|10-12'
		},
		{
			transition: 'verify-registration',
			codeSnippet: registrationVerify,
			highlightedLines: '|2,11,17|12-16|22'
		},
		{ transition: 'registration-complete' }
	] satisfies RegistrationTransitionExample[]);
</script>

<RegistrationFlow {transitions} />
