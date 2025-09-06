/**
 * Payment Context for Stripe Integration
 * Manages payment state, subscriptions, and transaction history
 */

import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';
import { loadStripe, Stripe } from '@stripe/stripe-js';

// Initialize Stripe
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY || '');

// Payment types
export interface PaymentProduct {
  id: string;
  name: string;
  price: number;
  currency: string;
  type: 'one_time' | 'subscription';
  interval?: 'month' | 'year';
  description: string;


export interface PaymentIntent {
  id: string;
  amount: number;
  currency: string;
  status: string;
  clientSecret: string;


export interface UserSubscription {
  id: string;
  productId: string;
  status: 'active' | 'canceled' | 'past_due' | 'trialing';
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
}

export interface PaymentHistory {
  id: string;
  amount: number;
  currency: string;
  status: 'succeeded' | 'pending' | 'failed' | 'refunded';
  type: 'contest_entry' | 'subscription' | 'one_time';
  productId: string;
  createdAt: Date;
}

interface PaymentContextType {
  // Stripe instance
  stripe: Stripe | null;
  
  // Payment products
  products: Record<string, PaymentProduct>;
  isLoadingProducts: boolean;
  
  // User subscriptions
  subscriptions: UserSubscription[];
  isLoadingSubscriptions: boolean;
  
  // Payment history
  paymentHistory: PaymentHistory[];
  isLoadingHistory: boolean;
  
  // Current payment state
  currentPaymentIntent: PaymentIntent | null;
  isProcessingPayment: boolean;
  
  // Methods
  createContestEntryPayment: (contestId: string, entryType: string) => Promise<PaymentIntent>;
  createSubscription: (subscriptionType: string, trialDays?: number) => Promise<any>;
  cancelSubscription: (subscriptionId: string, immediate?: boolean) => Promise<void>;
  refreshSubscriptions: () => Promise<void>;
  refreshPaymentHistory: () => Promise<void>;
  
  // Premium feature checks
  hasActivePremium: () => boolean;
  hasActiveAnalytics: () => boolean;
  hasActiveUltimate: () => boolean;
  canAccessPremiumFeature: (feature: string) => boolean;}

const PaymentContext = createContext<PaymentContextType | undefined>(undefined);

export const usePayment = () => {
  const context = useContext(PaymentContext);
  if (!context) {
    throw new Error('usePayment must be used within a PaymentProvider');

  return context;
};

interface PaymentProviderProps {
  children: ReactNode;
}

export const PaymentProvider: React.FC<PaymentProviderProps> = ({ children }: any) => {
  // Stripe instance
  const [stripe, setStripe] = useState<Stripe | null>(null);
  
  // Payment products
  const [products, setProducts] = useState<Record<string, PaymentProduct>>({});
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  
  // User subscriptions
  const [subscriptions, setSubscriptions] = useState<UserSubscription[]>([]);
  const [isLoadingSubscriptions, setIsLoadingSubscriptions] = useState(false);
  
  // Payment history
  const [paymentHistory, setPaymentHistory] = useState<PaymentHistory[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  
  // Current payment state
  const [currentPaymentIntent, setCurrentPaymentIntent] = useState<PaymentIntent | null>(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  // Initialize Stripe
  useEffect(() => {
    const initializeStripe = async () => {
      try {

        const stripeInstance = await stripePromise;
        setStripe(stripeInstance);

    } catch (error) {

    };

    initializeStripe();
  }, []);

  // Load payment products
  useEffect(() => {
    const loadProducts = async () => {
      try {

        setIsLoadingProducts(true);
        const response = await fetch('/api/payment/products');
        const data = await response.json();
        
        if (data.success) {
          setProducts(data.data.products);

    } catch (error) {
      } finally {
        setIsLoadingProducts(false);

    };

    loadProducts();
  }, []);

  // Create contest entry payment
  const createContestEntryPayment = async (contestId: string, entryType: string): Promise<PaymentIntent> => {
    try {
      setIsProcessingPayment(true);
      
      const response = await fetch('/api/payment/contest-entry', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ contestId, entryType })
      });

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to create payment intent');

      const paymentIntent = data.data.paymentIntent;
      setCurrentPaymentIntent(paymentIntent);
      
      return paymentIntent;

    `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ subscriptionType, trialDays })
      });

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to create subscription');

      // Refresh subscriptions
      await refreshSubscriptions();
      
      return data.data;

    `/api/payment/subscription/${subscriptionId}/cancel`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ immediate })
      });

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to cancel subscription');

      // Refresh subscriptions
      await refreshSubscriptions();

    `Bearer ${localStorage.getItem('token')}`

      });

      const data = await response.json();
      
      if (data.success) {
        setSubscriptions(data.data.subscriptions.map((sub: any) => ({
          ...sub,
          currentPeriodStart: new Date(sub.currentPeriodStart),
          currentPeriodEnd: new Date(sub.currentPeriodEnd)
        })));

    `Bearer ${localStorage.getItem('token')}`

      });

      const data = await response.json();
      
      if (data.success) {
        setPaymentHistory(data.data.payments.map((payment: any) => ({
          ...payment,
          createdAt: new Date(payment.createdAt)
        })));

    } catch (error) {
    } finally {
      setIsLoadingHistory(false);

  };

  // Load user data on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      refreshSubscriptions();
      refreshPaymentHistory();
    }
  }, []);

  // Premium feature checks
  const hasActivePremium = (): boolean => {
    return subscriptions.some((sub: any) => 
      sub.productId === 'oracle_premium' && 
      sub.status === 'active' && 
      new Date() < sub.currentPeriodEnd
    );
  };

  const hasActiveAnalytics = (): boolean => {
    return subscriptions.some((sub: any) => 
      (sub.productId === 'analytics_pro' || sub.productId === 'oracle_ultimate') && 
      sub.status === 'active' && 
      new Date() < sub.currentPeriodEnd
    );
  };

  const hasActiveUltimate = (): boolean => {
    return subscriptions.some((sub: any) => 
      sub.productId === 'oracle_ultimate' && 
      sub.status === 'active' && 
      new Date() < sub.currentPeriodEnd
    );
  };

  const canAccessPremiumFeature = (feature: string): boolean => {
    switch (feature) {
      case 'advanced_predictions':
      case 'prediction_insights':
        return hasActivePremium() || hasActiveUltimate();
      
      case 'detailed_analytics':
      case 'performance_tracking':
        return hasActiveAnalytics() || hasActiveUltimate();
      
      case 'priority_support':
      case 'exclusive_content':
        return hasActiveUltimate();
      
      default:
        return false;

  };

  const value: PaymentContextType = useMemo(() => ({
    stripe,
    products,
    isLoadingProducts,
    subscriptions,
    isLoadingSubscriptions,
    paymentHistory,
    isLoadingHistory,
    currentPaymentIntent,
    isProcessingPayment,
    createContestEntryPayment,
    createSubscription,
    cancelSubscription,
    refreshSubscriptions,
    refreshPaymentHistory,
    hasActivePremium,
    hasActiveAnalytics,
    hasActiveUltimate,
//     canAccessPremiumFeature
  }), [
    stripe,
    products,
    isLoadingProducts,
    subscriptions,
    isLoadingSubscriptions,
    paymentHistory,
    isLoadingHistory,
    currentPaymentIntent,
//     isProcessingPayment
  ]);

  return (
    <PaymentContext.Provider value={value}>
      {children}
    </PaymentContext.Provider>
  );
};
