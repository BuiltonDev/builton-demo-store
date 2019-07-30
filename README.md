<p align="center" style="text-align: center">
  <img width="320" height="190" src="https://res.cloudinary.com/dftspnwxo/image/upload/v1564489062/Builton_logo_P_large-x320_bi2fdt.png">
</p>

## Getting Started

This is a demo store showcasing API capabilities of [Builton.dev](https://builton.dev) API's. The orders/products/users created in the system will not be processed.

### Prerequisites

To run this project locally, a couple of prerequisities need to be met.

1. You need to have valid BuiltOn API key. You can get it by logging in/creating an account in [BuiltOn Dashboard](https://dashboard.builton.dev) and navigate to `Settings` from the main menu. The key is location under the `API keys section`.

2. You will need [Firebase](https://firebase.google.com/) authentication services as an authentication provider. You will need to link it in your [BuiltOn Dashboard](https://dashboard.builton.dev) account. You can do that by navigating to `Settings` and linking `Firebase` under `Auth Providers` section.

2. You will need [Stripe](https://stripe.com) test account to process payments for the orders. After creating your account you will need to link it in your [BuiltOn Dashboard](https://dashboard.builton.dev). You can do that by navigating to `Settings` and linking `Stripe` under `Payment Providers` section.

3. After cloning the project the respective keys need to be put in a `keys.json` config file under `/src/config/` directory.

```
{
  "endpoint": "https://api.builton.dev/",
  "apiKey": [YOUR BUILTON API KEY],
  "stripeKey": [YOUR STRIPE API KEY],
  "firebase": {
    "apiKey": [YOUR FIREBASE API KEY],
    "authDomain": [YOUR FIREBASE AUTH DOMAIN]
  }
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

