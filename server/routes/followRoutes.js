const express=require("express");

const router=express.Router();

const authenticate=require("../middleware/authMiddleware");

const followController=require("../controllers/followController");

router.post("/:id",authenticate,followController.toggleFollow);

module.exports=router;