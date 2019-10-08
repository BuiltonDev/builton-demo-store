const getProductName = productName => {
  if (!!~productName.indexOf("-")) {
    const index = productName.indexOf("-");
    return productName.substr(0, index).trim();
  }

  return productName;
};

const getSneakersSizes = product => {
  console.log(product);
  const prod = product.constructor === Array ? product : product._sub_products;
  if (prod.length > 0) {
    return prod.map(subProd => {
      if (!!~subProd.short_description.toLowerCase().indexOf('size - ')) {
        return {
          id: subProd._id.$oid,
          product: subProd,
          size: subProd.short_description.slice(subProd.short_description.toLowerCase().indexOf('size - ') + 'size - '.length)
        }
      }
      return true;
    })
  }
  return [];
};

const getSneakersSize = subProduct => {
  return subProduct.short_description.slice(subProduct.short_description.toLowerCase().indexOf('size - ') + 'size - '.length)
};

export { getProductName, getSneakersSizes, getSneakersSize };
