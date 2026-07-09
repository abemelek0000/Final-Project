const userModel=require("../models/userModel");

async function searchUsers(req,res){

    try{

        const username=req.query.username;

        if(!username){

            return res.status(400).json({
                message:"Username query is required."
            });

        }

        const users=await userModel.searchUsers(username);

        res.json(users);

    }catch(error){

        console.error(error);

        res.status(500).json({
            message:"Internal Server Error"
        });

    }

}

async function getUserById(req, res) {

    try {

        const user = await userModel.getPublicProfile(req.params.id);

        if (!user) {
            return res.status(404).json({
                message: "User not found."
            });
        }

        res.json(user);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Internal Server Error"
        });

    }

}

module.exports={
    searchUsers,
    getUserById
};