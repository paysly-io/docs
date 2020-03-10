---
sidebarDepth: 1
---
# API

This page documents the functions available on the `paysly` object returned by initializing the paysly npm module:

```js
const Paysly = require('paysly');
// replace 'pk_test_yourPublicKey-I3gcWtGXPuyWFRk2YD5' with your public key
// from the paysly dashboard
const paysly = await Paysly('pk_test_yourPublicKey-I3gcWtGXPuyWFRk2YD5');
// or
Paysly('pk_test_yourPublicKey-I3gcWtGXPuyWFRk2YD5').then((paysly) => {
  // your code here
});
```

If you are looking to do a server-side integration beyond [verifying a payment](/guides/verifying-a-payment), all of your data is accessible via the [stripe APIs and SDKs](https://stripe.com/docs).

### stripe js functions

Note that in addition to the methods below, the `paysly` package also exposes all methods of [stripe.js](https://stripe.com/docs/js). That means you can call stripe functions (like [elements()](https://stripe.com/docs/js/elements_object/create)) right on the paysly package:

```js
var elements = paysly.elements();
var cardElement = elements.create('card');
```

## createCharge
### paysly.createCharge(cardElement, tokenData, chargeConfig)

Used to [create a charge using Stripe Elements](/guides/one-time-charges.html#using-stripe-elements).

### Arguments
- a ["Stripe Elements" card element](/guides/one-time-charges.html#initialize-elements) (described above)
- [token data](https://stripe.com/docs/js/tokens_sources/create_token?type=cardElement#stripe_create_token-data) (pass in `{}` if you don't need to use any token data)
- a charge configuration object, which accepts all [stripe charge creation arguments](https://stripe.com/docs/api/charges/create)

### Returns
- A promise. If successful, the promise will be successfully resolved with a [charge object](https://stripe.com/docs/api/charges/object), with an added tokenized version of the charge object within its `token` property. If rejected, it will contain a [stripe error object](https://stripe.com/docs/api/errors).

## createRecurring
### paysly.createRecurring(paymentMethodData, customerData, subscriptionInformation)

Used to [create recurring charge using Stripe Elements](/guides/recurring-charges.html#using-stripe-elements).

### Arguments

- [Stripe paymentMethodData](https://stripe.com/docs/js/payment_intents/create_payment_method#stripe_create_payment_method-paymentMethodData), including a [Stripe elements card element](/guides/one-time-charges.html#initialize-elements), and a `type`.
- [customer data](https://stripe.com/docs/api/customers/create) (pass in `{}` if you don't need to use any customer data)
- [Stripe subscription information](https://stripe.com/docs/api/subscriptions/create), except for [`customer`](https://stripe.com/docs/api/subscriptions/create#create_subscription-customer) - (a customer will be created based on your customer data).

### Returns

- A promise. If successful, the promise will be resolved with a [stripe payment intent object](https://stripe.com/docs/api/payment_intents/object), with an added tokenized version fo the object within its `token` property. If rejected, it will contain a [stripe error object](https://stripe.com/docs/api/errors).

## redirectToCheckout
### paysly.redirectToCheckout(stripeSession)

Used to [create a charge using a pre-built checkout page](/guides/one-time-charges.html#using-a-checkout-flow).

### Arguments
- a [stripe session object](https://stripe.com/docs/api/checkout/sessions/create)

### Returns
- A promise. The success state should never be called (as the user has been redirected). In the case of a failure, the promise will be rejected with a [stripe error object](https://stripe.com/docs/api/errors).

## validateCheckout
### paysly.validateCheckout()

Used to validate a checkout session. Please see [the guide to checkout session verification](/guides/verifying-a-payment.html#checkout) for instructions on how to use this method.

::: warning note
This method only works for payments created with `paysly.redirectToCheckout`.
:::

### Arguments
- none

### Returns
- A promise. If successful, the promise will be resolved with a [stripe payment intent object](https://stripe.com/docs/api/payment_intents/object), with an added tokenized version fo the object within its `token` property. If rejected, it will contain a [stripe error object](https://stripe.com/docs/api/errors).
