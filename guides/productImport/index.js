const Builton = require('@builton/node-sdk');
const products = require('./DemoStoreProducts');
const fs = require('fs');

const categories = [
  "Puma",
  "Adidas",
  "Nike",
  "Category"
];

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
  "image"
];

const productIds = [
  "5d2ed67ef1fc02000a6223e4",
  "5d28560ff93362000cddcf94",
  "5d2855e1f93362000ab82cc5",
  "5d2854d2f93362000cddcf91",
  "5d2853daf93362000ab82cbb"
];

if (!Builton) {
  throw new Error('BuiltOn was not found. Please install @builton/core-sdk')
}

const scrapData = (prod) => {
  const prodCopy = { ...prod };
  const prodKeys = Object.keys(prod);
  for (let i = 0; i < prodKeys.length; i += 1) {
    if (scrapItems.includes(prodKeys[i])) {
      delete prodCopy[prodKeys[i]];
    }
  }

  if (!prodCopy.main_product) {
    delete prodCopy['_sub_products'];
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

const getProductName = name => {
  return name.substring(name.lastIndexOf('/') + 1);
};

const importProducts = async () => {
  try {
    const args = process.argv;

    const keys = JSON.parse(args[2]);

    const builton = new Builton({
      endpoint: 'https://shareactor-backend-qa.herokuapp.com',
      apiKey: keys.apiKey,
      bearerToken: keys.serviceAccountKey
    });

    console.log(getSubProducts());``

    for (let i = 0; i < products.length; i += 1) {
      const prod = await builton.products.create(products[i]);
      // const category = categories.filter(category => products[i].tags.includes(category.toLowerCase()));
      // if (category.length > 0) {
      //   console.log(category[0]);
        // fs.readFile(`${__dirname}/images/${category}/Adidas - A.R. Trainer W.jpg`, async (err, data) => {
        //   try {
        //     const image = await builton.images.create({ buffer: data, filename: 'test.jpg' });
        //     console.log(image);
        //   } catch(err) {
        //     console.log(err);
        //   }
        // })
      }

      // const body = scrapData(products[i]);
      // const prod = await builton.products.create(body);
      // if (!prod.main_product) {
      //   productIds.push(prod._id.$oid);
      // } else {
      //   const subProducts = getSubProducts();
      // }
    // }


  } catch(err) {
    console.error(err)
  }
};

importProducts();
