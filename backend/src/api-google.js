"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.computeRoute = computeRoute;
exports.parseLatLng = parseLatLng;
const GOOGLE_ROUTES_API_URL = "https://routes.googleapis.com/directions/v2:computeRoutes";
async function computeRoute(origin, destination) {
    try {
        const requestData = {
            origin: { location: { latLng: parseLatLng(origin) } },
            destination: { location: { latLng: parseLatLng(destination) } },
            travelMode: "DRIVE",
        };
        const apiKey = process.env.GOOGLE_API_KEY;
        if (!apiKey) {
            throw new Error("Verifique a chave de API do Google Maps no arquivo .env.");
        }
        const response = await fetch(GOOGLE_ROUTES_API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-Goog-Api-Key": apiKey,
                "X-Goog-FieldMask": "routes.duration,routes.distanceMeters",
            },
            body: JSON.stringify(requestData),
        });
        if (!response.ok) {
            throw new Error(`Erro da API: ${response.statusText}`);
        }
        const data = (await response.json());
        if (!data.routes || !Array.isArray(data.routes)) {
            throw new Error("Resposta da API não contém 'routes' ou está malformada.");
        }
        return data.routes;
    }
    catch (error) {
        console.error("Erro ao obter rota:", error instanceof Error ? error.message : error);
    }
}
// Função para converter string de coordenadas para o formato 'latitude, longitude'
function parseLatLng(input) {
    const [lat, lng] = input.split(",").map(Number);
    if (isNaN(lat) || isNaN(lng)) {
        throw new Error("As coordenadas devem ser no formato 'latitude,longitude'.");
    }
    return { latitude: lat, longitude: lng };
}
/** EXEMPLO DE CHAMADA
 * computeRoute("40.7128,-74.0060", "34.0522,-118.2437");
 */
