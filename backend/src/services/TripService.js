"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTrips = exports.insertTrip = void 0;
const mysql_1 = require("../db/mysql");
const insertTrip = async (customer_id, origin, destination, distance, duration, driver, value) => {
    try {
        const query = "INSERT INTO trips (customer_id, origin, destination, distance, duration, driver_id, driver_name, value) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        const values = [customer_id, origin, destination, distance, duration, driver.id, driver.nome, value];
        const [results] = await mysql_1.connection.promise().query(query, values);
        console.log(results);
    }
    catch (error) {
        console.log(error);
    }
};
exports.insertTrip = insertTrip;
const getTrips = (id) => {
    try {
        return new Promise((resolve, reject) => {
            const query = `SELECT * FROM trips WHERE customer_id = ${id}`;
            mysql_1.connection.query(query, (err, result) => {
                if (err)
                    reject(new Error(err.message));
                if (result.length == 0)
                    return reject();
                resolve(result);
            });
        });
    }
    catch (error) {
        console.log(error);
    }
};
exports.getTrips = getTrips;
