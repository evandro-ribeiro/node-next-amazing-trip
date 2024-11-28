import { Router, Request, Response } from 'express';
import * as dotenv from 'dotenv';
import { computeRoute, parseLatLng } from './api-google';
import { drivers, getDriver } from './drivers';
import { getTrips, insertTrip } from './services/TripService';

dotenv.config();
export const router = Router();

router.post("/ride/estimate", async (req:Request, res:Response): Promise<any> => {
    const { customer_id, origin, destination } = req.body;

    try {
        const dataGoogleApi = await computeRoute(origin, destination);
        let distance = 0;
        let duration = "";
        if(dataGoogleApi) {
            distance = dataGoogleApi[0].distanceMeters;
            duration = dataGoogleApi[0].duration;
        };

        const driversList = getDriver(distance/1000);

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
    } catch (error) {
        res.status(400).json({ error_code: "INVALID_DATA", "error_description": "Os dados fornecidos no corpo da requisição são inválidos" });
    }
});

router.patch("/ride/confirm", async (req:Request, res:Response) => {
    const { customer_id, origin, destination, distance, duration, driver, value } = req.body;
    const validDriver = drivers.find(d => d.id === driver.id);

    try {
        insertTrip(customer_id, origin, destination, distance, duration, driver, value);

        res.status(200).json({ success: true });
    } catch (error) {
        if (!customer_id || !origin || !destination || !driver || !driver.id || !driver.name) {
            res.status(400).json({ error_code: "INVALID_DATA", error_description: "Os dados fornecidos no corpo da requisição são inválidos" });
        }
    
        if (!validDriver) {
            res.status(404).json({ error_code: "DRIVER_NOT_FOUND", error_description: "Motorista não encontrado" });
        } else if(validDriver.km_minimo < distance) {
            res.status(406).json({ error_code: "INVALID_DISTANCE", error_description: "Quilometragem inválida para o motorista" });
        }

        console.log(error);
    }
});

router.get("/ride/:customer_id", async (req: Request, res: Response): Promise<any> => {

    try {
        const customer_id = req.params.customer_id;
        const driver_id = req.query.driver_id as string;

        const trips = await getTrips(Number(customer_id));

        if(trips) {
            let filteredDriver = trips.find(trip => trip.driver_id == driver_id);
            if(filteredDriver == undefined) {
                res.status(400).json({ "error_code": "INVALID_DRIVER", "error_description": "Motorista invalido" });
                return;
            }

            let filteredCustomer = trips.find(trip => trip.customer_id == customer_id);
            if(filteredCustomer == undefined) {
                res.status(404).json({ "error_code": "NO_RIDES_FOUND", "error_description": "Nenhum registro encontrado" });
                return;
            }

            res.status(200).json(trips);
            return trips;
        }
    } catch (error) {
        console.log(error);
    }
});

