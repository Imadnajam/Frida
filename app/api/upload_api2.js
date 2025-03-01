
/**
 * Uploads a file, converts it to markdown, and generates an AI summary
 * @param {File} file - The file to upload and process
 * @returns {Promise<{markdownContent: string, aiSummary: string, metadata: Object}>}
 */
export async function uploadFile(file) {
    if (!file) {
        throw new Error("No file provided");
    }

    try {
        // Create form data
        const formData = new FormData();
        formData.append("file", file);

        // Step 1: Upload and convert the file
        const conversionResponse = await fetch("/api/py/convert", {
            method: "POST",
            body: formData,
        });

        if (!conversionResponse.ok) {
            const errorData = await conversionResponse.json();
            throw new Error(errorData.error || "Failed to convert file");
        }

        const conversionData = await conversionResponse.json();

        if (!conversionData.success) {
            throw new Error(conversionData.message || "Conversion unsuccessful");
        }

        const summaryResponse = await fetch("/api/py/summarize", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                markdown: conversionData.rawMarkdown,
                filename: file.name,
                fileType: file.type,
            }),
        });

        if (!summaryResponse.ok) {
            // If summary fails, we can still return the conversion result
            console.warn("Failed to generate summary, but conversion was successful");

            return {
                markdownContent: conversionData.markdownContent,
                aiSummary: "Unable to generate summary for this document.",
                metadata: conversionData.metadata,
            };
        }

        const summaryData = await summaryResponse.json();

        // Return combined results
        return {
            markdownContent: conversionData.rawMarkdown,
            aiSummary: summaryData.summary,
            metadata: conversionData.metadata,
        };
    } catch (error) {
        console.error("Error in uploadFile:", error);
        throw error.message || "Failed to process file";
    }
}

/**
 * Gets a list of supported file formats
 * @returns {Promise<{formats: Array, maxFileSize: number}>}
 */
export async function getSupportedFormats() {
    try {
        const response = await fetch("/api/py/supported-formats");

        if (!response.ok) {
            throw new Error("Failed to fetch supported formats");
        }

        return await response.json();
    } catch (error) {
        console.error("Error fetching supported formats:", error);
        throw error;
    }
}

/**
 * Utility function to check if a file is supported before upload
 * @param {File} file - The file to check
 * @returns {Promise<boolean>}
 */
export async function isFileSupported(file) {
    try {
        const { formats, maxFileSize } = await getSupportedFormats();

        // Check file size
        if (file.size > maxFileSize) {
            return false;
        }

        // Check file type
        const supportedMimes = formats.map(format => format.mime);
        return supportedMimes.includes(file.type);
    } catch (error) {
        console.error("Error checking file support:", error);
        return false;
    }
}