// const express = require('express')
// const session = require('express-session')
// const bodyParser = require('body-parser')
// cors = require("cors")

// const app = express();
// const routerDB = require('./Route/conDb')
// app.get('/', (req, res) => {
//   res.json({ message: 'Ahoy!' });
// });
// app.use(express.json({limit: '50mb'}))
// app.use(cors())
// app.use(bodyParser.urlencoded({extended:true}))
// app.use('/DB',routerDB) 
// app.listen(5000, () => {
//   console.log('Application is running on port 5000');
// });

const express = require('express')
const session = require('express-session')
const bodyParser = require('body-parser')
const PORT = process.env.PORT || 5000
cors = require("cors")

const app = express();
const routerDB = require('./Route/conDb');
app.get('/', (req, res) => {
  res.json({ message: 'hello!' });
});
app.use(express.json({limit: '50mb'}))
app.use(cors({
  origin: ['*','https://cmms-oa.herokuapp.com/DB/get/status/device/','http://localhost:3000']
}));
app.use(bodyParser.urlencoded({extended:true}))
app.use('/DB',routerDB) 
app.listen(PORT, () => {
  console.log('Application is running on port 5000');
});


