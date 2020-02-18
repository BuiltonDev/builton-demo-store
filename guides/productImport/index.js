const Builton = require("@builton/node-sdk");
const products = require("./DemoStoreProducts");
const cliProgress = require("cli-progress");

const productIds = [];

if (!Builton) {
  throw new Error("BuiltOn was not found. Please install @builton/node-sdk");
}

function getRandomArbitrary(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

const getSubProducts = () => {
  let subProds = [];
  if (productIds.length) {
    const shuffled = [...productIds].sort(() => 0.5 - Math.random());

    subProds = shuffled.slice(0, getRandomArbitrary(2, productIds.length));
  }

  return subProds;
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
        productIds.push(prod._id.$oid);
      } else {
        body["_sub_products"] = getSubProducts();
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
    console.error(err);
    progress.stop();
    process.exit();
  }
};

importProducts();
