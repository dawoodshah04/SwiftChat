import User from "../models/User.js";
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { upsertStreamUser } from "../lib/stream.js";

export const signup = async (req, res) => {
    
    const {fullname, email, password} =  req.body;

     

     try {
        if(!fullname || !email || !password){
            return res.status(400).json({message:'All fields are required'})
        }
        
        if(password.length < 6){
           return res.status(400).json({message:'Password Length must be at least of 6 chars'})
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!emailRegex.test(email)){
            return res.status(400).json({message:'Invaid Email format'})
        }

        const existingUser = await User.findOne({email})
        if(existingUser){
            return res.status(400).json({message:'User with this email already exists'})
        }

        const profileImg = `https://ui-avatars.com/api/?name=${fullname}`;

        const newUser = new User({
            fullname,
            email,
            password,
            profilePic:profileImg,
        })



        try {
            await upsertStreamUser({
                id: newUser._id.toString(),
                name: newUser.fullname,
                image: newUser.profilePic || "",
            })

            console.log(`Stream User created with username: ${newUser.fullname}`)
        } catch (error) {
            console.log('Error in creating stream user',error)
        }

        await newUser.save();
        //TODO: create user in stream


        


        const token = jwt.sign({userId:newUser._id}, process.env.JWT_SECRET, {expiresIn: '5d'})

        res.cookie('jwt',token,{
            httpOnly:true,
            maxAge: 5*24*60*60*1000, //5 days
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
        })

        res.status(201).json({newUser, token,message:'User created successfully'})
        
     } catch (error) {
        console.log('Error in signup controller',error.message)
        res.status(500).json({message:'Internal Server Error'})
     }
    
}

export const login = async (req, res) => {
    try {
        const {email, password} = req.body;

        if(!email || !password){
            return res.status(400).json({message:'All fields are required'})
        }

        const user = await User.findOne({email})
        if(!user){
            return res.status(401).json({message:'Invalid credentials'})
        }
        const isPasswordCorrect = await user.matchPassword(password)
        if(!isPasswordCorrect){
            return res.status(401).json({message:'Invalid password'})
        }

        const token = jwt.sign({userId:user._id}, process.env.JWT_SECRET, {expiresIn: '5d'})

        res.cookie('jwt',token,{
            httpOnly:true,
            maxAge: 5*24*60*60*1000, //5 days
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
        })


        res.status(200).json({user,token, message:'Login Successful'})



    } catch (error) {
        console.log('Error in login controller',error.message)
        res.status(500).json({message:'Internal Server Error'})
    }
}

export const logout = async (req, res) => {
    res.clearCookie('jwt')
    res.status(200).json({message:'logout successful'})
}

export const onboard = async (req, res) => {
    
    try {
        const userId = req.user._id;
        const {fullname, bio, nativeLanguage, learningLanguage, location} = req.body;

        if(!fullname || !bio || !nativeLanguage || !learningLanguage || !location){
            return res.status(400).json({message:'All fields are required for onboarding',
                missingFields:[
                    !fullname && 'fullname',
                    !bio && 'bio',
                    !nativeLanguage && 'nativeLanguage',
                    !learningLanguage && 'learningLanguage  ',
                    !location && 'location',
                ].filter(Boolean)
            })
        }

        const updateUser = await User.findByIdAndUpdate(userId, {
            ...req.body,
            isOnboarded:true,
        },{ new:true})
        
        if(!updateUser){
            return res.status(400).json({message:'User not found'})
        }


        try {
            await upsertStreamUser({
                id: updateUser._id.toString(),
                name: updateUser.fullname,
                image: updateUser.profilePic || "",
            })
            console.log(`Stream User updated after onboarding for user ${updateUser.fullname}`)
        } catch (streamError) {
            console.log(`Error in updating the user on stream during onboarding ${streamError.meassage}`)
        }

        res.status(200).json({user:updateUser, message:'Onboarding completed successfully'})
    } catch (error) {
        console.log('Error in onboarding controller',error.message)
        res.status(500).json({message:'Internal Server Error'})
    }
}