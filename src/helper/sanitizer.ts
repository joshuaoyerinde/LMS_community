/**
 * Sanitizes a value for use in SQL strings.
 * Note: Prefer parameterized queries over manual sanitization.
 */
export function sanitizeValue(value: unknown): string {
	if (value === null || value === undefined) return "NULL";

	// Convert to string
	let v = String(value);

	// Escape single quotes: O'Reilly -> O''Reilly
	v = v.replace(/'/g, "''");

	// Trim dangerous SQL fragments
	v = v.replace(/;|--|\b(SELECT|INSERT|UPDATE|DELETE|DROP|ALTER|EXEC)\b/gi, "");

	return `'${v}'`;
}

export default sanitizeValue;
