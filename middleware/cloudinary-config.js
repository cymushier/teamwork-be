const cloudinary = require('cloudinary').v2

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

/**
 * Middleware to intercept files and push them to Cloudinary. 
 * Once file is uploaded, create `imageUrl` in body with the image URL from cloudinary.
 */
module.exports = (req, res, next) => {
    try {
        if (req.files) {
            const image = req.files.image;
            if (image) {
                cloudinary.uploader.upload(image.tempFilePath, { tags: 'teamwork_be' })
                    .then(image => {
                        req.body.imageUrl = image.url;
                        next();
                    }).catch(error => {
                        console.log(error);
                        res.status(400).json({
                            status: "error",
                            error: 'Uploading image failed'
                        });
                    });
                return;
            }
        }
        next();
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: "error",
            error: 'Uploading image failed. Internal Server Error'
        });
    }
};
