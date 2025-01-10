// Function to check database connection health
export async function checkDbConnection() {
  try {
    const client = await pool.connect(); // Attempt to acquire a client
    await client.query("SELECT 1"); // Simple query to test connection
    client.release(); // Release client back to the pool
    console.log("Database connection is healthy");
    return true;
  } catch (err) {
    console.error("Database connection error:", err.message);
    return false;
  }
}
