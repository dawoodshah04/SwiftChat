import mongoose from "mongoose";
import bcrypt from 'bcryptjs'

const userSchema = mongoose.Schema(
  {
    fullname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, minLength: 6 },
    bio: { type: String, default: "" },
    profilePic: { type: String, default: "" },
    nativeLanguage: { type: String, default: "" },
    learningLanguage: { type: String, default: "" },
    location: { type: String, default: "" },
    onBoarding: { type: Boolean, default: false },
    friends: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true },
);
//prehook for password hashing
userSchema.pre("save", async function(){

    if(!this.isModified("password")) return;

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hashSync(this.password, salt);
    } catch (error) {
        console.log('Error in password Hashing',error)
    }
})


userSchema.methods.matchPassword = async function(enteredPassword){

    return await bcrypt.compareSync(enteredPassword, this.password)
}
const User = mongoose.model("User", userSchema);

export default User;
