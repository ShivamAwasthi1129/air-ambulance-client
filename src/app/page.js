import { Main } from "./components/Main";
import { SmallBottom } from "./components/SamllBottom";
import { Bottom } from "./components/Bottom";
export default function Home() {

  return (
    <div className=" bg-sky-100">
     <Main/>
     <div className="pt-32">
     <SmallBottom />
     </div>
     <Bottom/>
    </div>
  );
}
