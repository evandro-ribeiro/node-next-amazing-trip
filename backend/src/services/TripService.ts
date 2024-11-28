import { connection } from "../db/mysql";

export const insertTrip = async (customer_id: string, origin: string, destination: string, distance: number, duration: string, driver: {id: number, nome: string}, value: number) => {
    try {
        const query = "INSERT INTO trips (customer_id, origin, destination, distance, duration, driver_id, driver_name, value) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";

        const values = [customer_id, origin, destination, distance, duration, driver.id, driver.nome, value];

        const [results] = await connection.promise().query(query, values);
        console.log(results);
        
    } catch (error) {
        console.log(error);
    }
  
};

export const getTrips = (id: number) => {
    try {
        return new Promise<Array<any>>((resolve, reject) => {
            const query = `SELECT * FROM trips WHERE customer_id = ${id}`;
            connection.query(query, (err, result:Array<any>) => {
                if(err) reject(new Error(err.message));
                if(result.length == 0) return reject();
                resolve(result);
            });      
        })

    } catch (error) {
        console.log(error);
    }
};
