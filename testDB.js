import pkg from "pg";
const { Pool } = pkg;
import { envVariables } from "./config/envVariables.js";

const pool = new Pool({
  connectionString: envVariables.DIRECT_URL,
  ssl: { rejectUnauthorized: false },
});

async function testConnection() {
  try {
    const res = await pool.query("SELECT NOW()");
    console.log("✅ Connected to Supabase:", res.rows[0]);
  } catch (err) {
    console.error("❌ Connection error:", err);
  } finally {
    await pool.end();
  }
}

testConnection();
