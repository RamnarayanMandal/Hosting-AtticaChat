import React, { useState } from 'react'
import logo from '../../assests/logo.png';

const AdminRegistration = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
  
    const handleEmailChange = (e) => setEmail(e.target.value);
    const handlePasswordChange = (e) => setPassword(e.target.value);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#f6f6f4]">
        
         <div className="text-center mb-6">
        <img src={logo} alt="Chatvia Logo" className="mx-auto mb-4" />
        <h2 className="text-2xl font-semibold">Sign in</h2>
        <p className="text-gray-600 mt-5">Sign in to continue with Attica Chat Portal.</p>
      </div>
    <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md mx-4">

      {/* <div className="text-center mb-6">
        <img src={logo} alt="Chatvia Logo" className="mx-auto mb-4" />
        <h2 className="text-2xl font-semibold">Sign in</h2>
        <p className="text-gray-600">Sign in to continue with Attica Chat Portal.</p>
      </div> */}
      <form>

        <div className="mb-4"> 
          <label htmlFor="email" className="block text-gray-700">Email</label>
          <input
            type="email"
            id="email"
            className="block w-full mt-2 p-2 border border-gray-300 rounded"
            placeholder="Enter your Email"
            value={email}
            onChange={handleEmailChange}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block text-gray-700">Password</label>
          <input
            type="password"
            id="password"
            className="block w-full mt-2 p-2 border border-gray-300 rounded"
            placeholder="********"
            value={password}
            onChange={handlePasswordChange}
          />
          {/* <div className="text-right mt-2">
            <a href="#" className="text-blue-500 hover:underline">Forgot your password?</a>
          </div> */}
        </div>
        <div className="mb-4">
          <label htmlFor="confirmPassword" className="block text-gray-700">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            className="block w-full mt-2 p-2 border border-gray-300 rounded"
            placeholder="********"
            value={password}
            onChange={handlePasswordChange} 
          />
          {/* <div className="text-right mt-2">
            <a href="#" className="text-blue-500 hover:underline">Forgot your password?</a>
          </div> */}
        </div>
       

        {/* <div className="flex items-center mb-4">
          <input type="checkbox" id="remember-me" className="mr-2" />
          <label htmlFor="remember-me" className="text-gray-700">Remember me</label>
        </div> */}
        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-[#93c5fd]">Register</button>
      </form>
      {/* <div className="text-center mt-6">
        <p className="text-gray-600">Don't have an account? <a href="#" className="text-[#7269ef] hover:underline">Signup now</a></p>
      </div> */}
      <div className="text-center mt-6 text-gray-600 text-sm">
        <p>© 2024 attica. Crafted with <span className="text-red-500">❤</span> by attica gold</p>
      </div>
    </div>
  </div>
  )
}

export default AdminRegistration