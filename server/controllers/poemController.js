const poemModel = require("../models/poemModel");

async function createPoem(req, res) {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        message: "Title and content are required."
      });
    }

    const poem = await poemModel.createPoem(
      req.user.id,
      title,
      content,
      "USER"
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

async function getAllPoems(req, res) {
  try {

    const poems = await poemModel.getAllPoems();

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

    await poemModel.incrementViews(req.params.id);

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

module.exports = {
  createPoem,
  getAllPoems,
  getPoem,
  updatePoem,
  deletePoem
};