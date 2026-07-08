const likeModel = require("../models/likeModel");

async function toggleLike(req, res) {
    try {

        const userId = req.user.id;
        const poemId = req.params.id;

        const existingLike = await likeModel.hasLiked(userId, poemId);

        if (existingLike) {

            await likeModel.unlikePoem(userId, poemId);

            const likes = await likeModel.countLikes(poemId);

            return res.json({
                message: "Poem unliked.",
                likes: likes.likes
            });
        }

        await likeModel.likePoem(userId, poemId);

        const likes = await likeModel.countLikes(poemId);

        res.json({
            message: "Poem liked.",
            likes: likes.likes
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Internal Server Error"
        });
    }
}

module.exports = {
    toggleLike
};