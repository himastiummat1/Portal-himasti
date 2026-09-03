const { Client } = require("pg");

const connectionString = "postgresql://postgres.fitijhdpptnlslvbfxbl:HimastiUmmat@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres";

async function main() {
  const client = new Client({ connectionString });
  await client.connect();
  console.log("Connected to Supabase PostgreSQL!");

  await client.query(`
    CREATE TABLE IF NOT EXISTS webauthn_credentials (
      id SERIAL PRIMARY KEY,
      user_id BIGINT NOT NULL,
      credential_id VARCHAR(512) UNIQUE NOT NULL,
      public_key TEXT NOT NULL,
      counter BIGINT DEFAULT 0,
      device_type VARCHAR(50),
      backed_up BOOLEAN DEFAULT false,
      transports VARCHAR(255),
      device_name VARCHAR(255),
      aaguid VARCHAR(64),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      last_used_at TIMESTAMP
    );

    CREATE INDEX IF NOT EXISTS idx_webauthn_user_id ON webauthn_credentials(user_id);

    CREATE TABLE IF NOT EXISTS offline_sync_logs (
      id SERIAL PRIMARY KEY,
      batch_id VARCHAR(100) NOT NULL,
      device_id VARCHAR(100),
      total_records INT DEFAULT 0,
      synced_records INT DEFAULT 0,
      status VARCHAR(50) DEFAULT 'success',
      synced_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    ALTER TABLE meeting_attendances ADD COLUMN IF NOT EXISTS verification_method VARCHAR(50) DEFAULT 'standard';
    ALTER TABLE meeting_attendances ADD COLUMN IF NOT EXISTS hardware_proof TEXT;
    ALTER TABLE meeting_attendances ADD COLUMN IF NOT EXISTS device_info VARCHAR(255);
    ALTER TABLE meeting_attendances ADD COLUMN IF NOT EXISTS is_offline_sync BOOLEAN DEFAULT false;
    ALTER TABLE meeting_attendances ADD COLUMN IF NOT EXISTS synced_at TIMESTAMP;

    ALTER TABLE absensis ADD COLUMN IF NOT EXISTS verification_method VARCHAR(50) DEFAULT 'standard';
    ALTER TABLE absensis ADD COLUMN IF NOT EXISTS hardware_proof TEXT;
    ALTER TABLE absensis ADD COLUMN IF NOT EXISTS device_info VARCHAR(255);
    ALTER TABLE absensis ADD COLUMN IF NOT EXISTS is_offline_sync BOOLEAN DEFAULT false;
    ALTER TABLE absensis ADD COLUMN IF NOT EXISTS synced_at TIMESTAMP;
  `);

  console.log("SUCCESS: webauthn_credentials & audit columns created safely without touching existing data!");
  await client.end();
}

main().catch(err => {
  console.error("Migration error:", err);
  process.exit(1);
});
