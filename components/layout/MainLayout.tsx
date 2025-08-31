
import { ErrorBoundary } from '../ui/ErrorBoundary';
import React from 'react';
import Header from '../core/Header';
import Breadcrumbs from '../core/Breadcrumbs';
import MobileNavigation from './MobileNavigation';

interface MainLayoutProps {
    children: React.ReactNode;

}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
    return (
        <>
            <Header />
            <MobileNavigation />
            <main className="flex-grow pt-24 sm:px-4 md:px-6 lg:px-8">
                <Breadcrumbs />
                {children}
            </main>
        </>
    );
};

const MainLayoutWithErrorBoundary: React.FC = (props) => (
  <ErrorBoundary>
    <MainLayout {...props} />
  </ErrorBoundary>
);

export default React.memo(MainLayoutWithErrorBoundary);
