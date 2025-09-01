/**
 * Modal Manager - Centralized modal rendering system
 * Handles all application modals in one place
 */

import { ErrorBoundary } from &apos;./ErrorBoundary&apos;;
import { useModal } from &apos;../../contexts/ModalContext&apos;;
import { useAppState } from &apos;../../contexts/AppContext&apos;;

// Import all modal components
import SettingsModal from &apos;../modals/SettingsModal&apos;;
import ProfileModal from &apos;../modals/ProfileModal&apos;;
import AnalyticsModal from &apos;../modals/AnalyticsModal&apos;;
import HelpSupportModal from &apos;../modals/HelpSupportModal&apos;;
import ProposeTradeModal from &apos;../modals/ProposeTradeModal&apos;;
import AssignAwardsModal from &apos;../modals/AssignAwardsModal&apos;;
import EditTeamBrandingModal from &apos;../modals/EditTeamBrandingModal&apos;;
import ShareTeamCardModal from &apos;../modals/ShareTeamCardModal&apos;;
import ChecklistReportModal from &apos;../modals/ChecklistReportModal&apos;;

export const ModalManager: React.FC = () => {
}
  const { activeModal, closeModal, modalData } = useModal();
  const { state } = useAppState();

  if (!activeModal) return null;

  const renderModal = () => {
}
    switch (activeModal) {
}
      case &apos;settings&apos;:
        return (
          <SettingsModal>
            isOpen={true} 
            onClose={closeModal} 
          />
        );
      
      case &apos;profile&apos;:
        return (
          <ProfileModal>
            isOpen={true} 
            onClose={closeModal}
            user={state.user}
          />
        );
      
      case &apos;analytics&apos;:
        return (
          <AnalyticsModal>
            isOpen={true} 
            onClose={closeModal} 
          />
        );
      
      case &apos;help&apos;:
        return (
          <HelpSupportModal>
            isOpen={true} 
            onClose={closeModal} 
          />
        );
      
      case &apos;trade&apos;:
        return (
          <ProposeTradeModal>
            isOpen={true} 
            onClose={closeModal}
            {...(modalData || {})}
          />
        );
      
      case &apos;assign-awards&apos;:
        return (
          <AssignAwardsModal>
            isOpen={true} 
            onClose={closeModal}
            {...(modalData || {})}
          />
        );
      
      case &apos;edit-branding&apos;:
        return (
          <EditTeamBrandingModal>
            isOpen={true} 
            onClose={closeModal}
            {...(modalData || {})}
          />
        );
      
      case &apos;share-team&apos;:
        return (
          <ShareTeamCardModal>
            isOpen={true} 
            onClose={closeModal}
            {...(modalData || {})}
          />
        );
      
      case &apos;checklist-report&apos;:
        return (
          <ChecklistReportModal>
            isOpen={true} 
            onClose={closeModal}
            {...(modalData || {})}
          />
        );
      
      default:
        return null;
    }
  };

  return <>{renderModal()}</>;
};

const ModalManagerWithErrorBoundary: React.FC = (props: any) => (
  <ErrorBoundary>
    <ModalManager {...props} />
  </ErrorBoundary>
);

export default React.memo(ModalManagerWithErrorBoundary);