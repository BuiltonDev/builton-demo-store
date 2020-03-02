const Builton = require("@builton/node-sdk");
const products = require("./DemoStoreProducts");
const cliProgress = require("cli-progress");

const subProducts = [];

function getRandomArbitrary(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

const getSubProducts = () => {
  let subProds = [];
  if (subProducts.length) {
    const shuffled = [...subProducts].map((item => item._id.$oid)).sort(() => 0.5 - Math.random());

    subProds = shuffled.slice(0, getRandomArbitrary(2, subProducts.length));
  }

  return subProds;
};

const getTagName = (name) => name.replace('Sneakers ', '').replace(' ', '').toLowerCase();

const getTags = (items) => {
  let tags = [];
  if (subProducts.length > 0) {
    tags = subProducts.map(item => {
      for (let i = 0; i < items.length; i += 1) {
        if (item._id.$oid === items[i]) {
          return getTagName(item.name);
        }
      }
    }).filter(item => !!item)
  }
  return tags;
};

const filterTags = (product) => {
  let tags = product.tags;
  if (tags.length > 0) {
    tags = product.tags.filter(tag => {
      if (!tag.startsWith('size')) {
        return tag;
      }
    })
  }
  return tags;
};

// create a new progress bar instance and use shades_classic theme
const progress = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);

const importProducts = async () => {
  try {
    const args = process.argv;

    const keys = JSON.parse(args[2]);

    const builton = new Builton({
      apiKey: keys.apiKey,
      bearerToken: keys.serviceAccountKey
    });

    progress.start(products.length, 0);
    for (let i = 0; i < products.length; i += 1) {
      const body = products[i];

      if (!products[i].main_product && !products[i].tags.includes("category")) {
        const prod = await builton.products.create(body);
        subProducts.push(prod);
      } else {
        if (!products[i].tags.includes("category")) {
          const subProds = getSubProducts();
          body["_sub_products"] = subProds;
          body["tags"] = [ ...filterTags(products[i]), ...getTags(subProds)];
        } else {
          body["tags"] = ["category"];
        }
        if (body.image) {
          const image = await builton.images.create({
            public_url: body.image.public_url,
            original_name: body.image.original_name
          });
          body.image = image._id.$oid;
        }

        await builton.products.create(body);
      }
      progress.increment(1);
    }
    progress.stop();
  } catch (err) {
    if (err.status === 401) {
      console.error(new Error('\n Authentication failed. Please check your API key and Service Account key.'))
    } else {
      console.error(err);
    }
    progress.stop();
    process.exit();
  }
};

importProducts();
