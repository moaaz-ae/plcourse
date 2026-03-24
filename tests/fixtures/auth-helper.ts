import { betterAuth } from 'better-auth';
import { Pool } from 'pg';

function getRequired(name: string): string {
	const value = process.env[name];
	if (!value) {
		throw new Error(`${name} environment variable is not set`);
	}
	return value;
}

function getTestDatabaseUrl(): string {
	const host = getRequired('POSTGRES_HOST');
	const port = getRequired('POSTGRES_PORT');
	const user = getRequired('POSTGRES_USER');
	const password = getRequired('POSTGRES_PASSWORD');
	const database = getRequired('POSTGRES_DB');
	return `postgresql://${encodeURIComponent(user)}:${encodeURIComponent(password)}@${host}:${port}/${encodeURIComponent(database)}`;
}

const TEST_DATABASE_URL = getTestDatabaseUrl();
const TEST_AUTH_SECRET = process.env.BETTER_AUTH_SECRET;
const TEST_APP_URL = process.env.APP_URL || 'http://localhost:4173';

if (!TEST_DATABASE_URL || !TEST_AUTH_SECRET) {
	throw new Error('Missing required test environment variables');
}

const testAuth = betterAuth({
	database: new Pool({
		connectionString: TEST_DATABASE_URL
	}),
	secret: TEST_AUTH_SECRET,
	baseURL: TEST_APP_URL,
	emailAndPassword: {
		enabled: true,
		minPasswordLength: 4
	}
});

export async function createTestUserAndGetCookie(email: string, password: string, name: string) {
	await testAuth.api.signUpEmail({
		body: { email, password, name }
	});

	const response = await testAuth.api.signInEmail({
		body: { email, password },
		asResponse: true
	});

	const setCookieHeader = response.headers.get('set-cookie');
	if (!setCookieHeader) {
		throw new Error('No Set-Cookie header returned from sign-in');
	}

	const tokenMatch = setCookieHeader.match(/better-auth\.session_token=([^;]+)/);
	if (!tokenMatch) {
		throw new Error('Session token not found in cookies');
	}

	const sessionToken = tokenMatch[1];

	return {
		name: 'better-auth.session_token',
		value: sessionToken,
		domain: 'localhost',
		path: '/',
		httpOnly: true,
		secure: false,
		sameSite: 'Lax' as const
	};
}
