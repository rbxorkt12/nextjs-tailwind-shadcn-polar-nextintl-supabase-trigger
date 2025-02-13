import { Webhooks } from "jsr:@polar-sh/deno";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const supabaseUrl = Deno.env.get('SUPABASE_URL');
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabaseClient = createClient(supabaseUrl, supabaseKey);

interface PolarSubscription {
  type: string;
  data: {
    id: string;
    user: {
      id: string;
      email: string;
    };
    status: string;
    current_period_start: string;
    current_period_end: string;
    recurring_interval: string;
    price_id: string;
    product_id: string;
    customer: {
      id: string;
    };
  };
}

interface PolarBenefitGrant {
  type: string;
  data: {
    id: string;
    subscription_id: string;
    benefit_id: string;
    is_granted: boolean;
    is_revoked: boolean;
    properties: Record<string, unknown>;
    user_id: string;
  };
}

Deno.serve(
  Webhooks({
    webhookSecret: Deno.env.get('POLAR_WEBHOOK_SECRET'),
    
    async onSubscriptionActive(payload) {
      console.log('📥 Received onSubscriptionActive webhook:', payload.type);
      const subscription = payload.data;
      
      // Log webhook event
      await supabaseClient
        .from('webhook_logs')
        .insert({
          event_type: payload.type,
          request_payload: payload,
          user_email: subscription.user.email
        });

      // Update subscription with onConflict handling
      const { data: userSubscription, error: subscriptionError } = await supabaseClient
        .from('user_subscriptions')
        .upsert({
          user_id: subscription.metadata.userId,
          subscription_id: subscription.id,
          subscription_tier: 'premium',
          status: subscription.status,
          current_period_start: subscription.current_period_start,
          current_period_end: subscription.current_period_end,
          quota_reset_interval: subscription.recurring_interval,
          metadata: {
            price_id: subscription.price_id,
            product_id: subscription.product_id,
            customer_id: subscription.customer.id
          }
        }, {
          onConflict: 'user_id',
          ignoreDuplicates: false
        })
        .select('id')
        .single();

      if (subscriptionError) throw subscriptionError;

      // Record history with the correct user_subscription_id
      const { error: historyError } = await supabaseClient
        .from('subscription_history')
        .insert({
          user_subscription_id: userSubscription.id,
          event_type: 'created',
          metadata: subscription
        });

      if (historyError) throw historyError;
    },

    async onSubscriptionCanceled(payload) {
      console.log('📥 Received onSubscriptionCanceled webhook:', payload.type);
      const subscription = payload.data;

      await supabaseClient
        .from('webhook_logs')
        .insert({
          event_type: payload.type,
          request_payload: payload,
          user_email: subscription.user.email
        });

      // Get the user_subscription id first
      const { data: userSubscription, error: fetchError } = await supabaseClient
        .from('user_subscriptions')
        .select('id')
        .eq('user_id', subscription.metadata.userId)
        .single();

      if (fetchError) throw fetchError;

      // Update subscription status but maintain benefits until period ends
      const { error: updateError } = await supabaseClient
        .from('user_subscriptions')
        .update({ 
          metadata: {
            last_subscription_id: subscription.id,
            cancelled_at: new Date().toISOString(),
            scheduled_downgrade_date: subscription.current_period_end
          }
        })
        .eq('user_id', subscription.metadata.userId);

      if (updateError) throw updateError;

      // Record history with the correct user_subscription_id
      const { error: historyError } = await supabaseClient
        .from('subscription_history')
        .insert({
          user_subscription_id: userSubscription.id,
          event_type: 'cancelled',
          metadata: subscription
        });

      if (historyError) throw historyError;
    },

    async onSubscriptionRevoked(payload) {
      console.log('📥 Received onSubscriptionRevoked webhook:', payload.type);
      const subscription = payload.data;

      try {
        await supabaseClient
          .from('webhook_logs')
          .insert({
            event_type: payload.type,
            request_payload: payload,
            user_email: subscription.user.email
          });

        // Get the user_subscription
        const { data: userSubscription, error: fetchError } = await supabaseClient
          .from('user_subscriptions')
          .select('id, metadata')
          .eq('subscription_id', subscription.id)
          .single();

        if (fetchError) {
          console.error(`❌ Error fetching user subscription in onSubscriptionRevoked:`, {
            error: fetchError,
            subscriptionId: subscription.id
          });
          throw fetchError;
        }

        // Update subscription status to free
        const { error: updateError } = await supabaseClient
          .from('user_subscriptions')
          .update({
            subscription_tier: 'free',
            subscription_id: null,
            quota_reset_interval: 'month',
            metadata: {
              ...userSubscription.metadata,
              downgraded_at: new Date().toISOString(),
              last_subscription_id: subscription.id
            }
          })
          .eq('id', userSubscription.id);

        if (updateError) {
          console.error(`❌ Error updating subscription in onSubscriptionRevoked:`, {
            error: updateError,
            userSubscriptionId: userSubscription.id,
            subscriptionId: subscription.id
          });
          throw updateError;
        }

        // Record subscription history
        const { error: historyError } = await supabaseClient
          .from('subscription_history')
          .insert({
            user_subscription_id: userSubscription.id,
            event_type: 'revoked',
            metadata: subscription
          });

        if (historyError) {
          console.error(`❌ Error recording subscription history in onSubscriptionRevoked:`, {
            error: historyError,
            userSubscriptionId: userSubscription.id,
            subscriptionId: subscription.id
          });
          throw historyError;
        }
      } catch (error) {
        console.error(`❌ Unhandled error in onSubscriptionRevoked:`, {
          error,
          payload
        });
        throw error;
      }
    },

    async onBenefitGrantCreated(payload) {
      console.log('📥 Received onBenefitGrantCreated webhook:', payload.type);
      await handleBenefitGrant(payload, true);
    },

    async onBenefitGrantRevoked(payload) {
      console.log('📥 Received onBenefitGrantRevoked webhook:', payload.type);
      await handleBenefitGrant(payload, false);
    },


    // Handle any errors
    onError: async (error) => {
      console.error('❌ Error processing webhook:', error);
      
      try {
        await supabaseClient
          .from('webhook_logs')
          .insert({
            event_type: 'error',
            error_message: error.message,
            request_payload: error.stack
          });
      } catch (logError) {
        console.error('Failed to log error:', logError);
      }
    }
  })
);

