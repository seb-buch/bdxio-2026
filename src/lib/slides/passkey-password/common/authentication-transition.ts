export type AuthenticationTransition =
	| 'request-options'
	| 'generate-options'
	| 'return-options'
	| 'get-credential'
	| 'request-signature'
	| 'sign-challenge'
	| 'return-signature'
	| 'return-credential'
	| 'verify-authentication'
	| 'authentication-complete';

export type AuthenticationTransitionExample = {
	transition: AuthenticationTransition;
	codeSnippet?: string;
	highlightedLines?: string;
};
