export async function createSerializedPasskeyFromRaw(
	raw: PublicKeyCredentialCreationOptionsJSON
): Promise<RegistrationResponseJSON> {
	const options: PublicKeyCredentialCreationOptions =
		PublicKeyCredential.parseCreationOptionsFromJSON(raw); // Baseline 2025; May throw!

	// @ts-expect-error: see https://github.com/microsoft/TypeScript-DOM-lib-generator/pull/1742
	const credential: PublicKeyCredential | null = await navigator.credentials.create({
		publicKey: options
	}); // Baseline 2021; May throw!

	if (!credential) {
		throw new Error('Failed to create passkey');
	}

	// @ts-expect-error: bad type inference
	return credential.toJSON(); // Baseline 2025; May throw!
}
