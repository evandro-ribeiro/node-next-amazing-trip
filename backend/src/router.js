"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const dotenv = __importStar(require("dotenv"));
const api_google_1 = require("./api-google");
const drivers_1 = require("./drivers");
const TripService_1 = require("./services/TripService");
dotenv.config();
exports.router = (0, express_1.Router)();
exports.router.post("/ride/estimate", async (req, res) => {
    const { customer_id, origin, destination } = req.body;
    try {
        const dataGoogleApi = await (0, api_google_1.computeRoute)(origin, destination);
        let distance = 0;
        let duration = "";
        if (dataGoogleApi) {
            distance = dataGoogleApi[0].distanceMeters;
            duration = dataGoogleApi[0].duration;
        }
        ;
        const driversList = (0, drivers_1.getDriver)(distance / 1000);
        const [latOrigin, lngOrigin] = origin.split(",").map(Number);
        const [latDestination, lngDestination] = destination.split(",").map(Number);
        res.status(200).json({
            "origin": {
                "latitude": latOrigin,
                "longitude": lngOrigin,
            },
            "destination": {
                "latitude": latDestination,
                "longitude": lngDestination,
            },
            "distance": distance,
            "duration": duration,
            "options": driversList,
            "routeResponse": ""
        });
        return ({
            "origin": {
                "latitude": latOrigin,
                "longitude": lngOrigin,
            },
            "destination": {
                "latitude": latDestination,
                "longitude": lngDestination,
            },
            "distance": distance,
            "duration": duration,
            "options": driversList,
            "routeResponse": ""
        });
    }
    catch (error) {
        res.status(400).json({ error_code: "INVALID_DATA", "error_description": "Os dados fornecidos no corpo da requisição são inválidos" });
    }
});
exports.router.patch("/ride/confirm", async (req, res) => {
    const { customer_id, origin, destination, distance, duration, driver, value } = req.body;
    const validDriver = drivers_1.drivers.find(d => d.id === driver.id);
    try {
        (0, TripService_1.insertTrip)(customer_id, origin, destination, distance, duration, driver, value);
        res.status(200).json({ success: true });
    }
    catch (error) {
        if (!customer_id || !origin || !destination || !driver || !driver.id || !driver.name) {
            res.status(400).json({ error_code: "INVALID_DATA", error_description: "Os dados fornecidos no corpo da requisição são inválidos" });
        }
        if (!validDriver) {
            res.status(404).json({ error_code: "DRIVER_NOT_FOUND", error_description: "Motorista não encontrado" });
        }
        else if (validDriver.km_minimo < distance) {
            res.status(406).json({ error_code: "INVALID_DISTANCE", error_description: "Quilometragem inválida para o motorista" });
        }
        console.log(error);
    }
});
exports.router.get("/ride/:customer_id", async (req, res) => {
    try {
        const customer_id = req.params.customer_id;
        const driver_id = req.query.driver_id;
        const trips = await (0, TripService_1.getTrips)(Number(customer_id));
        if (trips) {
            let filteredDriver = trips.find(trip => trip.driver_id == driver_id);
            if (filteredDriver == undefined) {
                res.status(400).json({ "error_code": "INVALID_DRIVER", "error_description": "Motorista invalido" });
                return;
            }
            let filteredCustomer = trips.find(trip => trip.customer_id == customer_id);
            if (filteredCustomer == undefined) {
                res.status(404).json({ "error_code": "NO_RIDES_FOUND", "error_description": "Nenhum registro encontrado" });
                return;
            }
            res.status(200).json(trips);
            return trips;
        }
    }
    catch (error) {
        console.log(error);
    }
});
