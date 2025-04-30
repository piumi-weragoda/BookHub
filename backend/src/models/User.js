import e from "express";
import mongoose from "mongoose"; 
import bcrypt from "bcryptjs";   

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
    },
    profileImage: {
        type: String,
        default: ""
    }
},{timestamps: true}

);

    // hash password before saving user to database
userSchema.pre("save", async function (next) {

    if (!this.isModified("password")) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    //NOTE - 123 => weragoda123
    this.password = await bcrypt.hash(this.password, salt);

    next();
})

// compare password function

userSchema.methods.comparePassword = async function (userPassword) {
    return await bcrypt.compare(userPassword, this.password);
    //user password is the password entered by the user and this password is the password stored in the database
}

const User = mongoose.model("User", userSchema);
//users - likewise User convert in to users


export default User;