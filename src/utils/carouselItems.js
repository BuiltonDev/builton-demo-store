import { getProductName } from "./productModifiers";

const calculateFinalPrice = (item) => {
  if (item.discount === 0) {
    return item.price;
  } else {
    return item.price - (item.price * item.discount);
  }
};

const generateProductCarouselItems = (items) => {
  return items.map(item => {
    if (!item.deleted && item.main_product) {
      return ({
        id: item._id.$oid,
        _id: {
          $oid: item._id.$oid,
        },
        name: item.name,
        price: item.price,
        final_price: calculateFinalPrice(item),
        image_url: item.image.public_url,
        short_description: item.short_description,
        discount: item.discount,
        currency: item.currency,
        _sub_products: item._sub_products,
      })
    }

    return false;
  }).filter(item => typeof item !== 'undefined');
};

const getMediaItems = (items) => {
  return items.map(item => ({
    id: item.human_id,
    image_url: item.url,
  }))
};

const convertRecommendationsToProducts = (recommendations, type) => {
  return recommendations.map(item => item[type]);
};

export { generateProductCarouselItems, convertRecommendationsToProducts, getMediaItems };
