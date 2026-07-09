const poemModel = require("../models/poemModel");

async function createPoem(req, res) {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        message: "Title and content are required."
      });
    }

    const sourceType = req.user.role === "ADMIN" ? "ADMIN" : "USER";

    const poem = await poemModel.createPoem(
      req.user.id,
      title,
      content,
      sourceType
    );

    res.status(201).json({
      message: "Poem created successfully.",
      poem
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Internal Server Error"
    });
  }
}

async function adminPoems(req,res){

    try{

        const viewerId = req.user ? req.user.id : null;

        const poems =
            await poemModel.getAdminPoems(viewerId);

        res.json(poems);

    }

    catch(error){

        console.error(error);

        res.status(500).json({

            message:"Internal Server Error"

        });

    }

}


async function userPoems(req,res){

    try{

        const viewerId = req.user ? req.user.id : null;

        const poems =
            await poemModel.getUserPoems(viewerId);

        res.json(poems);

    }

    catch(error){

        console.error(error);

        res.status(500).json({

            message:"Internal Server Error"

        });

    }

}


async function myPoems(req, res) {

    try {

        const poems = await poemModel.getMyPoems(req.user.id);

        res.json(poems);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Internal Server Error"
        });
    }

}


async function getAllPoems(req, res) {
  try {

    const viewerId = req.user ? req.user.id : null;

    const poems = await poemModel.getAllPoems(viewerId);

    res.json(poems);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Internal Server Error"
    });
  }
}

async function getPoem(req, res) {
  try {

    const poem = await poemModel.getPoemById(req.params.id);

    if (!poem) {
      return res.status(404).json({
        message: "Poem not found."
      });
    }

    res.json(poem);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Internal Server Error"
    });
  }
}

async function updatePoem(req, res) {
  try {

    const poem = await poemModel.getPoemById(req.params.id);

    if (!poem) {
      return res.status(404).json({
        message: "Poem not found."
      });
    }

    if (poem.author_id !== req.user.id) {
      return res.status(403).json({
        message: "You can only edit your own poems."
      });
    }

    const updated = await poemModel.updatePoem(
      req.params.id,
      req.body.title,
      req.body.content
    );

    res.json({
      message: "Poem updated successfully.",
      poem: updated
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Internal Server Error"
    });
  }
}

async function deletePoem(req, res) {
  try {

    const poem = await poemModel.getPoemById(req.params.id);

    if (!poem) {
      return res.status(404).json({
        message: "Poem not found."
      });
    }

    if (poem.author_id !== req.user.id) {
      return res.status(403).json({
        message: "You can only delete your own poems."
      });
    }

    await poemModel.deletePoem(req.params.id);

    res.json({
      message: "Poem deleted successfully."
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Internal Server Error"
    });
  }
}

async function featuredPoem(req,res){

    try{

        const poem=await poemModel.getFeaturedPoem();

        if(!poem){

            return res.status(404).json({
                message:"No featured poem available."
            });

        }

        res.json(poem);

    }catch(error){

        console.error(error);

        res.status(500).json({
            message:"Internal Server Error"
        });

    }

}

async function adminDeletePoem(req, res) {

    try {

        const poem = await poemModel.getPoemById(req.params.id);

        if (!poem) {

            return res.status(404).json({
                message: "Poem not found."
            });

        }

        await poemModel.deletePoem(req.params.id);

        res.json({
            message: "Poem deleted successfully by admin."
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Internal Server Error"
        });

    }

}

async function viewPoem(req, res) {
  try {

    const views = await poemModel.incrementViews(req.params.id);

    res.json({ views });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Internal Server Error"
    });
  }
}

async function poemsByAuthor(req, res) {
  try {

    const viewerId = req.user ? req.user.id : null;

    const poems = await poemModel.getPoemsByAuthor(req.params.id, viewerId);

    res.json(poems);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Internal Server Error"
    });
  }
}

module.exports = {
  createPoem,
  getAllPoems,
  getPoem,
  updatePoem,
  deletePoem,
  featuredPoem,
  adminDeletePoem,
  adminPoems,
  userPoems,
  myPoems,
  viewPoem,
  poemsByAuthor
};