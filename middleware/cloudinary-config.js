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
                const supportedFiles = [
                    'image/gif', 'image/png', 'image/jpg', 'image/jpeg', 'image/pipeg',
                    'image/svg+xml', 'image/tiff', 'image/bmp'
                ]
                if (supportedFiles.find(p => p == image.mimetype)) {
                    cloudinary.uploader.upload_stream({ tags: 'teamwork_be' }, (error, result) => {
                        if (error) {
                            console.log(error);
                            res.status(400).json({
                                status: "error",
                                error: 'Uploading image failed'
                            });
                        } else {
                            req.body.imageUrl = result.url;
                            next();
                        }
                    }).end(image.data);
                } else {
                    console.log(`MIME Type: [${image.mimetype}] Not Found`);
                    res.status(400).json({
                        status: "error",
                        error: 'Unsupported file type'
                    });
                }
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
