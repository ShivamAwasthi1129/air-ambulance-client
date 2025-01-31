import React from 'react'
// import { Header } from '../components/Header'
import { SearchBar } from './components/SearchListBar'
import { Bottom } from './components/Bottom'

const Home = () => {
  return (
    <div className='h-[150vh]'>
      {/* <Header /> */}
      {/* <div className='mt-20 flex items-center justify-center sticky top-20 z-20'> */}
      <div className='flex items-center justify-center flex-col w-full'>
        <SearchBar />
        <Bottom/>
      </div>
    </div>
  )
}

export default Home