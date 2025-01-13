import { Main } from "./components/Main";
import { SmallBottom } from "./components/SamllBottom";
import FlightCard from "./components/FleetCard";
import { Bottom } from "./components/Bottom";
export default function Home() {
  const flightData = {
    image: "https://images.unsplash.com/photo-1735005887520-32df38da7a4c?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    title: "King Air C90",
    description: "Twin Engine Turboprop",
    flightTime: "12 Hrs 50 Min",
    pax: 6,
    price: "19,02,267",
  };
  return (
    <div className=" bg-sky-100">
     <Main/>
     <div className="pt-32">
     <SmallBottom />
     </div>
     <Bottom/>
     {/* <FlightCard
        image={flightData.image}
        title={flightData.title}
        description={flightData.description}
        flightTime={flightData.flightTime}
        pax={flightData.pax}
        price={flightData.price}
      /> */}
    </div>
  );
}
