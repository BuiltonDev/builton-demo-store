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
          size: subProd.short_description.slice(subProd.short_description.toLowerCase().indexOf('size - ') + 'size - '.length)
        }
      }
    })
  }
  return false;
}

export { getProductName, getSneakersSizes };
