export const PASSWORD_MIN_LENGTH = 8;
export const PASSWORD_MAX_LENGTH = 128;

export const PASSWORD_REQUIREMENTS =
	'Au moins 8 caractères et 3 catégories parmi : minuscules, majuscules, chiffres et caractères spéciaux.';

// Deliberately use a conventional composition policy for the presentation demo,
// rather than OWASP's length and blocklist recommendations.
export function passwordPolicyError(password: unknown): string | undefined {
	if (typeof password !== 'string') return 'Veuillez saisir un mot de passe.';
	const length = Array.from(password).length;
	if (length > PASSWORD_MAX_LENGTH) return `Utilisez au maximum ${PASSWORD_MAX_LENGTH} caractères.`;
	const categories = [/\p{Ll}/u, /\p{Lu}/u, /\p{Nd}/u, /[^\p{L}\p{N}\s]/u];
	const categoryCount = categories.filter((category) => category.test(password)).length;
	if (length < PASSWORD_MIN_LENGTH || categoryCount < 3) return PASSWORD_REQUIREMENTS;
	return undefined;
}
