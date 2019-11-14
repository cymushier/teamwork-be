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
    if (req.files.image.ws.bytesWritten > 0) {
        cloudinary.uploader.upload(req.files.image.path, { tags: 'teamwork_be' })
            .then(image => {
                req.body.imageUrl = image.url;
                next();
            })
            .catch(_error => {
                res.status(400).json({
                    status: "failed",
                    data: {
                        message: 'Uploading image failed'
                    }
                })
            });
    } else {
        next();
    }
};
