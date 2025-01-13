// dbService.js
async function checkDbConnection(pool) {
  try {
    const client = await pool.connect();
    await client.query("SELECT 1");
    client.release(); // Release client back to the pool
    console.log("Database connection is healthy");
    return true;
  } catch (err) {
    console.error("Database connection error:", err.message);
    return false;
  }
}

module.exports = {
  checkDbConnection,
};
