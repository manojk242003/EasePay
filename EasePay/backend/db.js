const mongoose = require("mongoose")

try {
 mongoose.connect('mongodb+srv://manojkanumuri007:1234567890@cluster0.msvlpc8.mongodb.net/');
    console.log("Connected to DB")
} 
catch (error) {
    handleError(error);
}

const userSchema = mongoose.Schema({
    username: {
        type:String,
        required:true,
        unique:true,
        minLength:3,
        maxLength:30,
        trim:true,
        lowercase:true
    },
    firstname:{
        type:String,
        required:true,
        maxLength:30,
        trim:true,
    },
    lastname: {
        type:String,
        required:true,
        maxLength:30,
        trim:true,
    },
    password:{
        type:String,
        required:true,
        minLength:6
    }
});

const User = mongoose.model("User",userSchema)

const accountSchema = mongoose.Schema({
    userId :{
        type : mongoose.Schema.Types.ObjectId,
        ref:'User',
        required :true
    },
    balance :{
        type:Number,
        required:true
    }
})

const Account = mongoose.model("Account",accountSchema)

module.exports={
    User,
    Account
}