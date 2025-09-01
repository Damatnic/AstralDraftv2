
import { ErrorBoundary } from &apos;../ui/ErrorBoundary&apos;;
import Header from &apos;../core/Header&apos;;
import Breadcrumbs from &apos;../core/Breadcrumbs&apos;;
import MobileNavigation from &apos;./MobileNavigation&apos;;

interface MainLayoutProps {
}
    children: React.ReactNode;

}

const MainLayout: React.FC<MainLayoutProps> = ({ children }: any) => {
}
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

const MainLayoutWithErrorBoundary: React.FC = (props: any) => (
  <ErrorBoundary>
    <MainLayout {...props} />
  </ErrorBoundary>
);

export default React.memo(MainLayoutWithErrorBoundary);
