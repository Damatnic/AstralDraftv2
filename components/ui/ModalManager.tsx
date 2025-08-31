/**
 * Modal Manager - Centralized modal rendering system
 * Handles all application modals in one place
 */

import { ErrorBoundary } from './ErrorBoundary';
import React from 'react';
import { useModal } from '../../contexts/ModalContext';
import { useAppState } from '../../contexts/AppContext';

// Import all modal components
import SettingsModal from '../modals/SettingsModal';
import ProfileModal from '../modals/ProfileModal';
import AnalyticsModal from '../modals/AnalyticsModal';
import HelpSupportModal from '../modals/HelpSupportModal';
import ProposeTradeModal from '../modals/ProposeTradeModal';
import AssignAwardsModal from '../modals/AssignAwardsModal';
import EditTeamBrandingModal from '../modals/EditTeamBrandingModal';
import ShareTeamCardModal from '../modals/ShareTeamCardModal';
import ChecklistReportModal from '../modals/ChecklistReportModal';

export const ModalManager: React.FC = () => {
  const { activeModal, closeModal, modalData } = useModal();
  const { state } = useAppState();

  if (!activeModal) return null;

  const renderModal = () => {
    switch (activeModal) {
      case 'settings':
        return (
          <SettingsModal 
            isOpen={true} 
            onClose={closeModal} 
          />
        );
      
      case 'profile':
        return (
          <ProfileModal 
            isOpen={true} 
            onClose={closeModal}
            user={state.user}
          />
        );
      
      case 'analytics':
        return (
          <AnalyticsModal 
            isOpen={true} 
            onClose={closeModal} 
          />
        );
      
      case 'help':
        return (
          <HelpSupportModal 
            isOpen={true} 
            onClose={closeModal} 
          />
        );
      
      case 'trade':
        return (
          <ProposeTradeModal 
            isOpen={true} 
            onClose={closeModal}
            {...(modalData || {})}
          />
        );
      
      case 'assign-awards':
        return (
          <AssignAwardsModal 
            isOpen={true} 
            onClose={closeModal}
            {...(modalData || {})}
          />
        );
      
      case 'edit-branding':
        return (
          <EditTeamBrandingModal 
            isOpen={true} 
            onClose={closeModal}
            {...(modalData || {})}
          />
        );
      
      case 'share-team':
        return (
          <ShareTeamCardModal 
            isOpen={true} 
            onClose={closeModal}
            {...(modalData || {})}
          />
        );
      
      case 'checklist-report':
        return (
          <ChecklistReportModal 
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

const ModalManagerWithErrorBoundary: React.FC = (props) => (
  <ErrorBoundary>
    <ModalManager {...props} />
  </ErrorBoundary>
);

export default React.memo(ModalManagerWithErrorBoundary);