#  File to Markdown Converter

![Cover](https://raw.githubusercontent.com/Imadnajam/Frida/main/Cover.png)

A **cutting-edge**, **web-based platform** built with **Next.js** for the frontend and **FastAPI** for the backend, designed to convert office documents and files (e.g., Word, Excel, PowerPoint, PDF) into **Markdown** format. This tool simplifies document conversion for developers, writers, and project managers by quickly transforming complex files into lightweight and easy-to-use Markdown files.

> **Powered by GPT-NeoX**: This project harnesses the capabilities of GPT-NeoX, an open-source autoregressive language model, to intelligently parse and convert documents while preserving their semantic structure and formatting.

---

## 🚀 **Why Contribute?**

This project is **open-source** and thrives on community contributions. Whether you're a developer, designer, or documentation enthusiast, your contributions can help make this tool even better! Here's why you should join us:

- **Impact**: Help thousands of users streamline their document conversion process.
- **Learn & Grow**: Work with modern technologies like Next.js, FastAPI, and GPT-NeoX.
- **Collaborate**: Join a vibrant community of developers and contributors.
- **Recognition**: Get your name featured in our contributors' list and gain visibility in the open-source world.

---

## 💡 **What is it?**

The **File-to-Markdown Converter** is a **fast, reliable, and efficient web tool** that allows users to upload documents (e.g., DOCX, PDF, XLSX, PPTX), convert them into Markdown format, and download the output instantly. Markdown is a popular format for documentation and content creation, making this tool perfect for anyone looking to streamline content management.

This tool is built using:

- **Next.js**: A React-based framework for server-side rendering, ensuring a fast and responsive frontend experience.
- **FastAPI**: A high-performance, asynchronous Python web framework that powers the backend API for file conversion.
- **GPT-NeoX**: An advanced language model that enhances document parsing and conversion accuracy.

---

## 🎯 **Key Features**

- **AI-Powered Conversion**: GPT-NeoX intelligently processes documents to maintain semantic meaning and structure.
- **Convert DOCX to Markdown**: Effortlessly convert Word documents to structured Markdown.
- **Excel to Markdown**: Extract data from Excel spreadsheets into Markdown tables.
- **PowerPoint to Markdown**: Generate Markdown from PowerPoint slides (text, bullet points, images).
- **PDF to Markdown**: Extract text and structure from PDF files to Markdown format.
- **Real-time Preview**: Preview your converted Markdown before downloading.
- **Customizable Conversion Options**: Choose specific sections, formats, and customizations when converting.
- **FastAPI Backend**: Built with high-speed, non-blocking FastAPI, handling multiple conversions simultaneously.
- **Next.js Frontend**: Provides a fast, responsive, and dynamic UI for users.
- **File History**: Users can view their previously converted files and download them anytime.

---

## 🛠️ **How It Works**

1. **Upload Your File**: Drag and drop your document (Word, Excel, PowerPoint, PDF) into the upload section.
2. **AI Processing**: Your document is analyzed by GPT-NeoX to understand its structure and content.
3. **Conversion**: The file is processed by the FastAPI backend, converting the document into Markdown.
4. **Preview**: View the Markdown output directly in the browser with live updates.
5. **Download**: Download the Markdown file for use in your documentation, blog, or project.

---

## 🧩 **Code Examples**

### Frontend File Upload Component (Next.js)

```jsx
import { useState } from 'react';
import { Upload } from 'lucide-react';

export default function FileUploader() {
  const [file, setFile] = useState(null);
  const [converting, setConverting] = useState(false);
  const [preview, setPreview] = useState('');
  
  const handleUpload = async (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    
    if (!selectedFile) return;
    
    // Create form data
    const formData = new FormData();
    formData.append('file', selectedFile);
    
    try {
      setConverting(true);
      const response = await fetch('/api/convert', {
        method: 'POST',
        body: formData,
      });
      
      const data = await response.json();
      setPreview(data.markdown);
      setConverting(false);
    } catch (error) {
      console.error('Conversion failed:', error);
      setConverting(false);
    }
  };
  
  return (
    <div className="w-full max-w-md mx-auto">
      <label className="flex flex-col items-center p-6 bg-white rounded-lg shadow-lg cursor-pointer border-2 border-dashed border-gray-300 hover:border-blue-500">
        <Upload className="w-10 h-10 text-blue-500" />
        <span className="mt-2 text-sm text-gray-600">
          {file ? file.name : 'Upload your file'}
        </span>
        <input
          type="file"
          className="hidden"
          onChange={handleUpload}
          accept=".docx,.xlsx,.pptx,.pdf,.txt"
        />
      </label>
      
      {converting && <p className="mt-4 text-center">Converting...</p>}
      
      {preview && (
        <div className="mt-6">
          <h3 className="text-lg font-medium">Preview:</h3>
          <div className="mt-2 p-4 bg-gray-100 rounded overflow-auto">
            <pre>{preview}</pre>
          </div>
          <button 
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg"
            onClick={() => {
              // Download logic
              const blob = new Blob([preview], { type: 'text/markdown' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `${file.name.split('.')[0]}.md`;
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
              URL.revokeObjectURL(url);
            }}
          >
            Download Markdown
          </button>
        </div>
      )}
    </div>
  );
}
```

### FastAPI Backend Conversion Endpoint

```python
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import os
import tempfile
from typing import Optional
import mammoth
import pandas as pd
from pptx import Presentation
import fitz  # PyMuPDF
from transformers import AutoModelForCausalLM, AutoTokenizer

app = FastAPI()

# Setup CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load the GPT-NeoX model for advanced document understanding
model_name = "EleutherAI/gpt-neox-20b"  # Using a smaller model for example purposes
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForCausalLM.from_pretrained(model_name)

@app.post("/api/convert")
async def convert_file(file: UploadFile = File(...)):
    # Get file extension
    file_extension = os.path.splitext(file.filename)[1].lower()
    
    # Create temp file
    with tempfile.NamedTemporaryFile(delete=False, suffix=file_extension) as temp_file:
        temp_file.write(await file.read())
        temp_file_path = temp_file.name
    
    try:
        # Process based on file type
        if file_extension == ".docx":
            markdown = convert_docx(temp_file_path)
        elif file_extension == ".xlsx":
            markdown = convert_xlsx(temp_file_path)
        elif file_extension == ".pptx":
            markdown = convert_pptx(temp_file_path)
        elif file_extension == ".pdf":
            markdown = convert_pdf(temp_file_path)
        elif file_extension == ".txt":
            with open(temp_file_path, "r", encoding="utf-8") as f:
                content = f.read()
            markdown = enhance_with_gpt_neox(content)
        else:
            raise HTTPException(status_code=400, detail="Unsupported file format")
        
        # Clean up
        os.unlink(temp_file_path)
        
        return {"markdown": markdown}
    
    except Exception as e:
        # Clean up on error
        os.unlink(temp_file_path)
        raise HTTPException(status_code=500, detail=str(e))

def convert_docx(file_path: str) -> str:
    """Convert DOCX to Markdown using mammoth and enhance with GPT-NeoX"""
    with open(file_path, "rb") as docx_file:
        result = mammoth.convert_to_markdown(docx_file)
        markdown = result.value
    
    # Enhance with GPT-NeoX
    return enhance_with_gpt_neox(markdown)

def convert_xlsx(file_path: str) -> str:
    """Convert Excel to Markdown tables"""
    xl = pd.ExcelFile(file_path)
    markdown = ""
    
    for sheet_name in xl.sheet_names:
        df = pd.read_excel(file_path, sheet_name=sheet_name)
        markdown += f"## Sheet: {sheet_name}\n\n"
        markdown += df.to_markdown() + "\n\n"
    
    return markdown

def convert_pptx(file_path: str) -> str:
    """Extract text from PowerPoint and convert to Markdown"""
    prs = Presentation(file_path)
    markdown = "# Presentation\n\n"
    
    for i, slide in enumerate(prs.slides):
        markdown += f"## Slide {i+1}\n\n"
        
        for shape in slide.shapes:
            if hasattr(shape, "text") and shape.text:
                markdown += f"{shape.text}\n\n"
    
    # Enhance with GPT-NeoX
    return enhance_with_gpt_neox(markdown)

def convert_pdf(file_path: str) -> str:
    """Extract text from PDF and convert to Markdown"""
    doc = fitz.open(file_path)
    markdown = ""
    
    for page_num in range(len(doc)):
        page = doc[page_num]
        markdown += f"## Page {page_num+1}\n\n"
        markdown += page.get_text() + "\n\n"
    
    # Enhance with GPT-NeoX
    return enhance_with_gpt_neox(markdown)

def enhance_with_gpt_neox(text: str) -> str:
    """Use GPT-NeoX to improve document structure and formatting"""
    # Prepare prompt for the model
    prompt = f"Convert the following text to well-formatted Markdown:\n\n{text[:500]}..."  # Limit input size
    
    # Generate improved markdown
    inputs = tokenizer(prompt, return_tensors="pt", truncation=True, max_length=1024)
    outputs = model.generate(
        inputs.input_ids,
        max_length=1500,
        num_return_sequences=1,
        temperature=0.7,
        top_p=0.9,
    )
    
    # Extract the generated text and clean up
    enhanced_text = tokenizer.decode(outputs[0], skip_special_tokens=True)
    # Remove the prompt from the output
    enhanced_text = enhanced_text.replace(prompt, "").strip()
    
    return enhanced_text
```

### Database Schema for File History

```python
from sqlalchemy import Column, Integer, String, DateTime, create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.sql import func

Base = declarative_base()

class ConversionHistory(Base):
    __tablename__ = "conversion_history"
    
    id = Column(Integer, primary_key=True, index=True)
    original_filename = Column(String, index=True)
    file_type = Column(String)
    md_filename = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    user_id = Column(String, index=True, nullable=True)  # For logged-in users
    file_size = Column(Integer)  # Size in bytes
    
    def __repr__(self):
        return f"<ConversionHistory(id={self.id}, filename={self.original_filename})>"

# Database connection setup
DATABASE_URL = "sqlite:///./file_conversion.db"
engine = create_engine(DATABASE_URL)
Base.metadata.create_all(bind=engine)
```

---

## 📝 **Supported Formats**

- **Microsoft Word (.docx)**
- **Excel Spreadsheets (.xlsx)**
- **PowerPoint Presentations (.pptx)**
- **PDF Documents (.pdf)**
- **Plain Text Files (.txt)**

---

## 🌟 **Why Use This Tool?**

- **AI Enhancement**: GPT-NeoX ensures intelligent, high-quality conversions that preserve document meaning.
- **Speed & Efficiency**: Convert large files in seconds, thanks to FastAPI's high-performance backend.
- **Flexible**: Converts various file types and preserves structure, tables, and images.
- **User-friendly**: Simple UI built with Next.js for a smooth, intuitive experience.
- **Live Preview**: See how your converted file will look in Markdown format before downloading.
- **Open-Source**: Customizable and extendable by the community.

---

## 💼 **Use Cases**

- **Documentation**: Convert office documents to Markdown for use in GitHub repos, project wikis, or blog posts.
- **Content Creation**: Bloggers, writers, and developers can convert Word and PDF files into Markdown for easy publishing.
- **Project Management**: Convert presentations and reports into Markdown to be shared and tracked in repositories.
- **AI Research**: Researchers can use our GPT-NeoX integration to study document comprehension and transformation.

---

## 🛠️ **Tech Stack**

- **Frontend**: Next.js, React, Tailwind CSS
- **Backend**: FastAPI, Python
- **AI Engine**: GPT-NeoX
- **Document Libraries**: mammoth (DOCX), pandas (XLSX), python-pptx (PPTX), PyMuPDF (PDF)
- **Database**: SQLite (for file history)
- **Deployment**: Vercel (Frontend), Render/Heroku (Backend)

---

## 🚀 **Get Started**

### **For Users**

1. Visit the [live site](frida.vercel.app) (link to be added).
2. Upload your file and start converting!

### **For Contributors**

1. **Fork the repository** on [GitHub](#).
2. Clone your forked repository:

   ```bash
   git clone https://github.com/Imadnajam/Frida.git
   ```

## Getting Started

First, create and activate a virtual environment:

```bash
python -m venv venv
source venv/bin/activate
```

Then, install the dependencies:

```bash
npm install
# or
yarn
# or
pnpm install
```

Then, run the development server(python dependencies will be installed automatically here):

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

The FastApi server will be running on [http://127.0.0.1:8000](http://127.0.0.1:8000) – feel free to change the port in `package.json` (you'll also need to update it in `next.config.js`).

5. Make your changes and submit a **pull request**!

---

## 🤝 **How to Contribute**

We welcome contributions of all kinds! Here are some ways you can help:

### **For Developers**

- **Add New Features**: Implement support for additional file formats or enhance the conversion logic.
- **Improve AI Integration**: Help optimize our GPT-NeoX implementation or add other AI capabilities.
- **Improve Performance**: Optimize the backend for faster conversions.
- **Fix Bugs**: Help us squash those pesky bugs!

### **For Designers**

- **UI/UX Improvements**: Make the interface more intuitive and visually appealing.
- **Branding**: Help us design a logo or improve the overall branding.

### **For Writers**

- **Documentation**: Improve the README, write tutorials, or create user guides.
- **Translation**: Help translate the tool into multiple languages.

---

## 📜 **Code of Conduct**

We follow a **Contributor Covenant Code of Conduct**. Please read it [here](#) before contributing.

---

## 🙏 **Acknowledgments**

A big shoutout to all our contributors, the open-source community, and the GPT-NeoX team for making this project possible!

---

## 📄 **License**

This project is licensed under the **MIT License**. See the [LICENSE](#) file for details.

---

## 💬 **Join the Community**

Have questions or ideas? Join our [Discord server](#) or open an issue on [GitHub](#). Let's build something amazing together!

---

**Happy Converting!** 🎉
