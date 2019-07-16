const getProductName = productName => {
  if (!!~productName.indexOf("-")) {
    const index = productName.indexOf("-");
    return productName.substr(0, index).trim();
  }

  return productName;
};

const getSneakersSizes = product => {
  if (product && product._sub_products.length > 0) {
    return product._sub_products.map(subProd => {
      if (!!~subProd.short_description.toLowerCase().indexOf('size - ')) {
        return {
          id: subProd._id.$oid,
          product: subProd,
          size: subProd.short_description.slice(subProd.short_description.toLowerCase().indexOf('size - ') + 'size - '.length)
        }
      }
    })
  }
  return [];
};

const getSneakersSize = product => {
  return product.short_description.slice(product.short_description.toLowerCase().indexOf('size - ') + 'size - '.length)
};

export { getProductName, getSneakersSizes, getSneakersSize };
