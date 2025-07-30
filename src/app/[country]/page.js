"use client";
import { useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Home from "../page";

const CountryPage = ({ params }) => {
  const router = useRouter();
  const unwrappedParams = use(params);
  const country = unwrappedParams.country;

  useEffect(() => {
    if (country) {
      sessionStorage.setItem("country_name", country);
      window.dispatchEvent(new Event("countryNameChanged"));
    }
  }, [country]);

  return <Home />;
};

export default CountryPage;
