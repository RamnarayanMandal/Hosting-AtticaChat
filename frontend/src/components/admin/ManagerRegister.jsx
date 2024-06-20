import React, { useState } from 'react';
import Sidebar from './Sidebar';
import ManagerRegisterModal from './ManagerRegisterModal';

const ManagerRegister = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div>     
      <ManagerRegisterModal isOpen={isModalOpen} onClose={closeModal} />
    </div>
  );
};

export default ManagerRegister;
