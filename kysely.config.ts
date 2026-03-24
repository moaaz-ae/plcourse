import { defineConfig } from 'kysely-ctl';
import { PostgresDialect } from 'kysely';
import { Pool } from 'pg';
import { getDatabaseConnectionString } from './src/lib/server/db/config';

const connectionString = getDatabaseConnectionString(process.env);

export default defineConfig({
	dialect: new PostgresDialect({
		pool: new Pool({ connectionString })
	}),
	migrations: {
		migrationFolder: 'migrations'
	}
});
