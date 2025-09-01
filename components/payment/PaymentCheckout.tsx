/**
 * Payment Checkout Component
 * Handles Stripe payment processing for contest entries and subscriptions
 */

import React, { useCallback, useState, useEffect, useMemo } from &apos;react&apos;;
import { Elements, PaymentElement, useStripe, useElements } from &apos;@stripe/react-stripe-js&apos;;
import { usePayment } from &apos;../../contexts/PaymentContext&apos;;

// Checkout form component
const CheckoutForm: React.FC<{
}
  paymentType: &apos;contest&apos; | &apos;subscription&apos;;
  onSuccess: () => void;
  onError: (error: string) => void;
}> = ({ paymentType, onSuccess, onError }: any) => {
}
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string>(&apos;&apos;);

  const getButtonText = useMemo(() => {
}
    return paymentType === &apos;contest&apos; ? &apos;Pay Contest Entry Fee&apos; : &apos;Start Subscription&apos;;
  }, [paymentType]);

  const handleSubmit = async () => {
}
    try {
}

    event.preventDefault();

    if (!stripe || !elements) {
}
      return;
    
    } catch (error) {
}
      console.error(&apos;Error in handleSubmit:&apos;, error);

    } catch (error) {
}
        console.error(error);
    }setIsLoading(true);

    const { error } = await stripe.confirmPayment({
}
      elements,
      confirmParams: {
}
        return_url: `${window.location.origin}/payment/success`,
      },
    });

    if (error) {
}
      if (error.type === &apos;card_error&apos; || error.type === &apos;validation_error&apos;) {
}
        setMessage(error.message || &apos;Payment failed&apos;);
        onError(error.message || &apos;Payment failed&apos;);
      } else {
}
        setMessage(&apos;An unexpected error occurred.&apos;);
        onError(&apos;An unexpected error occurred.&apos;);

    } else {
}
      onSuccess();

    setIsLoading(false);
  };

  const paymentElementOptions = {
}
    layout: &apos;tabs&apos; as const,
  };

  return (
    <form id="payment-form" onSubmit={handleSubmit}
      <PaymentElement id="payment-element" options={paymentElementOptions} />
      
      <button
        disabled={isLoading || !stripe || !elements}
        id="submit"
        className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
}
          isLoading || !stripe || !elements
            ? &apos;bg-gray-300 text-gray-500 cursor-not-allowed&apos;
            : &apos;bg-blue-600 text-white hover:bg-blue-700&apos;
        }`}
       aria-label="Action button">
        <span id="button-text">
          {isLoading ? (
}
            <div className="flex items-center justify-center sm:px-4 md:px-6 lg:px-8">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2 sm:px-4 md:px-6 lg:px-8"></div>
              Processing...
            </div>
          ) : (
//             getButtonText
          )}
        </span>
      </button>
      
      {message && (
}
        <div className="text-red-600 text-sm mt-2 sm:px-4 md:px-6 lg:px-8">
          {message}
        </div>
      )}
    </form>
  );
};

// Contest entry payment component
export const ContestEntryPayment: React.FC<{
}
  contestId: string;
  entryType: &apos;CONTEST_ENTRY_SMALL&apos; | &apos;CONTEST_ENTRY_MEDIUM&apos; | &apos;CONTEST_ENTRY_LARGE&apos;;
  onSuccess: () => void;
  onCancel: () => void;
}> = ({ contestId, entryType, onSuccess, onCancel }: any) => {
}
  const { stripe, products, createContestEntryPayment } = usePayment();
  const [clientSecret, setClientSecret] = useState<string>(&apos;&apos;);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>(&apos;&apos;);

  const product = products[entryType];

  useEffect(() => {
}
    const initializePayment = async () => {
}
      try {
}

        setIsLoading(true);
        const paymentIntent = await createContestEntryPayment(contestId, entryType);
        setClientSecret(paymentIntent.clientSecret);
      
    } catch (error) {
}
        setError(error instanceof Error ? error.message : &apos;Failed to initialize payment&apos;);
      } finally {
}
        setIsLoading(false);

    };

    initializePayment();
  }, [contestId, entryType, createContestEntryPayment]);

  if (isLoading && !clientSecret) {
}
    return (
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-md mx-auto sm:px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-center py-8 sm:px-4 md:px-6 lg:px-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 sm:px-4 md:px-6 lg:px-8"></div>
          <span className="ml-2 text-gray-600 sm:px-4 md:px-6 lg:px-8">Initializing payment...</span>
        </div>
      </div>
    );

  if (error) {
}
    return (
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-md mx-auto sm:px-4 md:px-6 lg:px-8">
        <div className="text-center sm:px-4 md:px-6 lg:px-8">
          <div className="text-red-600 mb-4 sm:px-4 md:px-6 lg:px-8">❌ Payment Error</div>
          <p className="text-gray-600 mb-4 sm:px-4 md:px-6 lg:px-8">{error}</p>
          <button
            onClick={onCancel}
            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 sm:px-4 md:px-6 lg:px-8"
           aria-label="Action button">
//             Close
          </button>
        </div>
      </div>
    );

  const stripeOptions = {
}
    clientSecret,
    appearance: {
}
      theme: &apos;stripe&apos; as const,
    },
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-md mx-auto sm:px-4 md:px-6 lg:px-8">
      <div className="text-center mb-6 sm:px-4 md:px-6 lg:px-8">
        <h3 className="text-xl font-bold text-gray-900 mb-2 sm:px-4 md:px-6 lg:px-8">Contest Entry Payment</h3>
        <p className="text-gray-600 sm:px-4 md:px-6 lg:px-8">{product?.description}</p>
        <div className="text-2xl font-bold text-blue-600 mt-2 sm:px-4 md:px-6 lg:px-8">
          ${(product?.price / 100).toFixed(2)}
        </div>
      </div>

      {clientSecret && stripe && (
}
        <Elements options={stripeOptions} stripe={stripe}>
          <CheckoutForm>
            paymentType="contest"
            onSuccess={onSuccess}
            onError={setError}
          />
        </Elements>
      )}

      <div className="mt-6 text-center sm:px-4 md:px-6 lg:px-8">
        <button
          onClick={onCancel}
          className="text-gray-500 hover:text-gray-700 text-sm sm:px-4 md:px-6 lg:px-8"
         aria-label="Action button">
//           Cancel
        </button>
      </div>
    </div>
  );
};

// Subscription payment component
export const SubscriptionPayment: React.FC<{
}
  subscriptionType: &apos;ORACLE_PREMIUM&apos; | &apos;ANALYTICS_PRO&apos; | &apos;ORACLE_ULTIMATE&apos;;
  trialDays?: number;
  onSuccess: () => void;
  onCancel: () => void;
}> = ({ subscriptionType, trialDays = 7, onSuccess, onCancel }: any) => {
}
  const { products, createSubscription } = usePayment();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>(&apos;&apos;);

  const product = products[subscriptionType];

  const handleSubscriptionCreation = async () => {
}
    try {
}

      setIsLoading(true);
      await createSubscription(subscriptionType, trialDays);
      onSuccess();
  } finally {
}
      setIsLoading(false);

    `w-full py-3 px-4 rounded-lg font-medium transition-colors ${
}
//             isLoading
              ? &apos;bg-gray-300 text-gray-500 cursor-not-allowed&apos;
              : &apos;bg-blue-600 text-white hover:bg-blue-700&apos;
          }`}
         aria-label="Action button">
          {isLoading ? (
}
            <div className="flex items-center justify-center sm:px-4 md:px-6 lg:px-8">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2 sm:px-4 md:px-6 lg:px-8"></div>
              Creating subscription...
            </div>
          ) : (
            (() => {
}
              const buttonText = trialDays > 0 ? &apos;Free Trial&apos; : &apos;Subscription&apos;;
              return `Start ${buttonText}`;
            })()
          )}
        </button>

        <button
          onClick={onCancel}
          className="w-full py-2 px-4 text-gray-500 hover:text-gray-700 text-sm sm:px-4 md:px-6 lg:px-8"
         aria-label="Action button">
//           Cancel
        </button>
      </div>

      <div className="mt-6 text-xs text-gray-500 text-center sm:px-4 md:px-6 lg:px-8">
        <p>You can cancel anytime. No commitments.</p>
        {trialDays > 0 && (
}
          <p className="mt-1 sm:px-4 md:px-6 lg:px-8">
            Trial ends in {trialDays} days. You won&apos;t be charged until then.
          </p>
        )}
      </div>
    </div>
  );
};

// Payment success component
export const PaymentSuccess: React.FC<{
}
  type: &apos;contest&apos; | &apos;subscription&apos;;
  onClose: () => void;
}> = ({ type, onClose }: any) => {
}
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-md mx-auto sm:px-4 md:px-6 lg:px-8">
      <div className="text-center sm:px-4 md:px-6 lg:px-8">
        <div className="text-green-600 text-4xl mb-4 sm:px-4 md:px-6 lg:px-8">✅</div>
        <h3 className="text-xl font-bold text-gray-900 mb-2 sm:px-4 md:px-6 lg:px-8">
          Payment Successful!
        </h3>
        <p className="text-gray-600 mb-6 sm:px-4 md:px-6 lg:px-8">
          {type === &apos;contest&apos; 
}
            ? &apos;You have successfully entered the contest. Good luck!&apos;
            : &apos;Your subscription has been activated. Enjoy your premium features!&apos;

        </p>
        <button
          onClick={onClose}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 sm:px-4 md:px-6 lg:px-8"
         aria-label="Action button">
//           Continue
        </button>
      </div>
    </div>
  );
};
