/**
 * Payment Context for Stripe Integration
 * Manages payment state, subscriptions, and transaction history
 */

import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo } from &apos;react&apos;;
import { loadStripe, Stripe } from &apos;@stripe/stripe-js&apos;;

// Initialize Stripe
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY || &apos;&apos;);

// Payment types
export interface PaymentProduct {
}
  id: string;
  name: string;
  price: number;
  currency: string;
  type: &apos;one_time&apos; | &apos;subscription&apos;;
  interval?: &apos;month&apos; | &apos;year&apos;;
  description: string;

}

export interface PaymentIntent {
}
  id: string;
  amount: number;
  currency: string;
  status: string;
  clientSecret: string;

}

export interface UserSubscription {
}
  id: string;
  productId: string;
  status: &apos;active&apos; | &apos;canceled&apos; | &apos;past_due&apos; | &apos;trialing&apos;;
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;

}

export interface PaymentHistory {
}
  id: string;
  amount: number;
  currency: string;
  status: &apos;succeeded&apos; | &apos;pending&apos; | &apos;failed&apos; | &apos;refunded&apos;;
  type: &apos;contest_entry&apos; | &apos;subscription&apos; | &apos;one_time&apos;;
  productId: string;
  createdAt: Date;

}

interface PaymentContextType {
}
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
}
  const context = useContext(PaymentContext);
  if (!context) {
}
    throw new Error(&apos;usePayment must be used within a PaymentProvider&apos;);

  return context;
};

interface PaymentProviderProps {
}
  children: ReactNode;

}

export const PaymentProvider: React.FC<PaymentProviderProps> = ({ children }: any) => {
}
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
}
    const initializeStripe = async () => {
}
      try {
}

        const stripeInstance = await stripePromise;
        setStripe(stripeInstance);

    } catch (error) {
}

    };

    initializeStripe();
  }, []);

  // Load payment products
  useEffect(() => {
}
    const loadProducts = async () => {
}
      try {
}

        setIsLoadingProducts(true);
        const response = await fetch(&apos;/api/payment/products&apos;);
        const data = await response.json();
        
        if (data.success) {
}
          setProducts(data.data.products);

    } catch (error) {
}
      } finally {
}
        setIsLoadingProducts(false);

    };

    loadProducts();
  }, []);

  // Create contest entry payment
  const createContestEntryPayment = async (contestId: string, entryType: string): Promise<PaymentIntent> => {
}
    try {
}
      setIsProcessingPayment(true);
      
      const response = await fetch(&apos;/api/payment/contest-entry&apos;, {
}
        method: &apos;POST&apos;,
        headers: {
}
          &apos;Content-Type&apos;: &apos;application/json&apos;,
          &apos;Authorization&apos;: `Bearer ${localStorage.getItem(&apos;token&apos;)}`
        },
        body: JSON.stringify({ contestId, entryType })
      });

      const data = await response.json();
      
      if (!data.success) {
}
        throw new Error(data.error || &apos;Failed to create payment intent&apos;);

      const paymentIntent = data.data.paymentIntent;
      setCurrentPaymentIntent(paymentIntent);
      
      return paymentIntent;

    `Bearer ${localStorage.getItem(&apos;token&apos;)}`
        },
        body: JSON.stringify({ subscriptionType, trialDays })
      });

      const data = await response.json();
      
      if (!data.success) {
}
        throw new Error(data.error || &apos;Failed to create subscription&apos;);

      // Refresh subscriptions
      await refreshSubscriptions();
      
      return data.data;

    `/api/payment/subscription/${subscriptionId}/cancel`, {
}
        method: &apos;PUT&apos;,
        headers: {
}
          &apos;Content-Type&apos;: &apos;application/json&apos;,
          &apos;Authorization&apos;: `Bearer ${localStorage.getItem(&apos;token&apos;)}`
        },
        body: JSON.stringify({ immediate })
      });

      const data = await response.json();
      
      if (!data.success) {
}
        throw new Error(data.error || &apos;Failed to cancel subscription&apos;);

      // Refresh subscriptions
      await refreshSubscriptions();

    `Bearer ${localStorage.getItem(&apos;token&apos;)}`

      });

      const data = await response.json();
      
      if (data.success) {
}
        setSubscriptions(data.data.subscriptions.map((sub: any) => ({
}
          ...sub,
          currentPeriodStart: new Date(sub.currentPeriodStart),
          currentPeriodEnd: new Date(sub.currentPeriodEnd)
        })));

    `Bearer ${localStorage.getItem(&apos;token&apos;)}`

      });

      const data = await response.json();
      
      if (data.success) {
}
        setPaymentHistory(data.data.payments.map((payment: any) => ({
}
          ...payment,
          createdAt: new Date(payment.createdAt)
        })));

    } catch (error) {
}
    } finally {
}
      setIsLoadingHistory(false);

  };

  // Load user data on mount
  useEffect(() => {
}
    const token = localStorage.getItem(&apos;token&apos;);
    if (token) {
}
      refreshSubscriptions();
      refreshPaymentHistory();
    }
  }, []);

  // Premium feature checks
  const hasActivePremium = (): boolean => {
}
    return subscriptions.some((sub: any) => 
      sub.productId === &apos;oracle_premium&apos; && 
      sub.status === &apos;active&apos; && 
      new Date() < sub.currentPeriodEnd
    );
  };

  const hasActiveAnalytics = (): boolean => {
}
    return subscriptions.some((sub: any) => 
      (sub.productId === &apos;analytics_pro&apos; || sub.productId === &apos;oracle_ultimate&apos;) && 
      sub.status === &apos;active&apos; && 
      new Date() < sub.currentPeriodEnd
    );
  };

  const hasActiveUltimate = (): boolean => {
}
    return subscriptions.some((sub: any) => 
      sub.productId === &apos;oracle_ultimate&apos; && 
      sub.status === &apos;active&apos; && 
      new Date() < sub.currentPeriodEnd
    );
  };

  const canAccessPremiumFeature = (feature: string): boolean => {
}
    switch (feature) {
}
      case &apos;advanced_predictions&apos;:
      case &apos;prediction_insights&apos;:
        return hasActivePremium() || hasActiveUltimate();
      
      case &apos;detailed_analytics&apos;:
      case &apos;performance_tracking&apos;:
        return hasActiveAnalytics() || hasActiveUltimate();
      
      case &apos;priority_support&apos;:
      case &apos;exclusive_content&apos;:
        return hasActiveUltimate();
      
      default:
        return false;

  };

  const value: PaymentContextType = useMemo(() => ({
}
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
