const mongoose = require('mongoose');

    //CATOSHI db
    mongoose.connect('mongodb+srv://{user}:{password}@cluster0.ptugc.mongodb.net/crogeBridgeTestnet?retryWrites=true&w=majority',{useNewUrlParser: true, useUnifiedTopology: true}, (err) =>{
        if(!err){
            console.log('MongoDB connected successfully')
        }
        else{
            console.log('Error in connecting Mongodb', err);
        }
    })

require('./transactionDetails')