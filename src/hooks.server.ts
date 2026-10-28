import { building } from '$app/env';
import { initializeServices, Settings } from '#lib/server/services.js';

export const init: () => Promise<void> = async () => {
	// Do not do anything if the app is just building.
	if (building) return;

	const settings = Settings.fromEnv();
	initializeServices(settings);
	console.log('Services initialized');
};
