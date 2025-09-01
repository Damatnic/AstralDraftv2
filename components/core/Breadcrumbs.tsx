
import { ErrorBoundary } from &apos;../ui/ErrorBoundary&apos;;
import React, { useMemo } from &apos;react&apos;;
import { useAppState } from &apos;../../contexts/AppContext&apos;;
import { View } from &apos;../../types&apos;;

const viewHierarchy: { [key in View]?: { parent: View, name: string } } = {
}
    LEAGUE_HUB: { parent: &apos;DASHBOARD&apos;, name: &apos;League Hub&apos; },
    TEAM_HUB: { parent: &apos;LEAGUE_HUB&apos;, name: &apos;Team Hub&apos; },
    LEAGUE_STANDINGS: { parent: &apos;LEAGUE_HUB&apos;, name: &apos;Standings&apos; },
    COMMISSIONER_TOOLS: { parent: &apos;LEAGUE_HUB&apos;, name: &apos;Commissioner Tools&apos; },
    EDIT_LEAGUE_SETTINGS: { parent: &apos;COMMISSIONER_TOOLS&apos;, name: &apos;Edit Settings&apos; },
};

const viewNames: { [key in View]?: string } = {
}
    DASHBOARD: &apos;Dashboard&apos;,
};

const Breadcrumbs: React.FC = () => {
}
    const { state, dispatch } = useAppState();
    const { currentView } = state;

    const buildBreadcrumbs = () => {
}
        const crumbs: { name: string, view: View }[] = [];
        let view: View | undefined = currentView;

        while(view) {
}
            const hierarchy: { parent: View, name: string } | undefined = viewHierarchy[view];
            const name = hierarchy?.name || viewNames[view] || view.replace(/_/g, &apos; &apos;);
            crumbs.unshift({ name, view });
            view = hierarchy?.parent;

        return crumbs;

    const breadcrumbs = buildBreadcrumbs();

    if (breadcrumbs.length <= 1) {
}
        return null; // Don&apos;t show on top-level views

    return (
        <nav className="px-8 pb-4 text-sm text-gray-400 flex items-center gap-2 sm:px-4 md:px-6 lg:px-8">
           {breadcrumbs.map((crumb, index) => (
}
               <React.Fragment key={index}>
                   {index > 0 && <span>/</span>}
                   <button
                       onClick={() => dispatch({ type: &apos;SET_VIEW&apos;, payload: crumb.view }}
                       className={`hover:text-white ${index === breadcrumbs.length - 1 ? &apos;font-bold text-white&apos; : &apos;&apos;}`}
                   >
                       {crumb.name}
                   </button>
               </React.Fragment>
           ))}
        </nav>
    );
};

const BreadcrumbsWithErrorBoundary: React.FC = (props: any) => (
  <ErrorBoundary>
    <Breadcrumbs {...props} />
  </ErrorBoundary>
);

export default React.memo(BreadcrumbsWithErrorBoundary);
