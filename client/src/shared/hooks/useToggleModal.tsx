import { useState } from 'react';

type ModalProps = {
  isOpen: boolean;
  handleToggleModal: () => void;
  children: React.ReactNode;
};

const BaseModalDekstop = ({ handleToggleModal, isOpen, children }: ModalProps) => {
  return (
    <div
      onClick={handleToggleModal}
      className={`fixed top-0 left-0 w-full h-screen bg-black bg-opacity-50 flex justify-center items-center z-50 ${
        isOpen ? 'block' : 'hidden'
      }`}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-canvasPrimary w-[620px] h-[720px] rounded-xl p-md overflow-auto "
      >
        {children}
      </div>
    </div>
  );
};

type TModal = {
  content?: React.ReactNode;
};

const useToggleModal = ({ content }: TModal) => {
  const [isOpen, setOpen] = useState(false);

  const handleToggleModal = () => {
    setOpen((prev) => !prev);
  };

  let modal = BaseModalDekstop({ handleToggleModal, isOpen, children: content });

  return { modal, handleToggleModal };
};

export default useToggleModal;
