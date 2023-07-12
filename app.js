const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
const sib = require('sib-api-v3-sdk');
const dotenv = require('dotenv');


// const fs=require('fs')
// const https=require('https');
// const privateKey=fs.readFileSync('server.key');
// const certificate=fs.readFileSync('server.key');

// const helmet=require('helmet');
// const compression=require('compression')


var cors = require('cors')
dotenv.config();

// const morgan=require('morgan')
// app.use(morgan('combined'));





const sequelize = require('./util/database');
app.use(cors());
// app.use(helmet());
// app.use(compression())
app.use(express.json());  //this is for handling jsons
// get config vars

app.use(bodyParser.json({ extended: false })); ////this is for handling forms


const User = require('./models/users');
const Expense = require('./models/expenses');
const Order = require('./models/orders');
const Forgotpassword = require('./models/forgotpassword');
const downloadFile = require('./models/downloadFile');


const userRoutes = require('./routes/user');
const expenseRoutes = require('./routes/expense');
const purchaseRoutes = require('./routes/purchase');
const premiumFeatureRoutes = require('./routes/premiumFeature');
const resetPasswordRoutes = require('./routes/resetpassword')
const downloadroutes = require('./routes/user')






app.use('/user', userRoutes);
app.use('/expense', expenseRoutes);
app.use('/purchase', purchaseRoutes);
app.use('/premium', premiumFeatureRoutes);
app.use('/password', resetPasswordRoutes);


// app.use((req, res) => {n
//     console.log('urlll', req.url);
//     res.sendFile(path.join(__dirname, `ExpenseTrackerFrontend/${req.url}`))
// })

User.hasMany(Expense);
Expense.belongsTo(User);

User.hasMany(Order);
Expense.belongsTo(User);

User.hasMany(Forgotpassword);
Forgotpassword.belongsTo(User);

sequelize.sync()
    .then(() => {
        
    app.listen(process.env.PORT);
    // https.createServer({key:privateKey,cert:certificate},app).listen(process.env.PORT);


    })
    .catch(err => {
        console.log(err);
    })
