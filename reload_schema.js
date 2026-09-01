const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgresql://postgres.durauidcurykqgdnwagp:$Semangat136@aws-0-ap-northeast-1.pooler.supabase.com:5432/postgres',
  ssl: { rejectUnauthorized: false }
});

async function reload() {
  try {
    await client.connect();
    console.log("Connected to database");
    await client.query("NOTIFY pgrst, 'reload schema';");
    console.log("Schema reloaded successfully.");
  } catch (err) {
    console.error("Error reloading schema:", err);
  } finally {
    await client.end();
  }
}

reload();
