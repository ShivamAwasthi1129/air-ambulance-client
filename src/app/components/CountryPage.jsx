import React from 'react'
import AircraftListingSection from './CountryPageComponents/AircraftListingSection'
import FlyPrivateSection from './CountryPageComponents/FlyPrivateSection'
import WhyChooseSection from './CountryPageComponents/WhyChooseSection'
import NearByAirportsSection from './CountryPageComponents/NearByAirportSection'
import NewsAndUpdatesSection from './CountryPageComponents/News&UpdateSection'
import BestFlightSection from './CountryPageComponents/BestFlightsSection'
import ReviewSection from './CountryPageComponents/Reviews'
import PlanningSection from './CountryPageComponents/PlanningSection'

const CountryPage = () => {
  return (
    <div className='max-w-[110rem] mx-auto'>
      <AircraftListingSection />
      <FlyPrivateSection/>
      <WhyChooseSection/>
      <NearByAirportsSection/>
      <NewsAndUpdatesSection/>
      <BestFlightSection/>
      <ReviewSection/>
      <PlanningSection/>
    </div>
  )
}

export default CountryPage