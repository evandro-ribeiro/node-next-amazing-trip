import "reflect-metadata"
import express from 'express';
import { router } from './router';
import { DataSource } from 'typeorm';
import { Trips } from './entity/Trips';

const cors = require('cors');

export const app = express();

app.use(cors());

app.use(express.json());

const AppDataSource = new DataSource({
    type: "mysql",
    host: "mysql",
    port: 3306,
    username: "root",
    password: "root",
    database: "taxi",
    entities: [Trips],
    synchronize: true,
    logging: false,
})

AppDataSource.initialize()
.then(async (connection) => {
    console.log("Banco de dados conectado");

    // Sincroniza as tabelas
    await connection.synchronize();
    console.log("Tabelas sincronizadas");
  })
  .catch((error) => console.log("Erro de conexão:", error));

app.use(router);

app.listen(8080, () => console.log('Servidor rodando na porta 8080'));
