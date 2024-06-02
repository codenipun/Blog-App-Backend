import mysql from 'mysql2'
import dotenv from 'dotenv'

dotenv.config();

export const db =  mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database : process.env.DB_DBNAME,
    port: process.env.DB_PORT
    // host: 'localhost',
    // user: 'root',
    // password: '123456',
    // database : "blog",
    // port: "3307"
})