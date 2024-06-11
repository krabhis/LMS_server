import {Schema , model} from "mongoose";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';


const userSchema= new Schema({
    fullName: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50,
        trim: true // Ensure no leading/trailing whitespace
    },
    email:{
        type:'String',
        required:[true, 'Email is required'],
        lowercase:true,
        trim:true,
        unique:true,
        match:[  /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                  'Please fill in a valid email address',

        ],
    },
    password:{
        type:"String",
        required: [true, 'Password is required'],
        minLength: [8,'Password must be atleast 8 characters'],
        select:false

    },
    role:{
        type:'String',
        enum:['USER','ADMIN'],
        default:'USER'
    },
    avatar:{
        public_id:{
            type:'String'
        },
        secure_url:{
            type:'String'
        }
    },
    forgetPasswordToken:String,
    forgetPasswordExpiry:Date,
    subscription:{
        id: String,
        status: String


    }
},
{
    timestamps:true

});
userSchema.pre('save', async function(next){
    if(!this.isModified('password')){
        return next();
    }
    this.password= await bcrypt.hash(this.password, 10);
    return next();

});

userSchema.methods={
    generateJWTToken:  function(){
        return  jwt.sign(
            { 
                 id:this._id,
                 email: this.email,
                 subscription: this.subscription , 
                 role:this.role
                },
                 process.env.JWT_SECRET,
            {
                expiresIn: process.env.JWT_EXPIRY,
             }

             

        );
    },
    generatePasswordResetToken: async function () {
        // creating a random token using node's built-in crypto module
        const resetToken = crypto.randomBytes(20).toString('hex');
    
        // Again using crypto module to hash the generated resetToken with sha256 algorithm and storing it in database
        this.forgotPasswordToken = crypto
          .createHash('sha256')
          .update(resetToken)
          .digest('hex');
    
        // Adding forgot password expiry to 15 minutes
        this.forgotPasswordExpiry = Date.now() + 15 * 60 * 1000;
    
        return resetToken;
    },
comparePassword: async function(plainTextPassword){
    return await bcrypt.compare(plainTextPassword, this.password)
},




};

const User = model('User', userSchema);

export default User;