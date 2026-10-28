export type RegistrationTransition =
	| 'request-options'
	| 'generate-options'
	| 'return-options'
	| 'create-credential'
	| 'request-creation'
	| 'generate-key-pair'
	| 'return-public-key'
	| 'return-credential'
	| 'verify-registration'
	| 'registration-complete';

export type RegistrationTransitionExample = {
	transition: RegistrationTransition;
	codeSnippet?: string;
	highlightedLines?: string;
};
