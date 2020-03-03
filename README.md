<p align="center" style="text-align: center">
  <img width="320" height="190" src="https://res.cloudinary.com/dftspnwxo/image/upload/v1564489062/Builton_logo_P_large-x320_bi2fdt.png">
</p>

## Getting Started

[BuiltOn](https://builton.dev) offers a platform as a service that digitizes core business functions and optimizes 
resource allocation with baked-in machine learning capabilities. This is a demo store showcasing capabilities of [BuiltOn](https://builton.dev) API's. The orders/products/users created in the system will not be processed.

The demo is available on: [Demo store](https://demo-store.builton.dev/)

### Prerequisites

To run this project locally, a couple of prerequisities need to be met.

1. You need to have valid BuiltOn API key. You can get it by logging in/creating an account in [BuiltOn Dashboard](https://dashboard.builton.dev) and navigate to `Settings` from the main menu. The key is located under the `API keys` section.

2. You will need [Firebase](https://firebase.google.com/) authentication services as an authentication provider. You will need to link it in your [BuiltOn Dashboard](https://dashboard.builton.dev) account. You can do that by navigating to `Settings` and linking `Firebase` under `Auth Providers` section.

3. You will need [Stripe](https://stripe.com) test account to process payments for the orders. After creating your account you will need to link it in your [BuiltOn Dashboard](https://dashboard.builton.dev). You can do that by navigating to `Settings` and linking `Stripe` under `Payment Providers` section.

    ___Note:___ _For payments made in EU, please read on how to implement [Stripe SCA](https://stripe.com/docs/strong-customer-authentication) in our [SCA implementation documentation](https://docs.builton.dev/building-blocks/payments-1/strong-customer-authentication)._


4. You will also need to generate your own [Google Maps API key](https://developers.google.com/maps/documentation/javascript/get-api-key). You will need to replace the key in `/public/index.html`.
```
<script src="https://maps.googleapis.com/maps/api/js?key=[YOUR_GOOGLE_MAPS_API_KEY]&libraries=places"></script>
```

5. After cloning the project the respective keys need to be put in a `keys.json` config file under `/src/config/` directory.

```
{
  "endpoint": "https://api.builton.dev/",
  "apiKey": [YOUR BUILTON API KEY],
  "stripeKey": [YOUR STRIPE API KEY],
  "firebase": {
    "apiKey": [YOUR FIREBASE API KEY],
    "authDomain": [YOUR FIREBASE AUTH DOMAIN]
  }
  "ML": {
     "popularProducts": [YOUR POPULAR PRODUCTS ML MODEL ID],
     "similarProducts": [YOUR SIMILAR PRODUCTS ML MODEL ID],
     "complementaryItems": [YOUR COMPLEMENTARY PRODUCTS ML MODEL ID]
  }
}
```

6. ML Support - currently this Demo Store supports [Complementary Items](https://docs.builton.dev/machine-learning/simple-ml#complementary-items), [Similar Products](https://docs.builton.dev/machine-learning/simple-ml#similar-products) and [Popular Product Recommendations](https://docs.builton.dev/machine-learning/simple-ml#popular-product-recommendations). To make those work on a local copy, products need to be created, order history need to be available and the respective models need to be trained through our [Dashboard](https://dashboard.builton.dev/). Model ID's need to be replaced in their respective API calls. For more information please follow our [ML Docs](https://docs.builton.dev/machine-learning/intro-to-ml-tools).

_Example:_
```
    try {
      const recommendations = await builton.aiModels.getRecommendations(<model-id>, {
        body: {
          data: <product_id>,
          options: {
            size: 3,
          }
        }
      });

     console.log(recommendations);

    } catch(err) {
      console.error(err)
    }
```

### Installing

1. ```git clone https://github.com/BuiltonDev/builton-demo-store.git```
2. ```cd builton-demo-store```
3. ```npm i```
4. ```npm run start```

This will fire up a local server on PORT `3000` where you can interact with the system.

_Note: Changes in the code might be necessary to run this project with products other than the intended ones._


## Issue reporting

If you have found issues or have feature request, please report to this repository`s issues section.


## License

This project is licensed under the MIT license. See the [LICENSE](LICENSE.md) file for more info.

