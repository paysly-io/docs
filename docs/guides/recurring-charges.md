# Recurring Charges

There are two ways to enroll customers in automatic payments with paysly: 

* [using a pre-built checkout flow](#using-a-checkout-flow)
* [using custom stripe elements](#using-stripe-elements)

## Using a Checkout Flow

To create a recurring charge using the checkout flow, set up and install the script as you would for [a non-recurring checkout flow](/guides/one-time-charges.html#using-a-checkout-flow), but call [`redirectToCheckout`](/api.html#paysly-redirecttocheckout) with recurring parameters:

```js
paysly.redirectToCheckout({
  payment_method_types: ['card'],
  subscription_data: {
    items: [{
      plan: 'plan_GHec7BZO8ZUpnM',
    }],
  },
  success_url: 'http://example.com/success',
  cancel_url: 'https://example.com/cancel',
});
```
As [`redirectToCheckout`](/api.html#paysly-redirecttocheckout) accepts a [stripe session object](https://stripe.com/docs/api/checkout/sessions/create), you can customize [`subscription_data`](https://stripe.com/docs/api/checkout/sessions/create#create_checkout_session-subscription_data) (as well as any other parameters) to suit your needs. You can set up and customize plans from [the stripe dashboard](https://dashboard.stripe.com/test/subscriptions/products).

To verify your payment, follow [the same procedure as you would with a regular, non-recurring charge](/guides/verifying-a-payment.html#checkout).

## Using Stripe Elements

To create a customer enrollment using stripe Elements, install the script, create an `elements` instance, and style your element exactly as you would for [a non-recurring flow](/guides/one-time-charges.html#using-stripe-elements). But, instead of [creating a charge](/guides/one-time-charges.html#creating-a-charge), instead:

Create a recurring customer enrollment via [`paysly.createRecurring`](/api.html#paysly-createrecurring) :

```js
// Handle form submission.
const form = document.getElementById('payment-form');
form.addEventListener('submit', (event) => {
  event.preventDefault();
  paysly.createRecurring(
    { type: 'card', card } 
    {},
    { 
      items: [{ 
        plan: 'plan_GHec7BZO8ZUpnM' 
      }]
    }
  ).then((result) => {
    // handle result
  }).catch((result) => {
    // handle validation or charge errors
  });
});
```

The [`paysly.createRecurring`](/api.html#paysly-redirecttocheckout) function takes three parameters:

- [Stripe paymentMethodData](https://stripe.com/docs/js/payment_intents/create_payment_method#stripe_create_payment_method-paymentMethodData), including a [Stripe elements card element](/guides/one-time-charges.html#initialize-elements) (described above), and a `type`.
- [customer data](https://stripe.com/docs/api/customers/create) (pass in `{}` if you don't need to use any customer data, as done in the example above)
- [Stripe subscription information](https://stripe.com/docs/api/subscriptions/create), except for [`customer`](https://stripe.com/docs/api/subscriptions/create#create_subscription-customer) - (a customer will be created based on your customer data).

The returned `result` is a [stripe payment intent object](https://stripe.com/docs/api/payment_intents/object), with a signed version of this object in `result.token`. To verify the payment, you will want to supply this token to a secure environment (typically a web server), then decode it and ensure it contains the data you expect. This can be done with [one of the numerous JWT libraries](https://jwt.io/#libraries).