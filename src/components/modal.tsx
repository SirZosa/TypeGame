import React from 'react';

interface Props {
  isOpen: boolean;
}

const Modal: React.FC<Props> = ({ isOpen }) => {
  return (
    <>
      {isOpen && (
        <div className={`modal-overlay ${isOpen ? 'fade-in' : 'fade-out'}`}>
          <div className="modal-content">
            <div className="loading-spinner"></div>
            <p className='loading-text'>Loading...</p>
          </div>
        </div>
      )}
    </>
  );
};

export default Modal;