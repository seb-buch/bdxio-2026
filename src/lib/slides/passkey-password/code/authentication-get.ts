export async function getSerializedPasskeyFromRaw(
	raw: PublicKeyCredentialRequestOptionsJSON
): Promise<AuthenticationResponseJSON> {
	const options = PublicKeyCredential.parseRequestOptionsFromJSON(raw); // Baseline 2025; May throw!
	const credential = await navigator.credentials.get({ publicKey: options }); // Baseline 2021; May throw!
	if (!credential) {
		throw new Error('Failed to create passkey');
	}

	// @ts-expect-error: bad type inference
	return credential.toJSON(); // Baseline 2025; May throw!
}
