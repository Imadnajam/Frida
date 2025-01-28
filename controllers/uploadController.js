const path = require('path');
const fs = require('fs');
const ffmpeg = require('fluent-ffmpeg');

// File upload handler
exports.uploadFile = (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded');
    }

    const filePath = req.file.path;

 
    const outputFilePath = path.join(__dirname, '..', 'uploads', 'compressed_' + req.file.originalname);

    ffmpeg(filePath)
        .output(outputFilePath)
        .on('end', () => {
         
            res.json({
                message: 'File processed successfully',
                originalFile: req.file.originalname,
                compressedFile: path.basename(outputFilePath),
            });
        })
        .on('error', (err) => {
            console.error(err);
            res.status(500).send('Error processing the file');
        })
        .run();
};
