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

module.exports = {
  createPoem,
  getAllPoems,
  getPoem
};