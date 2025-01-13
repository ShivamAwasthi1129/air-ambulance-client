import React from 'react'
import { Header } from '../components/Header'
import { SearchBar } from '../components/SearchListBar'
import { Banner } from '../components/SearchBanner'
import FilterAndFleetListing from '../components/FilterAndFleetListing'

const SearchList = () => {
  return (
    <div className='h-[150vh]'>
      <Header />
      <div className='mt-24 flex items-center justify-center sticky top-20 z-20'>
        <SearchBar />
      </div>
      <div className='mt-8'>
        <Banner />
      </div>
      <div>
      <FilterAndFleetListing/>
      </div>
     
    </div>
  )
}

export default SearchList