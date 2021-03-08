/* eslint-disable no-console, no-process-exit */
const dedicatedbrand = require('./sources/dedicatedbrand');
const MudJeansbrand = require('./sources/MudJeansbrand');
const AdresseParisbrand = require('./sources/AdresseParisbrand');


var toast = async function () {
	const pages = await dedicatedbrand.getPages('https://www.dedicatedbrand.com');
  return pages
}

const page = toast();
const {MongoClient} = require('mongodb');
const MONGODB_URI = 'mongodb+srv://Bob:Bob01@cluster0.omlut.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';
const MONGODB_DB_NAME = 'clearfashion';


const config = {
  useNewUrlParser: true,
  useUnifiedTopology: true
};


var test = async function () {
	const client = await MongoClient.connect(MONGODB_URI, config);
	const db =  client.db(MONGODB_DB_NAME);
	const collection = db.collection('products');
	const result = collection.insertMany(products);
  return result
}
const result_test = test();


const products_data = [];

async function sandbox (eshop = 'https://www.dedicatedbrand.com/en/men/news') {
  try {
    console.log(`🕵️‍♀️  browsing ${eshop} source`);

    const products = await dedicatedbrand.scrape(eshop);

    console.log(products);
    console.log('done');
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}


async function steelbox (ishop = 'https://adresse.paris/602-nouveautes') {
  try {
    console.log(`🕵️‍♀️  browsing ${ishop} source`);

    const products = await AdresseParisbrand.scrape(ishop);

    console.log(products);
    console.log('done');
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

async function silverbox (yshop = 'https://mudjeans.eu/collections/men-buy-jeans') {
  try {
    console.log(`🕵️‍♀️  browsing ${yshop} source`);

    const products = await MudJeansbrand.scrape(yshop);

    console.log(products);
    console.log('done');
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

const [,, eshop] = process.argv;
const [,, ishop] = process.argv;
const [,, yshop] = process.argv;



console.log(result_test);

//sandbox(eshop);
//steelbox(ishop);
silverbox(yshop);
