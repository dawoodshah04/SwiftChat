import User from "../models/User.js";
import FriendRequest from "../models/FriendRequest.js";

export async function getRecommededUsers(req, res) {
    try {
        const currentUserId = req.user._id;
        const currentUser = req.user;

        const recommendedUsers = await User.find({
            $and: [
                {_id: { $ne: currentUserId }}, // Exclude current user
                {_id: { $nin: currentUser.friends }}, // Exclude friends
                {isOnboarded:true}
            ]
        });

        res.status(200).json(recommendedUsers);
    } catch (error) {
        console.log(`Error in getRecommendedUsers controller ${error.message}`)
        res.status(500).json({message:'Internal Server Error'});
    }
}


export async function getFriends(req, res) {
    try {
        const user = await User.findById(req.user._id).
        select('friends').
        populate('friends',"fullname profilePic learningLanguage nativeLanguage");
        res.status(200).json(user.friends);
    } catch (error) {
        console.log(`Erorr in getFriends controller ${error.message}`);
        res.status(500).json({message:'Internal Server Error'});
    }
}

export async function sendFriendRequest(req, res) {
    try {
        const id = req.user._id;
        const { id:recipientId } = req.params;


        // prevent sending req to yourself
        if(id === recipientId){
            return res.status(400).json({message:"You cannot send friend request to yourself"});
        }

        const recipient = await User.findById(recipientId);
        if(!recipient){
            return res.status(400).json({message:"Recipient not found"})
        }
        
        // check if already friends
        if(recipient.friends.includes(id)){
            return res.status(400).json({message:"You are already friend with this user: "+req.user.fullname})
        }

        // check if there is any pending req between the sender and recipient
        const existingReq = await FriendRequest.findOne({
            $or: [
                { sender: id, recipient: recipientId },
                { sender: recipientId, recipient: id }
            ]
        });

        if(existingReq){
            return res.status(400).json({message:"Pending friend request already exists"});
        }

        const frindRequest = await FriendRequest.create({
            sender:id,
            recipient:recipientId
        });

        res.status(200).json({message:"Friend request sent successfully"});

    } catch (error) {
        console.log(`Error in sendFriendRequest controller`);
        res.status(500).json({message:'Internal Server Error'});
    }
}

export async function acceptFriendRequest(req, res) {
    try {
        const { id:reqId} = req.params;
        const friendRequest = await FriendRequest.findById(reqId);

        if(!friendRequest){
            return res.status(400).json({message:"friend request not found"})
        }

        // check if the current user is the recipient of the friend request
        if(friendRequest.recipient.toString() !== req.user._id.toString()){
            return res.status(403).json({message:"You are not authorized to accept this friend request"});
        }

        friendRequest.status = 'accepted';
        await friendRequest.save();

        // add each user to friend list of each other
        // $addToSet operator adds a value to an array unless the value is already present, 
        // in which case it does nothing. This ensures that we don't have duplicate entries in the friends array.
        await User.findByIdAndUpdate(friendRequest.sender,{
            $addToSet:{friends:friendRequest.recipient}
        })
        
        await User.findByIdAndUpdate(friendRequest.recipient,{
            $addToSet:{friends:friendRequest.sender}
        })

        res.status(200).json({message:"Friend request accepted successfully"})
        
    } catch (error) {
        console.log(`Error in acceptFriendReq controller ${error.message}`);
        res.status(500).json({message:'Internal Server error'})
    }
}


export async function getFriendRequests(req, res){
    try {
        const incommingReq = await FriendRequest.find({
            recipient:req.user._id,
            status:'pending'
        }).populate('sender', 'fullname profilePic learningLanguage nativeLanguage');
        
        const acceptedReq = await FriendRequest.find({
            recipient:req.user._id,
            status:'accepted'
        }).populate('recipient', 'fullname profilePic');

        res.status(200).json({incommingReq, acceptedReq})
        

    } catch (error) {
        console.log(`Error in getFriendReq controller ${error.message}`);
        res.status(500).json({message:'Internal Server error'})
    }
}

export async function getOutgoingFriendRequest(req, res){
    try {

         const outgoingReq = await FriendRequest.find({
            sender:req.user._id,
            status:'pending'
        }).populate('recipient', 'fullname profilePic learningLanguage nativeLanguage');
        
        res.status(200).json(outgoingReq)
        
    } catch (error) {
        console.log(`Error in getOutgoingFriendReq controller ${error.message}`);
        res.status(500).json({message:'Internal Server error'})
    }
}