async function handleBenefitGrant(payload: any, isGranted: boolean) {
  const benefitGrant = payload.data;
  console.log(`📥 Processing benefit ${isGranted ? 'grant' : 'revoke'} for subscription:`, benefitGrant.subscriptionId);
  
  try {
    await supabaseClient
      .from('webhook_logs')
      .insert({
        event_type: payload.type,
        request_payload: payload
      });

    // Get user subscription data
    const { data: userSubscription, error: fetchError } = await supabaseClient
      .from('user_subscriptions')
      .select('id, metadata, subscription_tier, current_period_end, user_id')
      .eq('subscription_id', benefitGrant.subscriptionId)
      .single();

    if (fetchError) throw fetchError;

    // Update quotas only if granted AND subscription is premium
    if (isGranted && userSubscription.subscription_tier === 'premium') {
    console.log('Updating quotas for user:', userSubscription.user_id);
      const { error: quotaError } = await supabaseClient
        .from('user_quotas')
        .upsert({
          user_id: userSubscription.user_id,
          summarization_meeting_quota: 30,
          translation_meeting_quota: 15,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id'
        });

      if (quotaError) {
        console.error(`❌ Error updating user quotas in handleBenefitGrant:`, {
          error: quotaError,
          userId: benefitGrant.userId
        });
        throw quotaError;
      }
    } else {
      // Reset to free tier quotas when not granted or not premium
      const { error: quotaError } = await supabaseClient
        .from('user_quotas')
        .upsert({
          user_id: benefitGrant.userId,
          plan: 'free',
          summarization_meeting_quota: 5,
          translation_meeting_quota: 3,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id'
        });

      if (quotaError) throw quotaError;
    }

    // Update benefit status only
    const { error: benefitError } = await supabaseClient
      .from('user_subscriptions')
      .update({ 
        has_active_benefits: isGranted,
        updated_at: new Date().toISOString(),
        metadata: {
          ...userSubscription.metadata,
          last_benefit_update: new Date().toISOString(),
          benefit_id: benefitGrant.benefitId,
          polar_user_id: benefitGrant.userId
        }
      })
      .eq('id', userSubscription.id);

    if (benefitError) {
      console.error(`❌ Error updating benefit status in handleBenefitGrant:`, {
        error: benefitError,
        userSubscriptionId: userSubscription.id,
        subscriptionId: benefitGrant.subscriptionId,
        operation: isGranted ? 'grant' : 'revoke'
      });
      throw benefitError;
    }

    // Record benefit history
    const { error: historyError } = await supabaseClient
      .from('benefit_history')
      .insert({
        user_subscription_id: userSubscription.id,
        benefit_id: benefitGrant.benefitId,
        event_type: isGranted ? 'granted' : 'revoked',
        metadata: {
          properties: benefitGrant.properties,
          polar_user_id: benefitGrant.userId,
          subscription_id: benefitGrant.subscriptionId,
          timestamp: new Date().toISOString()
        }
      });

    if (historyError) {
      console.error(`❌ Error recording benefit history in handleBenefitGrant:`, {
        error: historyError,
        userSubscriptionId: userSubscription.id,
        subscriptionId: benefitGrant.subscriptionId,
        operation: isGranted ? 'grant' : 'revoke'
      });
      throw historyError;
    }
  } catch (error) {
    console.error(`❌ Unhandled error in handleBenefitGrant:`, {
      error,
      payload,
      isGranted
    });
    throw error;
  }
}
