const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true, 'User name is required'],
        trim : true,

    },
    email:{
        type: String,
        required: [true, 'Email is required'],
        trim: true,
        lowercase: true,
        unique:true,
        match: [/\S+@\S+\.\S+/, 'Please enter a valid email address'],
        index: true
    },
    password:{
        type: String,
        required: [true,'Please enter a password'],
        minlength:[6, 'Password must be aleast 6 character long'],
        select: false
    },
    avatar: {
        type: String,
        trim: true,
        default: null
    },
    isVerified:{
        type: Boolean,
        default: false
    },
    googleId:{
        type: String,
        unique: true,
        sparse: true
    }

},{timestamps: true});


userSchema.pre('save', async function(next){
    if(!this.isModified.password){
        return next();
    };
    try {
        this.password = await argon2.hash(this.password,{
            type: argon2.argon2id
        })
    } catch (error) {
        console.error('Error hashing the password', error)
        next(error)
    }
})

userSchema.methods.comparePassword = async function (candidatePassword){
    try{
        return await argon2.verify(this.password,candidatePassword)
    }
    catch(error){
        console.error("Please enter correct password", error);
        return false;
    }
}
const User = mongoose.model('User', userSchema);

module.exports = User;  