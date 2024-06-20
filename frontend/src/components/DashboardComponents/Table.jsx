import React, { useState, useEffect } from 'react';
import GoogleMapComponent from './GoogleMap'; // Import the GoogleMapComponent
import { BASE_URL } from '../../constants';
const Table = () => {
  const [manager, setManager] = useState([]);
  const [selectedManager, setSelectedManager] = useState(null);
  const [location, setLocation] = useState([]);
  const [showMap, setShowMap] = useState(false); // State to control the visibility of the map

  useEffect(() => {
    const fetchAllManagers = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/manager/getAllManagers`);
        if (response.ok) {
          const data = await response.json();
          setManager(data);
        } else {
          console.error('Failed to fetch AllManagers');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchAllManagers();
  }, []);
  
  const openModal = async (id) => {
    try {
      const response = await fetch(`${BASE_URL}/api/location/get/${id}`);
      if (response.ok) {
        const data = await response.json();
        setLocation(data.location);
        setSelectedManager(id); // Set the selected manager ID
        setShowMap(true); // Show the map when a location is clicked
      } else {
        console.error('Failed to fetch location');
        setLocation(null);
      }
    } catch (error) {
      console.error('Error:', error);
      setLocation(null);
    }
  };

  return (
    <div className='flex flex-wrap w-full'>
      <div className="p-4 rounded-lg shadow-lg overflow-auto border border-purple-900 w-full lg:w-1/2">
        <div className="text-xl font-bold mb-4 text-[#5443c3]">Branch Manager Details</div>
        <table className="min-w-full bg-white border">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b bg-[#5443c3] text-white">Manager Id</th>
              <th className="py-2 px-4 border-b bg-[#5443c3] text-white">Name</th>
              <th className="py-2 px-4 border-b bg-[#5443c3] text-white">Emp Mail ID</th>
              <th className="py-2 px-4 border-b bg-[#5443c3] text-white">Mobile No</th>
              <th className="py-2 px-4 border-b bg-[#5443c3] text-white">Branch</th>
              <th className="py-2 px-4 border-b bg-[#5443c3] text-white">Branch Address</th>
              <th className="py-2 px-4 border-b bg-[#5443c3] text-white">Manager Address</th>
              <th className="py-2 px-4 border-b bg-[#5443c3] text-white">State</th>
              <th className="py-2 px-4 border-b bg-[#5443c3] text-white">City</th>
              <th className="py-2 px-4 border-b bg-[#5443c3] text-white">Pincode</th>
              <th className="py-2 px-4 border-b bg-[#5443c3] text-white">Location</th>
            </tr>
          </thead>
          <tbody>
            {manager.map((item, index) => (
              <tr key={index}>
                <td className="py-2 px-4 border-b text-[#5443c3]">{item._id}</td>
                <td className="py-2 px-4 border-b text-[#5443c3]">{item.manager_name}</td>
                <td className="py-2 px-4 border-b text-[#5443c3]">{item.manager_email}</td>
                <td className="py-2 px-4 border-b text-[#5443c3]">{item.manager_phone}</td>
                <td className="py-2 px-4 border-b text-[#5443c3]">{item.branch_name}</td>
                <td className="py-2 px-4 border-b text-[#5443c3]">{item.branch_address}</td>
                <td className="py-2 px-4 border-b text-[#5443c3]">{item.manager_address}</td>
                <td className="py-2 px-4 border-b text-[#5443c3]">{item.branch_state}</td>
                <td className="py-2 px-4 border-b text-[#5443c3]">{item.branch_city}</td>
                <td className="py-2 px-4 border-b text-[#5443c3]">{item.branch_pincode}</td>
                <td
                  className="py-2 px-4 border-b text-decoration-line: underline"
                  style={{ color: 'blue', cursor: 'pointer' }}
                  onClick={() => openModal(item._id)}
                >
                  Click here
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showMap && location.length >= 1 && (
        <div className="w-full lg:w-1/2 p-4">
          <GoogleMapComponent locations={location[0]?.locations} onClose={() => setShowMap(false)} className="w-full"/>
        </div>
      )}
    </div>
  );
};

export default Table;
