import React from 'react';
import { ModalOverlay, ModalContent, ModalCloseButton } from './StyledComponents';

export const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <ModalOverlay onClick={handleOverlayClick}>
      <ModalContent>
        <ModalCloseButton onClick={onClose}>
          ✕
        </ModalCloseButton>
        {children}
      </ModalContent>
    </ModalOverlay>
  );
};
