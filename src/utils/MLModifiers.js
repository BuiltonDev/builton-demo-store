import builton from "./builton";

const getProduct = async (productId, callback) => {
  try {
    const similarProduct = await builton.products.get(productId);
    console.log(similarProduct)
    callback(similarProduct);
  } catch (err) {
    console.log(err);
    console.error("Failed to fetch similar product.");
  }
};

const getComplementaryItems = async (recommendations) => {
  const prods = [];
  const complementaryProds = recommendations;

  const setSimilarProd = prod => {
    prods.push(prod);
  };

  for (let i = 0; i < complementaryProds.length; i += 1) {
    if (complementaryProds[i].predictions.prediction.length > 0) {
      for (let x = 0; x < complementaryProds[i].predictions.prediction.length; x += 1) {
        await getProduct(complementaryProds[i].predictions.prediction[x], setSimilarProd);
      }
    }
  }

  return prods;
};

const getRecommendations = async (recommendations, type) => {
  const recommendedProds = [];

  const getProdRoute = (prod) => {
    // This currently supports popular products and similar products
    if (type === 'popularProducts') {
      return prod.product;
    }
    console.log(prod);
    return prod.reference_label;
  };

  const setSimilarProd = prod => {
    recommendedProds.push(prod);
  };


  for (let i = 0; i < recommendations.length; i += 1) {
    await getProduct(getProdRoute(recommendations[i]), setSimilarProd);
  }
  return recommendedProds;
};

export { getComplementaryItems, getRecommendations }
