import fetch from 'node-fetch';
import fs from 'fs/promises'; // Import fs as a promise-based module for file operations

async function query(data) {
    const response = await fetch(
        "https://api-inference.huggingface.co/models/NouRed/sd-fashion-products",
        {
            headers: { Authorization: "Bearer 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" },
            method: "POST",
            body: JSON.stringify(data),
        }
    );
    const result = await response.blob();
    return result;
}

query({ "inputs": "party t-shirt for men" }).then(async (response) => {
    // Convert Blob to Buffer
    const buffer = Buffer.from(await response.arrayBuffer());

    // Write the Buffer to a file with appropriate file extension based on content type
    const contentType = response.type;
    let extension = '.png'; // Default extension
    if (contentType === 'image/jpeg') {
        extension = '.jpg';
    } else if (contentType === 'image/gif') {
        extension = '.gif';
    } // Add more conditions as needed for other image formats

    await fs.writeFile(`output${extension}`, buffer);
    
    console.log(`Image saved as output${extension}`);
}).catch((error) => {
    console.error('Error:', error);
});
