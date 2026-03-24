type EnvValue = string | undefined;

type EnvLike = {
	[key: string]: EnvValue;
};

const REQUIRED_DB_KEYS = [
	'POSTGRES_HOST',
	'POSTGRES_PORT',
	'POSTGRES_USER',
	'POSTGRES_PASSWORD',
	'POSTGRES_DB'
] as const;

interface PostgresConfig {
	host: string;
	port: number;
	user: string;
	password: string;
	database: string;
}

function getPostgresConfig(source: EnvLike): PostgresConfig {
	const missing = REQUIRED_DB_KEYS.filter((key) => !source[key]);
	if (missing.length > 0) {
		throw new Error(`Missing required database environment variables: ${missing.join(', ')}`);
	}

	const port = Number(source.POSTGRES_PORT);
	if (!Number.isInteger(port) || port <= 0) {
		throw new Error('POSTGRES_PORT must be a positive integer');
	}

	return {
		host: source.POSTGRES_HOST as string,
		port,
		user: source.POSTGRES_USER as string,
		password: source.POSTGRES_PASSWORD as string,
		database: source.POSTGRES_DB as string
	};
}

function buildPostgresConnectionString(config: PostgresConfig): string {
	const user = encodeURIComponent(config.user);
	const password = encodeURIComponent(config.password);
	const host = config.host;
	const port = config.port;
	const database = encodeURIComponent(config.database);
	return `postgresql://${user}:${password}@${host}:${port}/${database}`;
}

export function getDatabaseConnectionString(source: EnvLike): string {
	return buildPostgresConnectionString(getPostgresConfig(source));
}
