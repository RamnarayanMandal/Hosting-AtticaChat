const mongoose = require('mongoose');

const branchSchema = mongoose.Schema({
    branch_id:{
        type:String,
        required:true,
        unique:true
    },
    branch_name:{
        type:String,
        required:true
    },
    branch_address:{
        type:String,
        required:true
    },
    branch_city:{
        type:String,
        required:true
    },
    branch_state:{
        type:String,
        required:true
    },

    branch_pincode:{
        type:String,
        required:true
    },

    branch_phoneNO:{
        type:String,
        required:true
    },
},{ timestamps: true })

module.exports = mongoose.model('Branch', branchSchema);