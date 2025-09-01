/**
 * Crisis Intervention Widget
 * Provides immediate access to mental health crisis resources and support
 * Follows best practices for crisis intervention UI design
 */

import { ErrorBoundary } from &apos;../ui/ErrorBoundary&apos;;
import React, { useCallback, useMemo, useState, useEffect } from &apos;react&apos;;
import { AlertTriangleIcon } from &apos;../icons/AlertTriangleIcon&apos;;
import { PhoneIcon } from &apos;../icons/PhoneIcon&apos;;
import { MessageCircleIcon } from &apos;../icons/MessageCircleIcon&apos;;
import { HeartIcon } from &apos;../icons/HeartIcon&apos;;
import { GlobeIcon } from &apos;../icons/GlobeIcon&apos;;

interface CrisisResource {
}
  name: string;
  number?: string;
  textNumber?: string;
  website?: string;
  description: string;
  hours: string;
  type: &apos;phone&apos; | &apos;text&apos; | &apos;both&apos; | &apos;web&apos;;
  priority: &apos;immediate&apos; | &apos;urgent&apos; | &apos;support&apos;;

}

const crisisResources: CrisisResource[] = [
  {
}
  const [isLoading, setIsLoading] = React.useState(false);
    name: &apos;988 Suicide & Crisis Lifeline&apos;,
    number: &apos;988&apos;,
    textNumber: &apos;988&apos;,
    website: &apos;https://988lifeline.org&apos;,
    description: &apos;Free, confidential crisis support 24/7 for anyone in suicidal crisis or emotional distress&apos;,
    hours: &apos;24/7&apos;,
    type: &apos;both&apos;,
    priority: &apos;immediate&apos;
  },
  {
}
    name: &apos;Crisis Text Line&apos;,
    textNumber: &apos;741741&apos;,
    website: &apos;https://www.crisistextline.org&apos;,
    description: &apos;Text HOME to connect with a crisis counselor&apos;,
    hours: &apos;24/7&apos;,
    type: &apos;text&apos;,
    priority: &apos;immediate&apos;
  },
  {
}
    name: &apos;SAMHSA National Helpline&apos;,
    number: &apos;1-800-662-4357&apos;,
    website: &apos;https://www.samhsa.gov/find-help/national-helpline&apos;,
    description: &apos;Treatment referral and information service for mental health and substance use disorders&apos;,
    hours: &apos;24/7&apos;,
    type: &apos;phone&apos;,
    priority: &apos;urgent&apos;
  },
  {
}
    name: &apos;Veterans Crisis Line&apos;,
    number: &apos;1-800-273-8255&apos;,
    textNumber: &apos;838255&apos;,
    website: &apos;https://www.veteranscrisisline.net&apos;,
    description: &apos;Support for Veterans and their loved ones&apos;,
    hours: &apos;24/7&apos;,
    type: &apos;both&apos;,
    priority: &apos;immediate&apos;
  },
  {
}
    name: &apos;LGBTQ National Hotline&apos;,
    number: &apos;1-888-843-4564&apos;,
    website: &apos;https://www.lgbthotline.org&apos;,
    description: &apos;Support for LGBTQ individuals&apos;,
    hours: &apos;1pm-9pm PST&apos;,
    type: &apos;phone&apos;,
    priority: &apos;support&apos;
  },
  {
}
    name: &apos;NAMI HelpLine&apos;,
    number: &apos;1-800-950-6264&apos;,
    website: &apos;https://www.nami.org/help&apos;,
    description: &apos;National Alliance on Mental Illness support and resources&apos;,
    hours: &apos;Mon-Fri 10am-10pm ET&apos;,
    type: &apos;phone&apos;,
    priority: &apos;support&apos;
  },
  {
}
    name: &apos;International Crisis Lines&apos;,
    website: &apos;https://findahelpline.com&apos;,
    description: &apos;Find crisis support in your country&apos;,
    hours: &apos;Varies by location&apos;,
    type: &apos;web&apos;,
    priority: &apos;support&apos;

];

