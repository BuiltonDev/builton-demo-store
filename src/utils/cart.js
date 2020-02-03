import builton from "./builton";
import {getProductName} from "./productModifiers";

const calculateTotalAmount = (cart) => {
  let total = 0;
  for (let i = 0; i < cart.length; i += 1) {
    total += cart[i].product.final_price;
  }
  return total;
};

const getCartSubProduct = (cartProduct, subProdId) => {
  if(cartProduct && cartProduct._sub_products.length > 0 && subProdId) {
    for (let i = 0; i < cartProduct._sub_products.length; i += 1) {
      if (cartProduct._sub_products[i]._id.$oid === subProdId) {
        return cartProduct._sub_products[i];
      }
    }
  }

  return undefined;
};

const getCartItems = () => {
  const builtonCartItems = builton.cart.get();
  const cartProducts = [];

  return new Promise((resolve, reject) => {
    builtonCartItems.forEach(async (item, index) => {
      const prod = await builton.products.get(item.productId, {
        urlParams: {
          expand: '_sub_products',
        }
      });
      // We need to match the products/sub products in the cart
      // with the sub products fetched from the API
      // to populate our local cart with the necessary product, size and category used for URL
      item.subProducts.forEach(subProd => {
        prod._sub_products.forEach(prodSub => {
          if (subProd === prodSub._id.$oid) {
            cartProducts.push({
              product: prod,
              size: getCartSubProduct(prod, subProd),
              category: getProductName(prod.name).toLowerCase(),
            })
          }
        })
      });
      // last iteration, we need to resolve with the array we have created
      if (index === builtonCartItems.length - 1) {
        if (cartProducts.length > 0) {
          resolve(cartProducts);
        } else {
          reject(new Error('No cart products'));
        }
      }
    });
  });
};

export { getCartItems, calculateTotalAmount };
