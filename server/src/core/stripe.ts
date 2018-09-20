var stripe;

export class Stripe {
    
    
    constructor() {
        stripe = require('stripe')(process.env.STRIPE_SKEY);
    }

    public static async createProduct() {

        const product = await stripe.products.create({
            name: 'Tenant Service',
            type: 'service',
        });
        return product;
    }

    public static async createPlan(productId, plan) {

        const _plan = await stripe.plans.create({
            currency: 'usd',
            interval: 'month',
            product: productId,
            nickname: plan.Name,
            amount: plan.Amount * 100
        });

        return _plan;
    }

    public async createCustomer(token, email) {

        const customer = await stripe.customers.create({
            email: email,
            source: token
        });

        return customer;
    }

    public async planSubscribe(planId, customerId) {

        const subscription = await stripe.subscriptions.create({
            customer: customerId,
            items: [{plan: planId}]
        });

        return subscription;
    }


    public async planChange(subscriptionId, newPlanId) {

        console.log(subscriptionId, newPlanId);

        var subscription = await stripe.subscriptions.retrieve(subscriptionId);

        var updatedSubscription = await stripe.subscriptions.update(subscriptionId, {
            cancel_at_period_end: false,
            items: [{
                id: subscription.items.data[0].id,
                plan: newPlanId,
            }]
        });

        return updatedSubscription;
    }
}
