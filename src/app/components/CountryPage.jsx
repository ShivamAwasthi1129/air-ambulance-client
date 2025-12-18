import React from 'react';
import AircraftListingSection from './CountryPageComponents/AircraftListingSection';
import FlyPrivateSection from './CountryPageComponents/FlyPrivateSection';
import WhyChooseSection from './CountryPageComponents/WhyChooseSection';
import NearByAirportsSection from './CountryPageComponents/NearByAirportSection';
import NewsAndUpdatesSection from './CountryPageComponents/News&UpdateSection';
import BestFlightSection from './CountryPageComponents/BestFlightsSection';
import ReviewSection from './CountryPageComponents/Reviews';
import PlanningSection from './CountryPageComponents/PlanningSection';
import PopularRoutesSection from './CountryPageComponents/PopularRoutesSection';
import FAQSection from './CountryPageComponents/FaqSection';
import TermsAndDisclaimer from './CountryPageComponents/Terms&Desclaimer';
import HeroAviationSection from './CountryPageComponents/HeroAviationSection';
const CountryPage = ({ apiData }) => {
  if (!apiData) return <div>Failed to load data.</div>
  return (
    <div className='sm:max-w-[110rem] w-full mx-auto'>
      <HeroAviationSection data={apiData} />
      <AircraftListingSection data={apiData} />  
      <FlyPrivateSection data={apiData}/>
      <WhyChooseSection data={apiData}/>
      <NearByAirportsSection/>
      <NewsAndUpdatesSection data={apiData}/>
      <BestFlightSection data={apiData}/>
      <PopularRoutesSection data={apiData}/>
      <TermsAndDisclaimer data={apiData}/>
      <FAQSection data={apiData}/>
      <ReviewSection data={apiData}/>
      <PlanningSection />
    </div>
  );
};

export default CountryPage;