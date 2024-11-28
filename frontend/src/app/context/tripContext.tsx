"use client";

import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useState,
} from "react";

interface ContextProps {
  consumerId: string;
  setConsumerId: Dispatch<SetStateAction<string>>;
  origin: google.maps.LatLngLiteral;
  setOrigin: Dispatch<SetStateAction<google.maps.LatLngLiteral>>;
  destination: google.maps.LatLngLiteral;
  setDestination: Dispatch<SetStateAction<google.maps.LatLngLiteral>>;
  estimatedTripValue: number;
  setEstimatedTripValue: Dispatch<SetStateAction<number>>;
}

const TripContext = createContext<ContextProps>({
  consumerId: "",
  setConsumerId: (): string => "",
  origin: { lat: 0, lng: 0 },
  setOrigin: () => {},
  destination: { lat: 0, lng: 0 },
  setDestination: () => {},
  estimatedTripValue: 0,
  setEstimatedTripValue: (): number => 0,
});

export const TripContextProvider = ({ children }: { children: ReactNode }) => {
  const [consumerId, setConsumerId] = useState("");
  const [origin, setOrigin] = useState<google.maps.LatLngLiteral>({
    lat: 0,
    lng: 0,
  });
  const [destination, setDestination] = useState({ lat: 0, lng: 0 });
  const [estimatedTripValue, setEstimatedTripValue] = useState(0);

  return (
    <TripContext.Provider
      value={{
        consumerId,
        setConsumerId,
        origin,
        setOrigin,
        destination,
        setDestination,
        estimatedTripValue,
        setEstimatedTripValue,
      }}
    >
      {children}
    </TripContext.Provider>
  );
};

export const useTripContext = () => useContext(TripContext);
