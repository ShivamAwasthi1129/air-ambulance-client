import React from 'react'
import { Header } from '../components/Header'
import { SearchBar } from '../components/SearchListBar'

const SearchList = () => {
  return (
    <div className='h-[150vh]'>
      {/* <Header /> */}
      {/* <div className='mt-20 flex items-center justify-center sticky top-20 z-20'> */}
      <div className='flex items-center justify-center w-full'>
        <SearchBar />
      </div>
    </div>
  )
}

export default SearchList