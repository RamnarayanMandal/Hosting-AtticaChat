import React from 'react'

import SuperAdminSidebar from './SuperAdminSidebar'
import GroupsList from '../admin/GroupsList'


const SuperAdminGroupList = () => {
  return (
    <div className='lg:flex  block'>
    <SuperAdminSidebar/>
       <GroupsList/>     
      

    </div>
  )
}

export default SuperAdminGroupList
