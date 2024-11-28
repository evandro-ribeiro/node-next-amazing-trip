"use client";

import { useTripContext } from "@/app/context/tripContext";
import { drivers } from "@/app/drivers";
import { redirect } from "next/navigation";

type DriverTypeResponse = {
  description: string;
  id: number;
  name: string;
  review: {
    rating: number;
    comment: string;
  };
  value: number;
  vehicle: {
    modelo: string;
    cor: string;
  };
};

type PostResponseType = {
  origin: {
    latitude: number;
    longitude: number;
  };
  destination: {
    latitude: number;
    longitude: number;
  };
  distance: number;
  duration: string;
  options: DriverTypeResponse[];
  routeResponse: string;
};

export default function Drivers() {
  const { estimatedTripValue, consumerId, origin, destination } =
    useTripContext();

  const requestPostBody = {
    customer_id: consumerId,
    origin: `${origin.lat}, ${origin.lng}`,
    destination: `${destination.lat}, ${destination.lng}`,
  };

  const fetchPostOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestPostBody),
  };

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const chooseDriver = async (event) => {
    // MÉTODO POST QUE RETORNA O BODY PARA O MÉTODO PATCH
    const data = await fetch(
      "http://localhost:8080/ride/estimate",
      fetchPostOptions
    )
      .then((data) => data.json())
      .then((res): PostResponseType => res);

    console.log(data);

    // CONFIGURAR TRIPVALUE PRO ID ESPECÍFICO
    const filteredDriver = drivers.find(
      (driver) => driver.id == event.target.parentNode.id
    );

    const requestPatchBody = {
      customer_id: consumerId,
      origin: `${data.origin.latitude}, ${data.origin.longitude}`,
      destination: `${data.destination.latitude}, ${data.destination.longitude}`,
      distance: data.distance,
      duration: data.duration,
      driver: {
        id: filteredDriver!.id,
        nome: filteredDriver!.nome,
      },
      value: filteredDriver!.taxa * estimatedTripValue,
    };

    const fetchPatchOptions = {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestPatchBody),
    };

    // MÉTODO PATCH, QUE INSERE NO BANCO DE DADOS OS DADOS DA VIAGEM
    await fetch("http://localhost:8080/ride/confirm", fetchPatchOptions)
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            `Erro na requisição: ${response.status} ${response.statusText}`
          );
        }
        return response.json();
      })
      .then((data) => {
        console.log("Resposta da API:", data);
      })
      .catch((error) => {
        console.error("Erro ao chamar a API:", error);
      });
    redirect("/history");
  };

  return (
    <div className="flex m-20 gap-6">
      {estimatedTripValue != 0 &&
        drivers.map((driver) => {
          return (
            <ul
              key={driver.id}
              id={driver.id.toString()}
              className="bg-zinc-600 p-5 flex flex-col gap-3 rounded-md"
            >
              <li className="font-bold text-center pb-4 text-lg text-blue-300">
                {driver.nome}
              </li>
              <li className="text-justify">
                <b>Descrição: </b>
                {driver.descricao}
              </li>
              <li>
                <b>Carro: </b>
                {driver.carro.modelo}
              </li>
              <li>
                <b>Avaliação: </b>
                {driver.avaliacao}
              </li>
              <li>
                <b>Valor da Viagem: </b>R$
                {(driver.taxa * estimatedTripValue).toFixed(2)}
              </li>
              <button
                className="bg-slate-300 text-blue-900 font-bold w-32 p-2 rounded-md mx-auto box-border mt-auto hover:bg-slate-400"
                onClick={async (e) => await chooseDriver(e)}
              >
                Escolher
              </button>
            </ul>
          );
        })}
    </div>
  );
}
