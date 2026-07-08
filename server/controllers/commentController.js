const commentModel = require("../models/commentModel");

async function createComment(req, res) {
    try {
        const { comment } = req.body;

        if (!comment) {
            return res.status(400).json({
                message: "Comment is required."
            });
        }

        const newComment = await commentModel.createComment(
            req.params.poemId,
            req.user.id,
            comment
        );

        res.status(201).json({
            message: "Comment added successfully.",
            comment: newComment
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Internal Server Error"
        });
    }
}

async function getComments(req, res) {
    try {

        const comments = await commentModel.getCommentsByPoem(
            req.params.poemId
        );

        res.json(comments);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Internal Server Error"
        });
    }
}

async function updateComment(req, res) {
    try {

        const existing = await commentModel.getCommentById(req.params.id);

        if (!existing) {
            return res.status(404).json({
                message: "Comment not found."
            });
        }

        if (existing.user_id !== req.user.id) {
            return res.status(403).json({
                message: "You can only edit your own comments."
            });
        }

        const updated = await commentModel.updateComment(
            req.params.id,
            req.body.comment
        );

        res.json({
            message: "Comment updated successfully.",
            comment: updated
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Internal Server Error"
        });
    }
}

async function deleteComment(req, res) {
    try {

        const existing = await commentModel.getCommentById(req.params.id);

        if (!existing) {
            return res.status(404).json({
                message: "Comment not found."
            });
        }

        if (existing.user_id !== req.user.id) {
            return res.status(403).json({
                message: "You can only delete your own comments."
            });
        }

        await commentModel.deleteComment(req.params.id);

        res.json({
            message: "Comment deleted successfully."
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Internal Server Error"
        });
    }
}

module.exports = {
    createComment,
    getComments,
    updateComment,
    deleteComment
};