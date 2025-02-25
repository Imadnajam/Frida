export const uploadFile = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
        const response = await fetch("/api/py/upload", {
            method: "POST",
            body: formData,
        });

        if (response.ok) {
            const data = await response.json();
            console.log("API Response:", data);

            if (data.markdownContent && data.aiSummary) {
                return {
                    markdownContent: data.markdownContent,
                    aiSummary: data.aiSummary,
                };
            } else {
                console.error("Markdown content or AI summary not found in response");
                throw new Error("Failed to extract markdown content or AI summary.");
            }
        } else {
            throw new Error("File upload failed");
        }
    } catch (error) {
        console.error("Upload error:", error);
        throw new Error("Error uploading file");
    }
};
