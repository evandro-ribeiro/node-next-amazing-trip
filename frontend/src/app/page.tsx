import Drivers from "./components/Drivers";
import Map from "./components/Map";

export default function Home() {
  return (
    <div>
      <h1 className="title">Amazing Trips</h1>
      <Map />
      <Drivers />
    </div>
  );
}
