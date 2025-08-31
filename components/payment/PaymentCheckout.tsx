/**
 * Payment Checkout Component
 * Handles Stripe payment processing for contest entries and subscriptions
 */

import React, { useCallback, useState, useEffect, useMemo } from 'react';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { usePayment } from '../../contexts/PaymentContext';

// Checkout form component
const CheckoutForm: React.FC<{
  paymentType: 'contest' | 'subscription';
  onSuccess: () => void;
  onError: (error: string) => void;
}> = ({ paymentType, onSuccess, onError }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string>('');

  const getButtonText = useMemo(() => {
    return paymentType === 'contest' ? 'Pay Contest Entry Fee' : 'Start Subscription';
  }, [paymentType]);

  const handleSubmit = async () => {
    try {

    event.preventDefault();

    if (!stripe || !elements) {
      return;
    
    } catch (error) {
      console.error('Error in handleSubmit:', error);

    } catch (error) {
        console.error(error);
    }setIsLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/payment/success`,
      },
    });

    if (error) {
      if (error.type === 'card_error' || error.type === 'validation_error') {
        setMessage(error.message || 'Payment failed');
        onError(error.message || 'Payment failed');
      } else {
        setMessage('An unexpected error occurred.');
        onError('An unexpected error occurred.');

    } else {
      onSuccess();

    setIsLoading(false);
  };

  const paymentElementOptions = {
    layout: 'tabs' as const,
  };

  return (
    <form id="payment-form" onSubmit={handleSubmit}
      <PaymentElement id="payment-element" options={paymentElementOptions} />
      
      <button
        disabled={isLoading || !stripe || !elements}
        id="submit"
        className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
          isLoading || !stripe || !elements
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-blue-600 text-white hover:bg-blue-700'
        }`}
       aria-label="Action button">
        <span id="button-text">
          {isLoading ? (
            <div className="flex items-center justify-center sm:px-4 md:px-6 lg:px-8">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2 sm:px-4 md:px-6 lg:px-8"></div>
              Processing...
            </div>
          ) : (
            getButtonText
          )}
        </span>
      </button>
      
      {message && (
        <div className="text-red-600 text-sm mt-2 sm:px-4 md:px-6 lg:px-8">
          {message}
        </div>
      )}
    </form>
  );
};

// Contest entry payment component
export const ContestEntryPayment: React.FC<{
  contestId: string;
  entryType: 'CONTEST_ENTRY_SMALL' | 'CONTEST_ENTRY_MEDIUM' | 'CONTEST_ENTRY_LARGE';
  onSuccess: () => void;
  onCancel: () => void;
}> = ({ contestId, entryType, onSuccess, onCancel }) => {
  const { stripe, products, createContestEntryPayment } = usePayment();
  const [clientSecret, setClientSecret] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const product = products[entryType];

  useEffect(() => {
    const initializePayment = async () => {
      try {

        setIsLoading(true);
        const paymentIntent = await createContestEntryPayment(contestId, entryType);
        setClientSecret(paymentIntent.clientSecret);
      
    } catch (error) {
        setError(error instanceof Error ? error.message : 'Failed to initialize payment');
      } finally {
        setIsLoading(false);

    };

    initializePayment();
  }, [contestId, entryType, createContestEntryPayment]);

  if (isLoading && !clientSecret) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-md mx-auto sm:px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-center py-8 sm:px-4 md:px-6 lg:px-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 sm:px-4 md:px-6 lg:px-8"></div>
          <span className="ml-2 text-gray-600 sm:px-4 md:px-6 lg:px-8">Initializing payment...</span>
        </div>
      </div>
    );

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-md mx-auto sm:px-4 md:px-6 lg:px-8">
        <div className="text-center sm:px-4 md:px-6 lg:px-8">
          <div className="text-red-600 mb-4 sm:px-4 md:px-6 lg:px-8">❌ Payment Error</div>
          <p className="text-gray-600 mb-4 sm:px-4 md:px-6 lg:px-8">{error}</p>
          <button
            onClick={onCancel}
            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 sm:px-4 md:px-6 lg:px-8"
           aria-label="Action button">
            Close
          </button>
        </div>
      </div>
    );

  const stripeOptions = {
    clientSecret,
    appearance: {
      theme: 'stripe' as const,
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
        <Elements options={stripeOptions} stripe={stripe}>
          <CheckoutForm
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
          Cancel
        </button>
      </div>
    </div>
  );
};

// Subscription payment component
export const SubscriptionPayment: React.FC<{
  subscriptionType: 'ORACLE_PREMIUM' | 'ANALYTICS_PRO' | 'ORACLE_ULTIMATE';
  trialDays?: number;
  onSuccess: () => void;
  onCancel: () => void;
}> = ({ subscriptionType, trialDays = 7, onSuccess, onCancel }) => {
  const { products, createSubscription } = usePayment();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const product = products[subscriptionType];

  const handleSubscriptionCreation = async () => {
    try {

      setIsLoading(true);
      await createSubscription(subscriptionType, trialDays);
      onSuccess();
    finally {
      setIsLoading(false);

    `w-full py-3 px-4 rounded-lg font-medium transition-colors ${
            isLoading
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
         aria-label="Action button">
          {isLoading ? (
            <div className="flex items-center justify-center sm:px-4 md:px-6 lg:px-8">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2 sm:px-4 md:px-6 lg:px-8"></div>
              Creating subscription...
            </div>
          ) : (
            (() => {
              const buttonText = trialDays > 0 ? 'Free Trial' : 'Subscription';
              return `Start ${buttonText}`;
            })()
          )}
        </button>

        <button
          onClick={onCancel}
          className="w-full py-2 px-4 text-gray-500 hover:text-gray-700 text-sm sm:px-4 md:px-6 lg:px-8"
         aria-label="Action button">
          Cancel
        </button>
      </div>

      <div className="mt-6 text-xs text-gray-500 text-center sm:px-4 md:px-6 lg:px-8">
        <p>You can cancel anytime. No commitments.</p>
        {trialDays > 0 && (
          <p className="mt-1 sm:px-4 md:px-6 lg:px-8">
            Trial ends in {trialDays} days. You won't be charged until then.
          </p>
        )}
      </div>
    </div>
  );
};

// Payment success component
export const PaymentSuccess: React.FC<{
  type: 'contest' | 'subscription';
  onClose: () => void;
}> = ({ type, onClose }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-md mx-auto sm:px-4 md:px-6 lg:px-8">
      <div className="text-center sm:px-4 md:px-6 lg:px-8">
        <div className="text-green-600 text-4xl mb-4 sm:px-4 md:px-6 lg:px-8">✅</div>
        <h3 className="text-xl font-bold text-gray-900 mb-2 sm:px-4 md:px-6 lg:px-8">
          Payment Successful!
        </h3>
        <p className="text-gray-600 mb-6 sm:px-4 md:px-6 lg:px-8">
          {type === 'contest' 
            ? 'You have successfully entered the contest. Good luck!'
            : 'Your subscription has been activated. Enjoy your premium features!'

        </p>
        <button
          onClick={onClose}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 sm:px-4 md:px-6 lg:px-8"
         aria-label="Action button">
          Continue
        </button>
      </div>
    </div>
  );
};
