import { getProductName } from "./productModifiers";

const generateProductCarouselItems = (items) => {
  return items.map(item => ({
    id: item._id.$oid,
    name: getProductName(item.name),
    price: item.price,
    final_price: item.final_price,
    image_url: item.image.public_url,
    short_description: item.short_description,
    discount: item.discount,
  }))
};

const convertRecommendationsToProducts = (recommendations) => {
  return recommendations.map(item => item.product);
};

export { generateProductCarouselItems, convertRecommendationsToProducts };
