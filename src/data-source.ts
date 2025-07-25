import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config();


export default new DataSource({
    type: 'postgres',
    host: process.env.DATABASE_HOST,
    port: +(process.env.DATABASE_PORT ?? 5446),
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    entities: ['dist/**/*.entity.js'],
    migrations: ['dist/migrations/*.js'],
});
