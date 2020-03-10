# One Time Charges

There are two ways to accept payments on your site with paysly: 

* [using a pre-built checkout flow](#using-a-checkout-flow)
* [using custom stripe elements](#using-stripe-elements)

## Using a Checkout Flow

A pre-built checkout flow is the easiest way to accept payments on your website using paysly.

First, install the [paysly package]() using your package manager of choice:

```bash
# npm
npm install paysly
```

```bash
# yarn
yarn add paysly
```

Then on the page you would like to accept payments, initialize it:

```js
const Paysly = require('paysly');
// replace 'pk_test_yourPublicKey-I3gcWtGXPuyWFRk2YD5' with your public key
// from the paysly dashboard
const paysly = await Paysly('pk_test_yourPublicKey-I3gcWtGXPuyWFRk2YD5');
```

or: 
```js
const Paysly = require('paysly');
// replace 'pk_test_yourPublicKey-I3gcWtGXPuyWFRk2YD5' with your public key
// from the paysly dashboard
Paysly('pk_test_yourPublicKey-I3gcWtGXPuyWFRk2YD5').then((paysly) => {
  // your code here
});
```

::: tip note
You may notice that the paysly package is initialized asynchronously. This is done to optimize page render time, so your page can continue to load while paysly is initializing.
:::

After initialization, call the [`redirectToCheckout`](/api.html#paysly-redirecttocheckout) function when you are ready to collect payment from your customer:

```js
paysly.redirectToCheckout({
  payment_method_types: ['card'],
  line_items: [
    {
      name: 'T-shirt',
      description: 'Comfortable cotton t-shirt',
      images: ['https://example.com/t-shirt.png'],
      amount: 1000,
      currency: 'usd',
      quantity: 1,
    },
  ],
  success_url: 'https://example.com/success',
  cancel_url: 'https://example.com/cancel',
});
```

This method takes an object with an array of `line_items` to control how the customer is charged. This object is a [stripe session object](https://stripe.com/docs/api/checkout/sessions/create), which you can customize to suit your needs.

And thats it! If users complete payment, they will be redirected to the page you specified in `success_url` - if they cancel or the payment fails, they will be sent to the supplied `cancel_url`.

If you want to perform automated logic based on the payment, you can [verify the payment](/guides/verifying-a-payment.html#checkout) on your success page.

## Using Stripe Elements

### Initialize Elements

Because Paysly is built on Stripe, we support [Stripe's awesome elements framework](https://stripe.com/docs/stripe-js).

The Paysly package exposes the elements framework for you. So, just as you would with the checkout flow, install the package:

```bash
npm install paysly
# or
yarn add paysly
```
and initialize:
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

Then, create an `elements` instance using paysly:

```js
var elements = paysly.elements();
```
::: tip elements
This `elements` instance is a full copy of [the Stripe elements object](https://stripe.com/docs/js/elements_object). With it, you can do anything that you can do with the Stripe elements object. The rest of this guide exemplifies a basic flow, but you can also create an element however you would like. Stripe provides [several examples](https://github.com/stripe/elements-examples) to help you get started. When you are ready, [pass your element to paysly to create the charge](/guides/one-time-charges.html#creating-a-charge).
:::

To display an element on your site, set up the html containers:
```html
<form action="/charge" method="post" id="payment-form">
  <div class="form-row">
    <label for="card-element">
      Credit or debit card
    </label>
    <div id="card-element">
      <!-- A Stripe Element will be inserted here. -->
    </div>

    <!-- Used to display form errors. -->
    <div id="card-errors" role="alert"></div>
  </div>

  <button>Submit Payment</button>
</form>
```

Style the element as you would like:
```css
/**
 * The CSS shown here will not be introduced in the Quickstart guide, but shows
 * how you can use CSS to style your Element's container.
 */
.StripeElement {
  box-sizing: border-box;

  height: 40px;

  padding: 10px 12px;

  border: 1px solid transparent;
  border-radius: 4px;
  background-color: white;

  box-shadow: 0 1px 3px 0 #e6ebf1;
  -webkit-transition: box-shadow 150ms ease;
  transition: box-shadow 150ms ease;
}

.StripeElement--focus {
  box-shadow: 0 1px 3px 0 #cfd7df;
}

.StripeElement--invalid {
  border-color: #fa755a;
}

.StripeElement--webkit-autofill {
  background-color: #fefde5 !important;
}
```

Finally, create your element using javascript:

```js
// Custom styling can be passed to options when creating an Element.
var style = {
  base: {
    color: '#32325d',
    fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
    fontSmoothing: 'antialiased',
    fontSize: '16px',
    '::placeholder': {
      color: '#aab7c4'
    }
  },
  invalid: {
    color: '#fa755a',
    iconColor: '#fa755a'
  }
};

// Create an instance of the card Element.
var card = elements.create('card', {style: style});

// Add an instance of the card Element into the `card-element` <div>.
card.mount('#card-element');

// Handle real-time validation errors from the card Element.
card.addEventListener('change', function(event) {
  var displayError = document.getElementById('card-errors');
  if (event.error) {
    displayError.textContent = event.error.message;
  } else {
    displayError.textContent = '';
  }
});
```

Finally, when your customer submits the form, [create the charge](/guides/one-time-charges.html#creating-a-charge).

### Creating a Charge

Creating a charge is done in a single function call:

```js
// Handle form submission.
const form = document.getElementById('payment-form');
form.addEventListener('submit', (event) => {
  event.preventDefault();
  paysly.createCharge(
    card, 
    {},
    { currency: 'usd', amount: 500 }
  ).then((result) => {
    // handle result
  }).catch((result) => {
    // handle validation or charge errors
  });
});
```

The [`paysly.createCharge`](/api.html#paysly-createcharge) function takes three parameters:

- a [Stripe elements card element](/guides/one-time-charges.html#initialize-elements) (described above)
- [token data](https://stripe.com/docs/js/tokens_sources/create_token?type=cardElement#stripe_create_token-data) (pass in `{}` if you don't need to use any token data, as done in the example above)
- a charge configuration object, which accepts all [stripe charge creation arguments](https://stripe.com/docs/api/charges/create)

[`createCharge`](/api.html#paysly-createcharge) also returns a promise. You can perform simple UI updates by handling the resolution result, or display errors by handling it's rejection. If you wish to perform business logic based on the result of the payment you can [verify the payment](/guides/verifying-a-payment.html#elements) in your success handler.
