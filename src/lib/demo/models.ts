export type User = {
	username: string;
	firstname: string;
	lastname: string;
};

export type UserWithPassword = User & {
	password: string;
};

export type UserSession = {
	id: string;
	user: User;
};

export type DemoUserRow = User & {
	user_id: string;
};

export type PasswordDemoDataRow = DemoUserRow & {
	password_hash?: string;
};

export type MfaDemoDataRow = PasswordDemoDataRow & {
	totp_secret?: string;
	totp_last_used_counter?: number;
};

// SQLite public_key BLOBs are encoded as base64 for display.
export type DemoPasskeyCredential = {
	id: string;
	label: string;
	public_key: string;
	counter: number;
	transports: string;
};

export type PasskeyMfaDemoDataRow = MfaDemoDataRow & {
	passkeys_credentials?: DemoPasskeyCredential[];
};

export type PasskeyOnlyDemoDataRow = DemoUserRow & {
	passkeys_credentials?: DemoPasskeyCredential[];
};

export type DemoDataRow =
	PasswordDemoDataRow | MfaDemoDataRow | PasskeyMfaDemoDataRow | PasskeyOnlyDemoDataRow;

export type PasswordLoginRequest = {
	username: string;
	password: string;
};

export type MfaLoginResponse =
	| { type: 'authenticated'; user: User; mfaEnabled: boolean }
	| { type: 'second-factor'; challengeId: string; username: string };

export type MfaEnrollmentResponse = {
	challengeId: string;
	username: string;
	qrCodeDataUrl: string;
	secret: string;
};

export type MfaVerifyRequest = {
	challengeId: string;
	code: string;
};

export type MfaStatusResponse = {
	mfaEnabled: boolean;
};

export type MeEndpointResponse =
	| {
			type: 'unauthenticated';
	  }
	| {
			type: 'authenticated';
			user: User;
	  };
