/**
 * Comprehensive Payment Service with Stripe Integration
 * Handles contest entry fees, premium features, and subscription management
 */

import Stripe from &apos;stripe&apos;;
import { logger } from &apos;./loggingService&apos;;

// Stripe configuration
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || &apos;&apos;, {
}
  apiVersion: &apos;2025-07-30.basil&apos;,
});

// Payment product configurations
export const PAYMENT_PRODUCTS = {
}
  // Contest Entry Fees
  CONTEST_ENTRY_SMALL: {
}
    id: &apos;contest_small&apos;,
    name: &apos;Small Contest Entry&apos;,
    price: 500, // $5.00 in cents
    currency: &apos;usd&apos;,
    type: &apos;one_time&apos; as const,
    description: &apos;Entry fee for small Oracle prediction contests&apos;
  },
  CONTEST_ENTRY_MEDIUM: {
}
    id: &apos;contest_medium&apos;,
    name: &apos;Medium Contest Entry&apos;,
    price: 1500, // $15.00 in cents
    currency: &apos;usd&apos;,
    type: &apos;one_time&apos; as const,
    description: &apos;Entry fee for medium Oracle prediction contests&apos;
  },
  CONTEST_ENTRY_LARGE: {
}
    id: &apos;contest_large&apos;,
    name: &apos;Large Contest Entry&apos;,
    price: 5000, // $50.00 in cents
    currency: &apos;usd&apos;,
    type: &apos;one_time&apos; as const,
    description: &apos;Entry fee for large Oracle prediction contests&apos;
  },
  
  // Premium Subscriptions
  ORACLE_PREMIUM: {
}
    id: &apos;oracle_premium&apos;,
    name: &apos;Oracle Premium&apos;,
    price: 999, // $9.99 in cents
    currency: &apos;usd&apos;,
    type: &apos;subscription&apos; as const,
    interval: &apos;month&apos; as const,
    description: &apos;Premium Oracle features with advanced predictions and insights&apos;
  },
  ANALYTICS_PRO: {
}
    id: &apos;analytics_pro&apos;,
    name: &apos;Analytics Pro&apos;,
    price: 1999, // $19.99 in cents
    currency: &apos;usd&apos;,
    type: &apos;subscription&apos; as const,
    interval: &apos;month&apos; as const,
    description: &apos;Advanced analytics and detailed performance metrics&apos;
  },
  ORACLE_ULTIMATE: {
}
    id: &apos;oracle_ultimate&apos;,
    name: &apos;Oracle Ultimate&apos;,
    price: 2999, // $29.99 in cents
    currency: &apos;usd&apos;,
    type: &apos;subscription&apos; as const,
    interval: &apos;month&apos; as const,
    description: &apos;Complete Oracle suite with all premium features and priority support&apos;
  }
};

// Payment interfaces
export interface PaymentIntent {
}
  id: string;
  amount: number;
  currency: string;
  status: string;
  clientSecret: string;
  metadata: Record<string, string>;
}

export interface SubscriptionPlan {
}
  id: string;
  productId: string;
  priceId: string;
  status: &apos;active&apos; | &apos;canceled&apos; | &apos;past_due&apos; | &apos;trialing&apos;;
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
}

export interface PaymentHistory {
}
  id: string;
  userId: string;
  amount: number;
  currency: string;
  status: &apos;succeeded&apos; | &apos;pending&apos; | &apos;failed&apos; | &apos;refunded&apos;;
  type: &apos;contest_entry&apos; | &apos;subscription&apos; | &apos;one_time&apos;;
  productId: string;
  stripePaymentIntentId: string;
  createdAt: Date;
  updatedAt: Date;
  metadata?: Record<string, unknown>;
}

export interface RefundRequest {
}
  paymentId: string;
  amount?: number; // Partial refund amount, omit for full refund
  reason: &apos;duplicate&apos; | &apos;fraudulent&apos; | &apos;requested_by_customer&apos; | &apos;contest_cancelled&apos;;
  metadata?: Record<string, string>;
}

