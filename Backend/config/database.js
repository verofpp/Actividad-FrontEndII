import mysql from "mysql2/promise"
import "dotenv/config"

const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_NAME
}
)

export default connection