<script lang="ts">
	import type { PasskeyAuthenticationExchange } from '#lib/demo/logic/passkey-client.js';
	import AuthenticationFlow from './common/AuthenticationFlow.svelte';
	import type { AuthenticationTransitionExample } from './common/authentication-transition';
	import {
		formatAuthenticationOptions,
		formatAuthenticationResponse
	} from './common/passkey-templates';
	import authenticationOptions from './code/authentication-options.ts?raw';
	import authenticationGet from './code/authentication-get.ts?raw';
	import authenticationVerify from './code/authentication-verify.ts?raw';

	let { exchange }: { exchange?: PasskeyAuthenticationExchange } = $props();

	const transitions = $derived([
		{ transition: 'request-options' },
		{
			transition: 'generate-options',
			codeSnippet: authenticationOptions,
			highlightedLines: '|1,9,13|10-12|14'
		},
		{
			transition: 'return-options',
			codeSnippet: formatAuthenticationOptions(exchange?.options),
			highlightedLines: '|2|3|4|5'
		},
		{
			transition: 'get-credential',
			codeSnippet: authenticationGet,
			highlightedLines: '|4|5'
		},
		{ transition: 'request-signature' },
		{ transition: 'sign-challenge' },
		{ transition: 'return-signature', codeSnippet: authenticationGet, highlightedLines: '5|11' },
		{
			transition: 'return-credential',
			codeSnippet: formatAuthenticationResponse(exchange?.response),
			highlightedLines: '|2-5|7|9'
		},
		{
			transition: 'verify-authentication',
			codeSnippet: authenticationVerify,
			highlightedLines: '|2,11,18|12-17|20'
		},
		{ transition: 'authentication-complete' }
	] satisfies AuthenticationTransitionExample[]);
</script>

<AuthenticationFlow {transitions} />
