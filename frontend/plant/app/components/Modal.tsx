"use client";

import React, { useCallback } from "react";
import { useRouter } from "next/navigation";

interface IModalProps {
  children: React.ReactNode;
  onClose?: () => void;
}

const Modal: React.FC<IModalProps> = ({ children, onClose }) => {
  const router = useRouter();

  // Handler for closing modal
  const handleClose = useCallback(() => {
    router.back();
    onClose?.();
  }, [onClose, router]);

  return (
    <div className="fixed top-0 left-0 w-full h-full">
      <button
        className="absolute top-0 left-0 w-full h-full bg-black/50 backdrop-blur-md"
        onClick={handleClose}
      />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        {children}
      </div>
    </div>
  );
};

export default Modal;
