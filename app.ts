import express, { Request, Response } from 'express';
import multer, { Multer } from 'multer';
import ffmpeg from 'fluent-ffmpeg';
import path from 'path';
import fs from 'fs';

const app = express();

// Configure multer for handling file uploads
const upload: Multer = multer({ dest: 'uploads/' });

// TypeScript interface for Multer request file
interface MulterRequest extends Request {
    file: Express.Multer.File;
}

// Endpoint for uploading and compressing video
app.post('/compress', upload.single('video'), (req: MulterRequest, res: Response) => {
    const inputPath = req.file.path;
    const outputPath = `compressed_${req.file.originalname}`;

    // Compress the video to 50% of the original resolution
    ffmpeg(inputPath)
        .videoCodec('libx264')
        .size('50%') // Reduce the resolution to 50%
        .output(outputPath)
        .on('end', () => {
            // Send the compressed video back to the client
            res.download(outputPath, (err) => {
                if (err) {
                    console.error('Error sending file:', err);
                }
                // Clean up temporary files
                fs.unlinkSync(inputPath);
                fs.unlinkSync(outputPath);
            });
        })
        .on('error', (err: Error) => {
            console.error('Error processing video:', err);
            res.status(500).send('Error processing video');
        })
        .run();
});

// Start the Express server
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
