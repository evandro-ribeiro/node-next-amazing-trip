"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connection = void 0;
const mysql2_1 = __importDefault(require("mysql2"));
exports.connection = mysql2_1.default.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'root',
    database: process.env.DB_NAME || 'taxi',
    port: Number(process.env.DB_PORT) || 3306
});
exports.connection.connect((err) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err.message);
        process.exit(1);
    }
    else {
        console.log('Conexão com o banco de dados bem-sucedida!');
    }
});
