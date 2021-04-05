const cors = require('cors');
const express = require('express');
const helmet = require('helmet');
const dedicatedbrand = require('./sources/dedicatedbrand');
const loom = require('./sources/loom');
const db = require('./db'); 
const sandboxdb = require('./sandbox-db');

const PORT = 8092;

const app = express();

module.exports = app;

app.use(require('body-parser').json());
app.use(cors());
app.use(helmet());

app.options('*', cors());

app.get('/', (request, response) => {
  response.send({'ack': true});
});

app.get('/products/:id', (request, response) => {
  async function test() {
  try{
    const product =await db.find({'_id': request.params.id});
    response.send(product);
  
   db.close();
  } catch (e) {
    console.error(e);
  }
}
test();
});

app.listen(PORT);
console.log(`📡 Running on port ${PORT}`);