class PaymentService {
}
  private readonly webhookSecret: string;

  constructor() {
}
    this.webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || &apos;&apos;;
    // Initialize products asynchronously
    setTimeout(() => this.initializeProducts(), 0);
  }

  /**
   * Initialize Stripe products and prices
   */
  private async initializeProducts(): Promise<void> {
}
    try {
}
      logger.info(&apos;🔧 Initializing Stripe products...&apos;);
      
      for (const product of Object.values(PAYMENT_PRODUCTS)) {
}
        await this.ensureProductExists(product);
      }
      
      logger.info(&apos;✅ Stripe products initialized successfully&apos;);
    } catch (error) {
}
      logger.error(&apos;❌ Failed to initialize Stripe products:&apos;, error);
    }
  }

  /**
   * Ensure a product exists in Stripe
   */
  private async ensureProductExists(productConfig: typeof PAYMENT_PRODUCTS[keyof typeof PAYMENT_PRODUCTS]): Promise<void> {
}
    try {
}
      // Check if product exists
      const products = await stripe.products.list({ ids: [productConfig.id] });
      
      let product;
      if (products.data.length === 0) {
}
        // Create product
        product = await stripe.products.create({
}
          id: productConfig.id,
          name: productConfig.name,
          description: productConfig.description,
          type: productConfig.type === &apos;subscription&apos; ? &apos;service&apos; : &apos;good&apos;
        });
        logger.info(`✅ Created Stripe product: ${productConfig.name}`);
      } else {
}
        product = products.data[0];
      }

      // Ensure price exists
      const prices = await stripe.prices.list({ product: product.id });
      
      if (prices.data.length === 0) {
}
        const priceData: Stripe.PriceCreateParams = {
}
          product: product.id,
          unit_amount: productConfig.price,
          currency: productConfig.currency,
        };

        if (productConfig.type === &apos;subscription&apos; && &apos;interval&apos; in productConfig) {
}
          priceData.recurring = { interval: productConfig.interval };
        }

        await stripe.prices.create(priceData);
        logger.info(`✅ Created Stripe price for: ${productConfig.name}`);
      }

    } catch (error) {
}
      logger.error(`❌ Failed to ensure product exists: ${productConfig.name}`, error);
    }
  }

  /**
   * Create payment intent for contest entry
   */
  async createContestEntryPayment(
    userId: string,
    contestId: string,
    entryType: &apos;CONTEST_ENTRY_SMALL&apos; | &apos;CONTEST_ENTRY_MEDIUM&apos; | &apos;CONTEST_ENTRY_LARGE&apos;
  ): Promise<PaymentIntent> {
}
    try {
}
      const product = PAYMENT_PRODUCTS[entryType];
      
      const paymentIntent = await stripe.paymentIntents.create({
}
        amount: product.price,
        currency: product.currency,
        metadata: {
}
          userId,
          contestId,
          productId: product.id,
          type: &apos;contest_entry&apos;
        },
        description: `Contest entry: ${product.name}`,
        automatic_payment_methods: {
}
          enabled: true,
        },
      });

      logger.info(`💳 Created contest entry payment intent for user ${userId}: $${product.price / 100}`);

      return {
}
        id: paymentIntent.id,
        amount: paymentIntent.amount,
        currency: paymentIntent.currency,
        status: paymentIntent.status,
        clientSecret: paymentIntent.client_secret || &apos;&apos;,
        metadata: paymentIntent.metadata
      };

    } catch (error) {
}
      logger.error(&apos;❌ Failed to create contest entry payment:&apos;, error);
      throw new Error(&apos;Failed to create payment intent&apos;);
    }
  }

  /**
   * Create subscription for premium features
   */
  async createSubscription(
    userId: string,
    customerId: string,
    subscriptionType: &apos;ORACLE_PREMIUM&apos; | &apos;ANALYTICS_PRO&apos; | &apos;ORACLE_ULTIMATE&apos;,
    trialDays: number = 7
  ): Promise<Stripe.Subscription> {
}
    try {
}
      const product = PAYMENT_PRODUCTS[subscriptionType];
      
      // Get the price ID for this product
      const prices = await stripe.prices.list({ product: product.id });
      const price = prices.data[0];
      
      if (!price) {
}
        throw new Error(`No price found for product ${product.id}`);
      }

      const subscription = await stripe.subscriptions.create({
}
        customer: customerId,
        items: [{ price: price.id }],
        trial_period_days: trialDays,
        metadata: {
}
          userId,
          productId: product.id,
          type: &apos;subscription&apos;
        },
        expand: [&apos;latest_invoice.payment_intent&apos;],
      });

      logger.info(`🔔 Created subscription for user ${userId}: ${product.name}`);

      return subscription;

    } catch (error) {
}
      logger.error(&apos;❌ Failed to create subscription:&apos;, error);
      throw new Error(&apos;Failed to create subscription&apos;);
    }
  }

  /**
   * Create or retrieve Stripe customer
   */
  async createOrGetCustomer(userId: string, email: string, name?: string): Promise<Stripe.Customer> {
}
    try {
}
      // First, try to find existing customer
      const existingCustomers = await stripe.customers.list({
}
        email: email,
        limit: 1
      });

      if (existingCustomers.data.length > 0) {
}
        const customer = existingCustomers.data[0];
        logger.info(`📋 Found existing Stripe customer for ${email}`);
        return customer;
      }

      // Create new customer
      const customer = await stripe.customers.create({
}
        email,
        name,
        metadata: {
}
          userId: userId
        }
      });

      logger.info(`👤 Created new Stripe customer for ${email}`);
      return customer;

    } catch (error) {
}
      logger.error(&apos;❌ Failed to create/get customer:&apos;, error);
      throw new Error(&apos;Failed to manage customer&apos;);
    }
  }

  /**
   * Process webhook events
   */
  async handleWebhook(payload: string, signature: string): Promise<void> {
}
    try {
}
      const event = stripe.webhooks.constructEvent(payload, signature, this.webhookSecret);

      logger.info(`🔔 Processing Stripe webhook: ${event.type}`);

      switch (event.type) {
}
        case &apos;payment_intent.succeeded&apos;:
          await this.handlePaymentSuccess(event.data.object as Stripe.PaymentIntent);
          break;

        case &apos;payment_intent.payment_failed&apos;:
          await this.handlePaymentFailure(event.data.object as Stripe.PaymentIntent);
          break;

        case &apos;customer.subscription.created&apos;:
        case &apos;customer.subscription.updated&apos;:
          await this.handleSubscriptionUpdate(event.data.object as Stripe.Subscription);
          break;

        case &apos;customer.subscription.deleted&apos;:
          await this.handleSubscriptionCancellation(event.data.object as Stripe.Subscription);
          break;

        case &apos;invoice.payment_succeeded&apos;:
          await this.handleInvoicePaymentSuccess(event.data.object as Stripe.Invoice);
          break;

        case &apos;invoice.payment_failed&apos;:
          await this.handleInvoicePaymentFailure(event.data.object as Stripe.Invoice);
          break;

        default:
          logger.info(`⚠️ Unhandled webhook event type: ${event.type}`);
      }

    } catch (error) {
}
      logger.error(&apos;❌ Webhook processing error:&apos;, error);
      throw error;
    }
  }

  /**
   * Get user&apos;s payment history
   */
  async getPaymentHistory(userId: string, limit: number = 50): Promise<PaymentHistory[]> {
}
    try {
}
      // In a real implementation, this would query your database
      // For now, we&apos;ll fetch from Stripe directly
      const paymentIntents = await stripe.paymentIntents.list({
}
        limit,
        expand: [&apos;data.charges&apos;]
      });

      const userPayments = paymentIntents.data
        .filter((pi: any) => pi.metadata.userId === userId)
        .map((pi: any) => ({
}
          id: pi.id,
          userId: pi.metadata.userId,
          amount: pi.amount,
          currency: pi.currency,
          status: pi.status as PaymentHistory[&apos;status&apos;],
          type: (pi.metadata.type || &apos;one_time&apos;) as PaymentHistory[&apos;type&apos;],
          productId: pi.metadata.productId || &apos;&apos;,
          stripePaymentIntentId: pi.id,
          createdAt: new Date(pi.created * 1000),
          updatedAt: new Date(pi.created * 1000),
          metadata: pi.metadata
        }));

      return userPayments;

    } catch (error) {
}
      logger.error(&apos;❌ Failed to get payment history:&apos;, error);
      throw new Error(&apos;Failed to retrieve payment history&apos;);
    }
  }

  /**
   * Get user&apos;s active subscriptions
   */
  async getUserSubscriptions(customerId: string): Promise<SubscriptionPlan[]> {
}
    try {
}
      const subscriptions = await stripe.subscriptions.list({
}
        customer: customerId,
        status: &apos;all&apos;,
        expand: [&apos;data.items.data.price.product&apos;]
      });

      return subscriptions.data.map((sub: Stripe.Subscription) => ({
}
        id: sub.id,
        productId: sub.metadata.productId || &apos;&apos;,
        priceId: sub.items.data[0].price.id,
        status: sub.status as SubscriptionPlan[&apos;status&apos;],
        currentPeriodStart: new Date(sub.created * 1000), // Use created as fallback
        currentPeriodEnd: new Date((sub.created + 30 * 24 * 60 * 60) * 1000), // 30 days from creation as fallback
        cancelAtPeriodEnd: false // Default to false since cancel_at_period_end isn&apos;t available
      }));

    } catch (error) {
}
      logger.error(&apos;❌ Failed to get user subscriptions:&apos;, error);
      throw new Error(&apos;Failed to retrieve subscriptions&apos;);
    }
  }

  /**
   * Cancel subscription
   */
  async cancelSubscription(subscriptionId: string, immediate: boolean = false): Promise<Stripe.Subscription> {
}
    try {
}
      let subscription;
      
      if (immediate) {
}
        subscription = await stripe.subscriptions.cancel(subscriptionId);
        logger.info(`🗑️ Immediately cancelled subscription: ${subscriptionId}`);
      } else {
}
        subscription = await stripe.subscriptions.update(subscriptionId, {
}
          cancel_at_period_end: true
        });
        logger.info(`📅 Scheduled subscription cancellation: ${subscriptionId}`);
      }

      return subscription;

    } catch (error) {
}
      logger.error(&apos;❌ Failed to cancel subscription:&apos;, error);
      throw new Error(&apos;Failed to cancel subscription&apos;);
    }
  }

  /**
   * Process refund
   */
  async processRefund(refundRequest: RefundRequest): Promise<Stripe.Refund> {
}
    try {
}
      const refundData: Stripe.RefundCreateParams = {
}
        payment_intent: refundRequest.paymentId,
        reason: refundRequest.reason === &apos;contest_cancelled&apos; ? &apos;requested_by_customer&apos; : refundRequest.reason,
        metadata: refundRequest.metadata || {}
      };

      if (refundRequest.amount) {
}
        refundData.amount = refundRequest.amount;
      }

      const refund = await stripe.refunds.create(refundData);

      logger.info(`💰 Processed refund: ${refund.id} for payment ${refundRequest.paymentId}`);

      return refund;

    } catch (error) {
}
      logger.error(&apos;❌ Failed to process refund:&apos;, error);
      throw new Error(&apos;Failed to process refund&apos;);
    }
  }

  /**
   * Get payment analytics
   */
  async getPaymentAnalytics(startDate: Date, endDate: Date): Promise<{
}
    totalRevenue: number;
    subscriptionRevenue: number;
    contestRevenue: number;
    activeSubscriptions: number;
    newSubscriptions: number;
    refundAmount: number;
    paymentsByType: Record<string, number>;
  }> {
}
    try {
}
      const startTimestamp = Math.floor(startDate.getTime() / 1000);
      const endTimestamp = Math.floor(endDate.getTime() / 1000);

      // Fetch payment intents in date range
      const paymentIntents = await stripe.paymentIntents.list({
}
        created: {
}
          gte: startTimestamp,
          lte: endTimestamp
        },
        limit: 1000
      });

      // Fetch subscriptions
      const subscriptions = await stripe.subscriptions.list({
}
        status: &apos;active&apos;,
        limit: 1000
      });

      // Fetch refunds
      const refunds = await stripe.refunds.list({
}
        created: {
}
          gte: startTimestamp,
          lte: endTimestamp
        },
        limit: 1000
      });

      // Calculate analytics
      const successfulPayments = paymentIntents.data.filter((pi: any) => pi.status === &apos;succeeded&apos;);
      const totalRevenue = successfulPayments.reduce((sum, pi) => sum + pi.amount, 0) / 100;
      
      const subscriptionRevenue = successfulPayments
        .filter((pi: any) => pi.metadata.type === &apos;subscription&apos;)
        .reduce((sum, pi) => sum + pi.amount, 0) / 100;
      
      const contestRevenue = successfulPayments
        .filter((pi: any) => pi.metadata.type === &apos;contest_entry&apos;)
        .reduce((sum, pi) => sum + pi.amount, 0) / 100;

      const refundAmount = refunds.data.reduce((sum, refund) => sum + refund.amount, 0) / 100;

      const paymentsByType = successfulPayments.reduce((acc, pi) => {
}
        const type = pi.metadata.productId || &apos;unknown&apos;;
        acc[type] = (acc[type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      return {
}
        totalRevenue,
        subscriptionRevenue,
        contestRevenue,
        activeSubscriptions: subscriptions.data.length,
        newSubscriptions: subscriptions.data.filter((sub: any) => 
          sub.created >= startTimestamp && sub.created <= endTimestamp
        ).length,
        refundAmount,// 
        paymentsByType
      };

    } catch (error) {
}
      logger.error(&apos;❌ Failed to get payment analytics:&apos;, error);
      throw new Error(&apos;Failed to retrieve payment analytics&apos;);
    }
  }

  // Private webhook handlers

  private async handlePaymentSuccess(paymentIntent: Stripe.PaymentIntent): Promise<void> {
}
    const { userId, contestId, productId, type } = paymentIntent.metadata;
    
    logger.info(`✅ Payment succeeded for user ${userId}: ${productId}`);
    
    if (type === &apos;contest_entry&apos; && contestId) {
}
      // Grant contest entry access
      await this.grantContestAccess(userId, contestId);
    }
    
    // Record payment in database
    await this.recordPayment(paymentIntent);
  }

  private async handlePaymentFailure(paymentIntent: Stripe.PaymentIntent): Promise<void> {
}
    const { userId, productId } = paymentIntent.metadata;
    
    logger.info(`❌ Payment failed for user ${userId}: ${productId}`);
    
    // Send notification to user about payment failure
    // await this.sendPaymentFailureNotification(userId, paymentIntent);
  }

  private async handleSubscriptionUpdate(subscription: Stripe.Subscription): Promise<void> {
}
    const { userId } = subscription.metadata;
    
    logger.info(`🔔 Subscription updated for user ${userId}: ${subscription.status}`);
    
    // Update user&apos;s subscription status in database
    // await this.updateUserSubscription(userId, subscription);
  }

  private async handleSubscriptionCancellation(subscription: Stripe.Subscription): Promise<void> {
}
    const { userId } = subscription.metadata;
    
    logger.info(`🗑️ Subscription cancelled for user ${userId}`);
    
    // Remove premium features access
    // await this.revokePremiumAccess(userId);
  }

  private async handleInvoicePaymentSuccess(invoice: Stripe.Invoice): Promise<void> {
}
    logger.info(`✅ Invoice payment succeeded: ${invoice.id}`);
    
    // Handle successful recurring payment
    // await this.handleRecurringPaymentSuccess(invoice);
  }

  private async handleInvoicePaymentFailure(invoice: Stripe.Invoice): Promise<void> {
}
    logger.info(`❌ Invoice payment failed: ${invoice.id}`);
    
    // Handle failed recurring payment
    // await this.handleRecurringPaymentFailure(invoice);
  }

  private async grantContestAccess(userId: string, contestId: string): Promise<void> {
}
    // Implementation would grant user access to the contest
    logger.info(`🎯 Granting contest access for user ${userId} to contest ${contestId}`);
  }

  private async recordPayment(paymentIntent: Stripe.PaymentIntent): Promise<void> {
}
    // Implementation would record payment in database
    logger.info(`📝 Recording payment: ${paymentIntent.id}`);
  }
}

// Export singleton instance
export const paymentService = new PaymentService();
export default paymentService;
