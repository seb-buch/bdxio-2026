// Only these errors carry messages intended for the demo audience.
export class DemoError extends Error {}

export function demoErrorMessage(cause: unknown, fallback: string): string {
	return cause instanceof DemoError ? cause.message : fallback;
}
