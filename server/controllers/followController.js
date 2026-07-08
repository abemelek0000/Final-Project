const followModel = require("../models/followModel");

async function toggleFollow(req,res){

    try{

        const follower=req.user.id;
        const following=req.params.id;

        const exists=await followModel.isFollowing(follower,following);

        if (req.user.id === Number(req.params.id)) {
            return res.status(400).json({
               message: "You cannot follow yourself."
             });
       }
       
        if(exists){

            await followModel.unfollowUser(follower,following);

            const count=await followModel.followerCount(following);

            return res.json({
                message:"User unfollowed.",
                followers:count.followers
            });

        }

        await followModel.followUser(follower,following);

        const count=await followModel.followerCount(following);

        res.json({
            message:"User followed.",
            followers:count.followers
        });

    }catch(error){

        console.error(error);

        res.status(500).json({
            message:"Internal Server Error"
        });

    }

}

module.exports={toggleFollow};