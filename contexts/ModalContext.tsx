/**
 * Unified Modal Context - Centralized modal state management
 * Provides consistent modal behavior across the application
 */

import React, { createContext, useContext, useState, ReactNode } from &apos;react&apos;;

export type ModalType = &apos;settings&apos; | &apos;profile&apos; | &apos;analytics&apos; | &apos;help&apos; | &apos;trade&apos; | &apos;assign-awards&apos; | &apos;edit-branding&apos; | &apos;share-team&apos; | &apos;checklist-report&apos;;

export interface ModalContextValue {
}
  activeModal: ModalType | null;
  modalData: any;
  openModal: (type: ModalType, data?: any) => void;
  closeModal: () => void;
  isModalOpen: (type: ModalType) => boolean;
}

const ModalContext = createContext<ModalContextValue | undefined>(undefined);

export const useModal = () => {
}
  const context = useContext(ModalContext);
  if (context === undefined) {
}
    throw new Error(&apos;useModal must be used within a ModalProvider&apos;);
  }
  return context;
};

interface ModalProviderProps {
}
  children: ReactNode;
}

export const ModalProvider: React.FC<ModalProviderProps> = ({ children }: any) => {
}
  const [activeModal, setActiveModal] = useState<ModalType | null>(null);
  const [modalData, setModalData] = useState<any>(null);

  const openModal = (type: ModalType, data?: any) => {
}
    setActiveModal(type);
    setModalData(data || null);
  };

  const closeModal = () => {
}
    setActiveModal(null);
    setModalData(null);
  };

  const isModalOpen = (type: ModalType) => {
}
    return activeModal === type;
  };

  const value: ModalContextValue = {
}
    activeModal,
    modalData,
    openModal,
    closeModal,
    isModalOpen,
  };

  return (
    <ModalContext.Provider value={value}>
      {children}
    </ModalContext.Provider>
  );
};

export default ModalContext;