export const CrisisInterventionWidget: React.FC = () => {
}
  const [isExpanded, setIsExpanded] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [lastInteraction, setLastInteraction] = useState<Date | null>(null);

  // Track user interaction for analytics (privacy-focused)
  useEffect(() => {
}
    if (isExpanded) {
}
      setLastInteraction(new Date());
      // Log anonymous usage for improvement purposes
    }
  }, [isExpanded]);

  const handleResourceClick = (resource: CrisisResource, action: &apos;call&apos; | &apos;text&apos; | &apos;web&apos;) => {
}
    setShowConfirmation(true);
    setTimeout(() => setShowConfirmation(false), 3000);

    // Track which type of resource was accessed (no personal data)
  };

  const getPriorityColor = (priority: string) => {
}
    switch (priority) {
}
      case &apos;immediate&apos;:
        return &apos;bg-red-50 border-red-200&apos;;
      case &apos;urgent&apos;:
        return &apos;bg-orange-50 border-orange-200&apos;;
      default:
        return &apos;bg-blue-50 border-blue-200&apos;;

  };

  const getPriorityBadge = (priority: string) => {
}
    switch (priority) {
}
      case &apos;immediate&apos;:
        return &apos;bg-red-100 text-red-800&apos;;
      case &apos;urgent&apos;:
        return &apos;bg-orange-100 text-orange-800&apos;;
      default:
        return &apos;bg-blue-100 text-blue-800&apos;;

  };

  return (
    <>
      {/* Floating Crisis Button - Always Visible */}
      <div className="fixed bottom-20 right-4 z-50 sm:px-4 md:px-6 lg:px-8">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2 group sm:px-4 md:px-6 lg:px-8"
          aria-label="Crisis Support Resources"
        >
          <HeartIcon className="w-5 h-5 sm:px-4 md:px-6 lg:px-8" />
          <span className="hidden group-hover:inline text-sm font-medium pr-1 sm:px-4 md:px-6 lg:px-8">
            Crisis Support
          </span>
        </button>
      </div>

      {/* Crisis Resources Modal */}
      {isExpanded && (
}
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 sm:px-4 md:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden sm:px-4 md:px-6 lg:px-8">
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 sm:px-4 md:px-6 lg:px-8">
              <div className="flex items-center justify-between sm:px-4 md:px-6 lg:px-8">
                <div className="flex items-center gap-3 sm:px-4 md:px-6 lg:px-8">
                  <HeartIcon className="w-8 h-8 sm:px-4 md:px-6 lg:px-8" />
                  <div>
                    <h2 className="text-2xl font-bold sm:px-4 md:px-6 lg:px-8">Crisis Support Resources</h2>
                    <p className="text-purple-100 text-sm mt-1 sm:px-4 md:px-6 lg:px-8">
                      You&apos;re not alone. Help is available 24/7.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsExpanded(false)}
                  className="text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-2 transition-colors sm:px-4 md:px-6 lg:px-8"
                  aria-label="Close"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Important Message */}
            <div className="bg-red-50 border-l-4 border-red-500 p-4 sm:px-4 md:px-6 lg:px-8">
              <div className="flex items-start gap-3 sm:px-4 md:px-6 lg:px-8">
                <AlertTriangleIcon className="w-5 h-5 text-red-500 mt-0.5 sm:px-4 md:px-6 lg:px-8" />
                <div>
                  <p className="text-sm font-medium text-red-800 sm:px-4 md:px-6 lg:px-8">
                    If you&apos;re in immediate danger, call 911 or your local emergency services
                  </p>
                </div>
              </div>
            </div>

            {/* Resources List */}
            <div className="p-6 overflow-y-auto max-h-[60vh] sm:px-4 md:px-6 lg:px-8">
              <div className="space-y-4 sm:px-4 md:px-6 lg:px-8">
                {crisisResources.map((resource, index) => (
}
                  <div
                    key={index}
                    className={`border rounded-lg p-4 ${getPriorityColor(resource.priority)} transition-all duration-200 hover:shadow-md`}
                  >
                    <div className="flex items-start justify-between sm:px-4 md:px-6 lg:px-8">
                      <div className="flex-1 sm:px-4 md:px-6 lg:px-8">
                        <div className="flex items-center gap-2 mb-2 sm:px-4 md:px-6 lg:px-8">
                          <h3 className="font-semibold text-gray-900 sm:px-4 md:px-6 lg:px-8">
                            {resource.name}
                          </h3>
                          <span className={`text-xs px-2 py-1 rounded-full ${getPriorityBadge(resource.priority)}`}>
                            {resource.priority === &apos;immediate&apos; ? &apos;24/7 Immediate&apos; : 
}
                             resource.priority === &apos;urgent&apos; ? &apos;Urgent&apos; : &apos;Support&apos;}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-3 sm:px-4 md:px-6 lg:px-8">
                          {resource.description}
                        </p>
                        <div className="flex flex-wrap gap-3 sm:px-4 md:px-6 lg:px-8">
                          {resource.number && (
}
                            <a
                              href={`tel:${resource.number}`}
                              onClick={() => handleResourceClick(resource, &apos;call&apos;)}
                              className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium sm:px-4 md:px-6 lg:px-8"
                            >
                              <PhoneIcon className="w-4 h-4 sm:px-4 md:px-6 lg:px-8" />
                              Call {resource.number}
                            </a>
                          )}
                          {resource.textNumber && (
}
                            <a
                              href={`sms:${resource.textNumber}${resource.textNumber === &apos;741741&apos; ? &apos;&body=HOME&apos; : &apos;&apos;}`}
                              onClick={() => handleResourceClick(resource, &apos;text&apos;)}
                              className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium sm:px-4 md:px-6 lg:px-8"
                            >
                              <MessageCircleIcon className="w-4 h-4 sm:px-4 md:px-6 lg:px-8" />
                              Text {resource.textNumber}
                            </a>
                          )}
                          {resource.website && (
}
                            <a
                              href={resource.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={() => handleResourceClick(resource, &apos;web&apos;)}
                              className="inline-flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium sm:px-4 md:px-6 lg:px-8"
                            >
                              <GlobeIcon className="w-4 h-4 sm:px-4 md:px-6 lg:px-8" />
                              Visit Website
                            </a>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 mt-2 sm:px-4 md:px-6 lg:px-8">
                          Hours: {resource.hours}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Self-Care Resources */}
              <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg sm:px-4 md:px-6 lg:px-8">
                <h3 className="font-semibold text-gray-900 mb-3 sm:px-4 md:px-6 lg:px-8">Self-Care Resources</h3>
                <div className="space-y-2 text-sm text-gray-600 sm:px-4 md:px-6 lg:px-8">
                  <p>• Practice deep breathing exercises</p>
                  <p>• Use grounding techniques (5-4-3-2-1 method)</p>
                  <p>• Reach out to a trusted friend or family member</p>
                  <p>• Consider using mental health apps for daily support</p>
                  <p>• Remember: Seeking help is a sign of strength</p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-gray-50 px-6 py-4 border-t sm:px-4 md:px-6 lg:px-8">
              <p className="text-xs text-gray-500 text-center sm:px-4 md:px-6 lg:px-8">
                All resources are confidential. Your privacy and safety are paramount.
                This app cares about your wellbeing.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Toast */}
      {showConfirmation && (
}
        <div className="fixed top-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in sm:px-4 md:px-6 lg:px-8">
          <p className="text-sm font-medium sm:px-4 md:px-6 lg:px-8">Resource opened. You&apos;re taking a positive step.</p>
        </div>
      )}
    </>
  );
};

// PhoneIcon is imported from ../icons/PhoneIcon

const CrisisInterventionWidgetWithErrorBoundary: React.FC = (props: any) => (
  <ErrorBoundary>
    <CrisisInterventionWidget {...props} />
  </ErrorBoundary>
);

export default React.memo(CrisisInterventionWidgetWithErrorBoundary);