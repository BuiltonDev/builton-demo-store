const calculateFinalPrice = item => {
  if (item.discount === 0) {
    return item.price;
  } else {
    return item.price - item.price * item.discount;
  }
};

const generateProductCarouselItems = items => {
  return items
    .map(item => {
      if (!item.deleted && item.main_product) {
        return {
          id: item._id.$oid,
          _id: {
            $oid: item._id.$oid
          },
          name: item.name,
          price: item.price,
          final_price: calculateFinalPrice(item),
          image_url: item.image.public_url,
          short_description: item.short_description,
          discount: item.discount,
          currency: item.currency,
          _sub_products: [
            {
              _cls: "Product",
              _id: {
                $oid: "5d2ed892f1fc02000b274817"
              },
              _sub_products: [],
              active: true,
              business_rules: [],
              company: {
                $oid: "5d1b3e674633800010a69cff"
              },
              company_take: -1,
              created: {
                $date: 1563351186084
              },
              currency: "EUR",
              default_position: [-1, -1],
              deleted: false,
              description: "",
              discount: 0,
              final_price: 0,
              human_id: "67R4R2",
              main_product: false,
              max_distance: 0,
              media: [],
              modified: {
                $date: 1570090520075
              },
              name: "Sneakers Size 10.5",
              parents: [
                {
                  $oid: "5d2ed67ef1fc02000a6223e4"
                },
                {
                  $oid: "5d28560ff93362000cddcf94"
                },
                {
                  $oid: "5d2855e1f93362000ab82cc5"
                },
                {
                  $oid: "5d2854d2f93362000cddcf91"
                }
              ],
              path: "/",
              price: 0,
              price_change_percentage: 0,
              properties: {},
              short_description: "Size - 10.5",
              tags: ["size"],
              vat: 0
            },
            {
              _cls: "Product",
              _id: {
                $oid: "5d2ed8a8f1fc02000f390db7"
              },
              _sub_products: [],
              active: true,
              business_rules: [],
              company: {
                $oid: "5d1b3e674633800010a69cff"
              },
              company_take: -1,
              created: {
                $date: 1563351208709
              },
              currency: "EUR",
              default_position: [-1, -1],
              deleted: false,
              description: "",
              discount: 0,
              final_price: 0,
              human_id: "XG647J",
              main_product: false,
              max_distance: 0,
              media: [],
              modified: {
                $date: 1570090520317
              },
              name: "Sneakers Size 11",
              parents: [
                {
                  $oid: "5d2ed67ef1fc02000a6223e4"
                },
                {
                  $oid: "5d28560ff93362000cddcf94"
                },
                {
                  $oid: "5d2855e1f93362000ab82cc5"
                },
                {
                  $oid: "5d2854d2f93362000cddcf91"
                }
              ],
              path: "/",
              price: 0,
              price_change_percentage: 0,
              properties: {},
              short_description: "Size - 11",
              tags: ["size"],
              vat: 0
            },
            {
              _cls: "Product",
              _id: {
                $oid: "5d2ed7f0f1fc02000f390db0"
              },
              _sub_products: [],
              active: true,
              business_rules: [],
              company: {
                $oid: "5d1b3e674633800010a69cff"
              },
              company_take: -1,
              created: {
                $date: 1563351024907
              },
              currency: "EUR",
              default_position: [-1, -1],
              deleted: false,
              description: "",
              discount: 0,
              final_price: 0,
              human_id: "2END7X",
              main_product: false,
              max_distance: 0,
              media: [],
              modified: {
                $date: 1570090520485
              },
              name: "Sneakers Size 6",
              parents: [
                {
                  $oid: "5d2ed67ef1fc02000a6223e4"
                },
                {
                  $oid: "5d28560ff93362000cddcf94"
                },
                {
                  $oid: "5d2855e1f93362000ab82cc5"
                },
                {
                  $oid: "5d2854d2f93362000cddcf91"
                }
              ],
              path: "/",
              price: 0,
              price_change_percentage: 0,
              properties: {},
              short_description: "Size - 6",
              tags: ["size"],
              vat: 0
            },
            {
              _cls: "Product",
              _id: {
                $oid: "5d2ed80cf1fc02000a6223f5"
              },
              _sub_products: [],
              active: true,
              business_rules: [],
              company: {
                $oid: "5d1b3e674633800010a69cff"
              },
              company_take: -1,
              created: {
                $date: 1563351052364
              },
              currency: "EUR",
              default_position: [-1, -1],
              deleted: false,
              description: "",
              discount: 0,
              final_price: 0,
              human_id: "Y86JQ4",
              main_product: false,
              max_distance: 0,
              media: [],
              modified: {
                $date: 1570090520665
              },
              name: "Sneakers Size 7",
              parents: [
                {
                  $oid: "5d2ed67ef1fc02000a6223e4"
                },
                {
                  $oid: "5d28560ff93362000cddcf94"
                },
                {
                  $oid: "5d2855e1f93362000ab82cc5"
                },
                {
                  $oid: "5d2854d2f93362000cddcf91"
                }
              ],
              path: "/",
              price: 0,
              price_change_percentage: 0,
              properties: {},
              short_description: "Size - 7",
              tags: ["size"],
              vat: 0
            },
            {
              _cls: "Product",
              _id: {
                $oid: "5d2ed842f1fc02000ebf4b80"
              },
              _sub_products: [],
              active: true,
              business_rules: [],
              company: {
                $oid: "5d1b3e674633800010a69cff"
              },
              company_take: -1,
              created: {
                $date: 1563351106947
              },
              currency: "EUR",
              default_position: [-1, -1],
              deleted: false,
              description: "",
              discount: 0,
              final_price: 0,
              human_id: "6723GW",
              main_product: false,
              max_distance: 0,
              media: [],
              modified: {
                $date: 1570090521205
              },
              name: "Sneakers Size 8.5",
              parents: [
                {
                  $oid: "5d28560ff93362000cddcf94"
                },
                {
                  $oid: "5d2854d2f93362000cddcf91"
                }
              ],
              path: "/",
              price: 0,
              price_change_percentage: 0,
              properties: {},
              short_description: "Size - 8.5",
              tags: ["size"],
              vat: 0
            },
            {
              _cls: "Product",
              _id: {
                $oid: "5d2ed855f1fc02000a6223fb"
              },
              _sub_products: [],
              active: true,
              business_rules: [],
              company: {
                $oid: "5d1b3e674633800010a69cff"
              },
              company_take: -1,
              created: {
                $date: 1563351125123
              },
              currency: "EUR",
              default_position: [-1, -1],
              deleted: false,
              description: "",
              discount: 0,
              final_price: 0,
              human_id: "PDJ8KK",
              main_product: false,
              max_distance: 0,
              media: [],
              modified: {
                $date: 1570090521396
              },
              name: "Sneakers Size 9",
              parents: [
                {
                  $oid: "5d2ed67ef1fc02000a6223e4"
                },
                {
                  $oid: "5d28560ff93362000cddcf94"
                },
                {
                  $oid: "5d2854d2f93362000cddcf91"
                }
              ],
              path: "/",
              price: 0,
              price_change_percentage: 0,
              properties: {},
              short_description: "Size - 9",
              tags: ["size"],
              vat: 0
            },
            {
              _cls: "Product",
              _id: {
                $oid: "5d2ed86bf1fc02000f390db4"
              },
              _sub_products: [],
              active: true,
              business_rules: [],
              company: {
                $oid: "5d1b3e674633800010a69cff"
              },
              company_take: -1,
              created: {
                $date: 1563351147158
              },
              currency: "EUR",
              default_position: [-1, -1],
              deleted: false,
              description: "",
              discount: 0,
              final_price: 0,
              human_id: "9EDXRV",
              main_product: false,
              max_distance: 0,
              media: [],
              modified: {
                $date: 1570090521578
              },
              name: "Sneakers Size 9.5",
              parents: [
                {
                  $oid: "5d28560ff93362000cddcf94"
                },
                {
                  $oid: "5d2855e1f93362000ab82cc5"
                },
                {
                  $oid: "5d2854d2f93362000cddcf91"
                }
              ],
              path: "/",
              price: 0,
              price_change_percentage: 0,
              properties: {},
              short_description: "Size - 9.5",
              tags: ["size"],
              vat: 0
            }
          ] // This needs to be removed when the expand is fixed
        };
      }

      return undefined;
    })
    .filter(item => typeof item !== 'undefined');
};

const getMediaItems = items => {
  return items.map(item => ({
    id: item.human_id,
    image_url: item.url
  }));
};

const convertRecommendationsToProducts = (recommendations, type) => {
  return recommendations.map(item => item[type]);
};

export {
  generateProductCarouselItems,
  convertRecommendationsToProducts,
  getMediaItems
};
