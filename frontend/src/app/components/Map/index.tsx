"use client";

import { useCallback, useState, useMemo, ChangeEvent } from "react";
import {
  GoogleMap,
  DirectionsRenderer,
  DirectionsService,
  LoadScript,
  Marker,
  StandaloneSearchBox,
} from "@react-google-maps/api";
import { useTripContext } from "@/app/context/tripContext";

export default function Map() {
  const {
    consumerId,
    origin,
    destination,
    estimatedTripValue,
    setConsumerId,
    setOrigin,
    setDestination,
    setEstimatedTripValue,
  } = useTripContext();

  const [map, setMap] = useState<google.maps.Map>();
  const [searchBoxA, setSearchBoxA] = useState<google.maps.places.SearchBox>();
  const [searchBoxB, setSearchBoxB] = useState<google.maps.places.SearchBox>();
  const [pointA, setPointA] = useState<google.maps.LatLngLiteral>();
  const [pointB, setPointB] = useState<google.maps.LatLngLiteral>();

  const [response, setResponse] =
    useState<google.maps.DistanceMatrixResponse | null>(null);

  const position = {
    lat: -23.412827,
    lng: -51.932402,
  };

  const handleFormsChange = (event: ChangeEvent<HTMLInputElement>) => {
    const name = event.target.name;
    const value = event.target.value;
    if (name == "consumer_id") {
      setConsumerId(value);
    }
    if (name == "estimatedTripValue") {
      setEstimatedTripValue(Number(value));
    }
  };

  const onMapLoad = (map: google.maps.Map) => {
    setMap(map);
  };

  const onLoadA = (ref: google.maps.places.SearchBox) => {
    setSearchBoxA(ref);
  };

  const onLoadB = (ref: google.maps.places.SearchBox) => {
    setSearchBoxB(ref);
  };

  const onPlacesChangedA = () => {
    const places = searchBoxA!.getPlaces();
    console.log(places);
    const place = places![0];
    const location = {
      lat: place?.geometry?.location?.lat() || 0,
      lng: place?.geometry?.location?.lng() || 0,
    };
    setPointA(location);
    setResponse(null);
    map?.panTo(location);
  };

  const onPlacesChangedB = () => {
    const places = searchBoxB!.getPlaces();
    console.log(places);
    const place = places![0];
    const location = {
      lat: place?.geometry?.location?.lat() || 0,
      lng: place?.geometry?.location?.lng() || 0,
    };
    setPointB(location);
    setResponse(null);
    map?.panTo(location);
  };

  const traceRoute = () => {
    if (pointA && pointB) {
      setOrigin(pointA);
      setDestination(pointB);
    }
  };

  const directionsServiceOptions =
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    useMemo<google.maps.DirectionsRequest>(() => {
      return {
        origin,
        destination,
        travelMode: "DRIVING",
      };
    }, [origin, destination]);

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const directionsCallback = useCallback((res) => {
    if (res !== null && res.status === "OK") {
      setResponse(res);
    } else {
      console.log(res);
    }
  }, []);

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const directionsRendererOptions = useMemo<any>(() => {
    return {
      directions: response,
    };
  }, [response]);

  return (
    <div>
      <form className="container flex mx-auto py-10 gap-10 justify-center items-center">
        <label className="flex flex-col items-center">
          Coloque o seu id:
          <input
            type="text"
            name="consumer_id"
            value={consumerId || ""}
            onChange={handleFormsChange}
            className="text-slate-800 p-1 rounded-sm w-1/2"
          />
        </label>
        <label className="flex flex-col items-center">
          Coloque o valor estimado (R$):
          <input
            type="number"
            name="estimatedTripValue"
            value={estimatedTripValue || ""}
            onChange={handleFormsChange}
            className="text-slate-800 w-14 p-1 text-center rounded-sm"
          />
        </label>
      </form>
      <div className="h-96 w-3/4 mx-auto">
        <LoadScript
          googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_API_KEY as string}
          libraries={["places"]}
        >
          <GoogleMap
            onLoad={onMapLoad}
            mapContainerStyle={{ width: "100%", height: "100%" }}
            center={position}
            zoom={15}
          >
            <div className="absolute box-border flex gap-10 top-10 ml-56 shadow-md bg-slate-300 opacity-90 rounded-md p-2">
              <StandaloneSearchBox
                onLoad={onLoadA}
                onPlacesChanged={onPlacesChangedA}
              >
                <input
                  className="p-2 shadow-xl rounded-md text-slate-700"
                  placeholder="Digite o endereço inicial"
                  name="origin"
                />
              </StandaloneSearchBox>
              <StandaloneSearchBox
                onLoad={onLoadB}
                onPlacesChanged={onPlacesChangedB}
              >
                <input
                  className="p-2 shadow-xl rounded-md text-slate-700"
                  placeholder="Digite o endereço final"
                  name="destination"
                />
              </StandaloneSearchBox>
              <button
                onClick={traceRoute}
                className="p-2 font-bold text-white bg-slate-500 rounded-md"
              >
                Traçar rota
              </button>
            </div>

            {!response && pointA && <Marker position={pointA} />}
            {!response && pointB && <Marker position={pointB} />}

            {origin && destination && (
              <DirectionsService
                options={directionsServiceOptions}
                callback={directionsCallback}
              />
            )}

            {response && directionsRendererOptions && (
              <DirectionsRenderer options={directionsRendererOptions} />
            )}
          </GoogleMap>
        </LoadScript>
      </div>
    </div>
  );
}
