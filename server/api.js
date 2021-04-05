const cors = require('cors');
const express = require('express');
const helmet = require('helmet');
const dedicatedbrand = require('./sources/dedicatedbrand');
const loom = require('./sources/loom');
const db = require('./db'); 


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

app.get('/products/:id', async(request, response) => {
  
  try{
    
    const product =await db.find({'_id':request.params.id});
    console.log(product);
    await response.send(product);
  
   db.close();
  } catch (e) {
    response.send(e)
  
}

});

app.listen(PORT);
console.log(`📡 Running on port ${PORT}`);

