import type {
	DemoPasskeyCredential,
	DemoUserRow,
	MfaDemoDataRow,
	PasskeyMfaDemoDataRow,
	PasskeyOnlyDemoDataRow,
	PasswordDemoDataRow
} from './models';

// Public teaching fixtures, independent of the local database and authentication state.
export const exampleUser: DemoUserRow = {
	user_id: 'example-account-id',
	username: 'alice',
	firstname: 'Alice',
	lastname: 'Martin'
};

export const examplePasswordData = {
	...exampleUser,
	// A real Argon2id hash of Bonjour1, including its original salt and costs.
	password_hash:
		'$argon2id$v=19$m=65536,t=2,p=1$rmfVEGRoYyu2Bp4GK0+5K0wxTw8ElLbR04PIcJQwbuc$G/TBi13GlNBEfWOYRt0qJ/LdC/sPLhDFHxYmvoTxoYA'
} satisfies PasswordDemoDataRow;

export const exampleMfaData = {
	...examplePasswordData,
	// AES-GCM envelope (IV, tag, ciphertext) in the same Base64 format as the API.
	totp_secret: 'H/YNKYfTTh2k/GgHDKv7vTyObPbidMUJRy04Vei3TaI5/EV5GlFXleR/amSVwFxz67FIhqtPj7Ky26av',
	totp_last_used_counter: 59772000
} satisfies MfaDemoDataRow;

// Same credential ID and key as the default registration ceremony example.
export const exampleComputerCredential: DemoPasskeyCredential = {
	id: 'bj0CntVC0BSfv672WTQWHLS6RCvhOpzWY3Mdiirr_zw',
	label: 'Ordinateur',
	// Stored COSE public key, encoded as Base64 (the ceremony's publicKey is SPKI).
	public_key:
		'pQECAyYgASFYIIO2NrEC7zgKTgTVmehES+Ip7CdN/i6tFMJkpykeFJG1IlggqnOrAor8HTA3KrzCfY9eOZO90Fl2ofrH4XzwhLXJ1IY=',
	counter: 1,
	transports: '["internal"]'
};

export const examplePasskeyMfaData = {
	...exampleMfaData,
	passkeys_credentials: [exampleComputerCredential]
} satisfies PasskeyMfaDemoDataRow;

export const examplePasskeyOnlyData = {
	...exampleUser,
	passkeys_credentials: [
		exampleComputerCredential,
		{
			id: 'ZXhhbXBsZS1waG9uZS1jcmVkZW50aWFs',
			label: 'Téléphone',
			public_key:
				'pQECAyYgASFYID1RbRdC36yerfcUj5gR96G+2OGE8RFLbh7Dp6Wo8I7JIlggFFuH096j4AjUvWN5zqg3o/mfxtlK12Va9AnNZrzJIXk=',
			counter: 0,
			transports: '["hybrid","internal"]'
		}
	]
} satisfies PasskeyOnlyDemoDataRow;
