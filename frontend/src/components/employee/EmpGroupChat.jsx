import React from 'react'
import EmployeeSidebar from './EmployeeSidebar'
import EmpMessage from './EmpMessage'

const EmpGroupChat = () => {
  return (
    <div className='flex'>
     <EmployeeSidebar/>
     <EmpMessage/>
    </div>
  )
}

export default EmpGroupChat
