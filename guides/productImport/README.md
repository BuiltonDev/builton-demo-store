<p align="center" style="text-align: center">
  <img width="320" height="190" src="https://res.cloudinary.com/dftspnwxo/image/upload/v1564489062/Builton_logo_P_large-x320_bi2fdt.png">
</p>

## Introduction
Products are necessary to run the BuiltOn Demo Store project locally, since specific code related to product properties are introduced.
This guide will show you how to import products in your BuiltOn project.

### Prerequisites

1. Installed [`node`](https://nodejs.org/en/)
2. Followed the installation guide from the root of this project.

### Installing

1. Navigate to `guides/productImport` in the terminal
2. `npm i`
3. `npm run import`
4. You will be prompt to insert your API key an Service Account key. You can get both from your BuiltOn dashboard account, by navigating to Settings. Copy the API key and generate new Service Account key if you don't have one.
5. The script will import your products.

_Note: To get ML recommendations, you will need to train your models and replace the ID's in their respective API calls in the Demo Store._

## Issue reporting

If you have found issues or have feature request, please report to this repository`s issues section.


## License

This project is licensed under the MIT license. See the [LICENSE](LICENSE.md) file for more info.

