"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const router_1 = require("./router");
const cors = require('cors');
exports.app = (0, express_1.default)();
exports.app.use(cors());
exports.app.use(express_1.default.json());
exports.app.use(router_1.router);
exports.app.listen(8080, () => console.log('Servidor rodando na porta 8080'));
