const Builton = require("@builton/node-sdk");
const products = require("./DemoStoreProducts");

const objectItems = ["image"];

const scrapItems = [
  "_id",
  "_cls",
  "created",
  "modified",
  "active",
  "deleted",
  "company",
  "path",
  "human_id",
  "default_position",
  "max_distance",
  "company_take",
  "business_rules",
  "price_change_percentage",
  "parents",
  "image_url",
  "image._id",
  "image.created",
  "image.deleted",
  "image.modified",
  "image.company",
  "image.metadata",
  "image.stored_s3",
  "image.url",
  "image.original_file_type",
  "image.public",
  "media.human_id"
];

const productIds = [];

if (!Builton) {
  throw new Error("BuiltOn was not found. Please install @builton/core-sdk");
}

const scrapData = prod => {
  let prodCopy = { ...prod };
  const prodKeys = Object.keys(prod);

  for (let i = 0; i < objectItems.length; i += 1) {
    if (prodCopy[objectItems[i]]) {
      prodCopy[objectItems[i]] = prodCopy[objectItems[i]][0];
    }
  }

  for (let i = 0; i < prodKeys.length; i += 1) {
    for (let k = 0; k < scrapItems.length; k += 1) {
      if (scrapItems[k].indexOf(".") > -1) {
        const parts = scrapItems[k].split(".");
        if (prodKeys[i] === parts[0]) {
          if (
            prodCopy[parts[0]] &&
            prodCopy[parts[0]].constructor === Array &&
            prodCopy[parts[0]].length > 0
          ) {
            for (let j = 0; j <= prodCopy[parts[0]].length; j += 1) {
              if (prodCopy[parts[0]][j]) {
                delete prodCopy[parts[0]][j][parts[1]];
              }
            }
          } else if (prodCopy[parts[0]]) {
            delete prodCopy[parts[0]][parts[1]];
          } else {
            delete prodCopy[parts[0]];
          }
        }
      } else if (scrapItems[k] === prodKeys[i]) {
        delete prodCopy[prodKeys[i]];
      }
    }
  }

  if (!prodCopy.main_product) {
    delete prodCopy["_sub_products"];
  }

  return prodCopy;
};

function getRandomArbitrary(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

const getSubProducts = () => {
  let subProds = [];
  if (productIds.length) {
    // Shuffle array
    const shuffled = [...productIds].sort(() => 0.5 - Math.random());

    // Get sub-array of first n elements after shuffled
    subProds = shuffled.slice(0, getRandomArbitrary(2, productIds.length));
  }

  return subProds;
};

const importProducts = async () => {
  try {
    const args = process.argv;

    const keys = JSON.parse(args[2]);

    const builton = new Builton({
      endpoint: "https://shareactor-backend-qa.herokuapp.com",
      apiKey: keys.apiKey,
      bearerToken: keys.serviceAccountKey
    });

    for (let i = 0; i < products.length; i += 1) {
      const body = scrapData(products[i]);
      if (!products[i].main_product && !products[i].tags.includes('category')) {
        const prod = await builton.products.create(body);
        productIds.push(prod._id.$oid);
      } else {
        body["_sub_products"] = getSubProducts();
        console.log(body);
        await builton.products.create(body);
      }
    }
  } catch (err) {
    console.error(err);
  }
};

importProducts();
