# Verifying a Payment

All successful paysly responses contain a signed JWT (Json Web Token) which you can use to verify payments. If you are unfamiliar with JWTs, check out [jwt.io](https://jwt.io/introduction) for an overview.

All tokens described below are sigend using RS256. Auth0 has a [great blog covering RS256 signature verification](https://auth0.com/blog/navigating-rs256-and-jwks/#Verifying-RS256), to help you get started decoding them. Paysly's public key is:

```
-----BEGIN PUBLIC KEY-----
MIGeMA0GCSqGSIb3DQEBAQUAA4GMADCBiAKBgHOIiQX8653lyXXiT08tzDvKx7q+
uFO2hD7oumpnGwZkhgQPLAHUAe656Mq4pVm+Td6l9X6vcuezn7C0DAxFah9ap45U
ELayh5ZCQbR6EQbm5NulJpN9G/eS7YihXWmA62onWR5nK2joWkXWM8Z/28Q+Okdn
PfEqYjvOLoa5+HOTAgMBAAE=
-----END PUBLIC KEY-----
```

This can also be retrieved by importing the [paysly npm module's](https://www.npmjs.com/package/paysly) `publicKey` function:

```js
import { publicKey } from 'paysly';
const payslyPublicKey = await publicKey();
```

## Checkout

When you created a checkout session, you supplied a `success_url` to the [`redirectToCheckout`](/api.html#paysly-redirecttocheckout) function:

```js
paysly.redirectToCheckout({
  // ...
  success_url: 'https://example.com/success',
});
```

Upon payment completion, users will be redirected to the specified page. In order to verify a payment on your success page...

Initialize the paysly package: 

```js
const Paysly = require('paysly');
// replace 'pk_test_yourPublicKey-I3gcWtGXPuyWFRk2YD5' with your public key
// from the paysly dashboard
const paysly = await Paysly('pk_test_yourPublicKey-I3gcWtGXPuyWFRk2YD5');
```

Then, fetch a securely signed token from paysly: 

```js
paysly.validateCheckout().then((result) => {
  // handle result
  sendTokenToYourServerForVerification(result.token);
});
```

The returned `result` is a [stripe payment intent object](https://stripe.com/docs/api/payment_intents/object), with a signed version of this object in `result.token`. To verify the payment, you will want to supply this token to a secure environment (typically a web server), then decode it and ensure it contains the data you expect. This can be done with [one of the numerous JWT libraries](https://jwt.io/#libraries).


At a minimum, you will want to verify that the [status](https://stripe.com/docs/api/payment_intents/object#payment_intent_object-status) is `succeeded` and the [amount received](https://stripe.com/docs/api/payment_intents/object#payment_intent_object-amount_received) is the amount you expect.

## Elements

After a charge is successfully created using [`paysly.createCharge`](/api.html#paysly-createcharge), it's promise will be resolved with a [stripe charge object](https://stripe.com/docs/api/charges/object). A signed version of this object will be in the returned result's `token` property, as well:

```js
paysly.createCharge(
 // ...
).then((result) => {
  // handle result
  sendTokenToYourServerForVerification(result.token);
});
```

To verify the payment, you will want to supply this token to a secure environment (typically a web server), then decode it and ensure it contains the data you expect. This can be done with [one of the numerous JWT libraries](https://jwt.io/#libraries).

When validating the result, the contained [`paid` attribute](https://stripe.com/docs/api/charges/object#charge_object-paid) is the simplest way to check if the charge succeeded. You can also verify that [`amount`](https://stripe.com/docs/api/charges/object#charge_object-amount) is the value that you expect.