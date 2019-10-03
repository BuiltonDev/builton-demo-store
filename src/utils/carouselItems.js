import { getProductName } from "./productModifiers";

const generateProductCarouselItems = (items) => {
  return items.map(item => {
    if (!item.deleted && item.main_product) {
      return ({
        id: item._id.$oid,
        name: getProductName(item.name),
        price: item.price,
        final_price: item.final_price,
        image_url: item.image.public_url,
        short_description: item.short_description,
        discount: item.discount,
      })
    }
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
