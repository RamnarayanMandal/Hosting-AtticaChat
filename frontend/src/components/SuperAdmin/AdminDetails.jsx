import React, { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../../constants";

const Modal = ({ show, onClose, employee, onUpdate }) => {
  const [formData, setFormData] = useState({ ...employee });

  useEffect(() => {
    setFormData({ ...employee });
  }, [employee]);

  if (!show) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleUpdate = () => {
    onUpdate(formData);
    onClose();
    window.location.reload()
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Edit Admin Details</h2>

        <form>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Name
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Employee ID
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
              name="employeeId"
              value={formData.employeeId}
              onChange={handleChange}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              OTP
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
              name="otp"
              value={formData.otp}
              onChange={handleChange}
            />
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleUpdate}
              className="mr-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Update
            </button>
            <button
              type="button"
              onClick={onClose}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            >
              Close
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const AdminDetails = () => {
  const [employees, setEmployees] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [otp, setOtp] = useState({}); // State to store OTP for each user

  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/admin/getAllAdmin`);
        console.log(res.data);
        setEmployees(res.data);
        // Initialize OTP state with empty values for each user
        const initialOtp = {};
        res.data.forEach((employee) => {
          initialOtp[employee._id] = ""; // Set initial OTP as empty string
        });
        setOtp(initialOtp);
      } catch (error) {
        console.error("Error fetching employees", error);
      }
    };

    fetchAdmin();
  }, []);

  const handleEdit = (employee) => {
    setSelectedEmployee(employee);
    setShowModal(true);
  };

  const handleDelete = async (empId) => {
    try {
      alert("Are you sure? The data will be deleted permanently1111.");
      await axios.delete(`${BASE_URL}/api/admin/delAdminbyId/${empId}`);
      setEmployees(employees.filter((employee) => employee._id !== empId));
    } catch (error) {
      console.error("Error deleting employee", error);
    }
  };

  const changeOtp = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/user/updateOtp`);
      console.log("updateotp   ", res.data);
      // Update OTP state with fetched OTP data
      window.location.reload();
    } catch (error) {
      console.error("Error fetching OTP", error);
    }
  };

  return (
    <div className="w-full p-6 bg-gray-100 rounded-lg shadow-md">
      <div className="flex flex-row">
        <h1 className="text-2xl font-bold mb-4">Admin Details</h1>
        {/* <button onClick={changeOtp}>Change OTP</button> */}
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {employees.map((employee) => (
              <tr key={employee._id}>
                <td className="py-4 px-4 whitespace-nowrap">
                  {employee.email}
                </td>
                <td className="py-4 px-4 whitespace-nowrap flex">
                  <button
                    onClick={() => handleEdit(employee)}
                    className="mr-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(employee._id)}
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {selectedEmployee && (
        <Modal
          show={showModal}
          onClose={() => setShowModal(false)}
          employee={selectedEmployee}
          //onUpdate={handleUpdate}
        />
      )}
    </div>
  );
};

export default AdminDetails;
