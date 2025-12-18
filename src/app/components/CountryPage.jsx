"use client";
import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';

// Simple loading skeleton
const SectionLoader = () => (
  <div className="py-8 px-4">
    <div className="max-w-6xl mx-auto">
      <div className="h-8 bg-gray-200 rounded w-48 mb-4 animate-pulse"></div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-40 bg-gray-200 rounded-lg animate-pulse"></div>
        ))}
      </div>
    </div>
  </div>
);

// Critical components - load immediately
import HeroAviationSection from './CountryPageComponents/HeroAviationSection';
import AircraftListingSection from './CountryPageComponents/AircraftListingSection';

// Non-critical components - lazy load
const FlyPrivateSection = dynamic(() => import('./CountryPageComponents/FlyPrivateSection'), {
  loading: SectionLoader,
  ssr: false
});

const WhyChooseSection = dynamic(() => import('./CountryPageComponents/WhyChooseSection'), {
  loading: SectionLoader,
  ssr: false
});

const NearByAirportsSection = dynamic(() => import('./CountryPageComponents/NearByAirportSection'), {
  loading: SectionLoader,
  ssr: false
});

const NewsAndUpdatesSection = dynamic(() => import('./CountryPageComponents/News&UpdateSection'), {
  loading: SectionLoader,
  ssr: false
});

const BestFlightSection = dynamic(() => import('./CountryPageComponents/BestFlightsSection'), {
  loading: SectionLoader,
  ssr: false
});

const PopularRoutesSection = dynamic(() => import('./CountryPageComponents/PopularRoutesSection'), {
  loading: SectionLoader,
  ssr: false
});

const TermsAndDisclaimer = dynamic(() => import('./CountryPageComponents/Terms&Desclaimer'), {
  loading: SectionLoader,
  ssr: false
});

const FAQSection = dynamic(() => import('./CountryPageComponents/FaqSection'), {
  loading: SectionLoader,
  ssr: false
});

const ReviewSection = dynamic(() => import('./CountryPageComponents/Reviews'), {
  loading: SectionLoader,
  ssr: false
});

const PlanningSection = dynamic(() => import('./CountryPageComponents/PlanningSection'), {
  loading: SectionLoader,
  ssr: false
});

const CountryPage = ({ apiData }) => {
  if (!apiData) return null;
  
  return (
    <div className='sm:max-w-[110rem] w-full mx-auto'>
      {/* Critical - loads immediately */}
      <HeroAviationSection data={apiData} />
      <AircraftListingSection data={apiData} />
      
      {/* Non-critical - lazy loaded */}
      <FlyPrivateSection data={apiData} />
      <WhyChooseSection data={apiData} />
      <NearByAirportsSection />
      <NewsAndUpdatesSection data={apiData} />
      <BestFlightSection data={apiData} />
      <PopularRoutesSection data={apiData} />
      <TermsAndDisclaimer data={apiData} />
      <FAQSection data={apiData} />
      <ReviewSection data={apiData} />
      <PlanningSection />
    </div>
  );
};

export default CountryPage;
