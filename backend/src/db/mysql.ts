import mysql, { Connection } from 'mysql2';

export const connection: Connection = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'root',
  database: process.env.DB_NAME || 'taxi',
  port: Number(process.env.DB_PORT) || 3306, 
});

connection.connect((err) => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados:', err.message);
    process.exit(1);
  } else {
    console.log('Conexão com o banco de dados bem-sucedida!');
  }
});
