"use client";

import { redirect } from "next/navigation";
import { useState } from "react";

type GetResponseType = {
  customer_id: string;
  destination: string;
  distance: number;
  driver_id: number;
  driver_name: string;
  duration: string;
  id: number;
  origin: string;
  value: number;
};

export default function History() {
  const [customerId, setCustomerId] = useState("");
  const [selectedDriver, setSelectedDriver] = useState("");
  const [historyTrips, setHistoryTrips] = useState<GetResponseType[]>([]);
  const [error, setError] = useState<string>("");

  const handleFilter = async () => {
    if (!customerId || !selectedDriver) {
      setError("Por favor, preencha todos os campos antes de filtrar.");
      return;
    }

    setError("");

    try {
      const response = await fetch(
        `http://localhost:8080/ride/${customerId}?driver_id=${selectedDriver}`
      )
        .then((response) => {
          if (!response.ok) {
            throw new Error(
              `Erro na requisição: ${response.status} ${response.statusText}`
            );
          }
          return response.json();
        })
        .catch((error) => {
          console.log("Erro ao chamar a API:" + error);
          setError("Erro ao buscar os dados. Tente novamente!");
        });
      setHistoryTrips(response);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <section>
      <div className="flex justify-center mt-10">
        <button
          onClick={() => redirect("/")}
          className="bg-cyan-800 p-3 rounded-sm text-slate-300 hover:bg-cyan-600"
        >
          Página Inicial
        </button>
      </div>
      <div className="flex gap-10 justify-center mt-10 items-center">
        <label className="flex flex-col items-center gap-1">
          Digite o id do usuário
          <input
            type="text"
            name="consumer_id"
            className="p-2 text-slate-700"
            value={customerId}
            onChange={(e) => setCustomerId(e.target.value)}
          />
        </label>
        <label className="flex flex-col gap-1">
          Selecione o motorista:
          <select
            className="p-2 text-slate-700"
            value={selectedDriver}
            onChange={(e) => setSelectedDriver(e.target.value)}
          >
            <option value="" disabled>
              Selecione
            </option>
            <option value="1">Homer Simpson</option>
            <option value="2">Dominic Toretto</option>
            <option value="3">James Bond</option>
            <option value="4">Todos</option>
          </select>
        </label>
        <button
          className="bg-slate-300 text-blue-900 font-bold px-3 py-2 rounded-md hover:bg-slate-400"
          onClick={handleFilter}
        >
          Filtrar
        </button>
      </div>
      <div className="flex gap-10 mx-32 flex-wrap justify-center mt-10">
        {historyTrips?.length > 0 ? (
          historyTrips.map((trip) => {
            return (
              <ul key={trip.id} className="w-80 bg-sky-900 p-4 rounded-md">
                <li>
                  <b>Nome do motorista:</b> {trip.driver_name}
                </li>
                <li>
                  <b>Origem:</b> {trip.origin}
                </li>
                <li>
                  <b>Destino:</b> {trip.destination}
                </li>
                <li>
                  <b>Distância:</b> {trip.distance}m
                </li>
                <li>
                  <b>Tempo:</b> {trip.duration}
                </li>
                <li>
                  <b>Valor: </b>R${trip.value.toFixed(2)}
                </li>
              </ul>
            );
          })
        ) : error != "" ? (
          <p>{error}</p>
        ) : (
          <p>Nenhuma viagem encontrada</p>
        )}
      </div>
    </section>
  );
}
