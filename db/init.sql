SELECT 'CREATE DATABASE plcourse_db'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'plcourse_db')\gexec

SELECT 'CREATE DATABASE umami_db'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'umami_db')\gexec
