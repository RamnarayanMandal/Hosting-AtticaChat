import React from 'react'
import Sidebar from '../Sidebar'
import GroupsList from '../GroupsList'


const Groups = () => {
  return (
    <div className='lg:flex  block'>
      <Sidebar/>
       <GroupsList/>     
      

    </div>
  )
}

export default Groups
