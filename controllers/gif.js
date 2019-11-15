const { executeInsert, execute } = require('../models/base-model');

exports.createGif = (req, res) => {
    try {
        const { imageUrl, title, description, userId } = req.body;
        if (!imageUrl || !title) {
            res.status(400).json({
                status: "error",
                error: "Mising required parameters. Try again."
            });
            return;
        }

        // Insert the gif
        executeInsert(
            "posts", ["post_type", "url", "title", "article", "author_id"],
            ["gif", imageUrl, title, description, userId], result => {
                if (result) {
                    res.status(201).json({
                        status: "success",
                        data: {
                            gifId: "",
                            message: "GIF image successfully posted",
                            createdOn: "",
                            title: title,
                            imageUrl: imageUrl
                        }
                    });
                } else {
                    res.status(400).json({
                        status: "error",
                        error: "Could not successfully create GIF. Try again."
                    });
                }
            });
    } catch (error) {
        console.log(`Error: ${error}`);
        res.status(500).json({
            status: "error",
            error: "Internal server error"
        });
    }
};