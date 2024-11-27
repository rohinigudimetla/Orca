from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pdfminer.high_level import extract_text
import uvicorn
import os
import tempfile

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

@app.post("/extract")
async def extract_pdf(file: UploadFile = File(...)):
    # Use system's temp directory
    with tempfile.NamedTemporaryFile(delete=False, suffix='.pdf') as temp_file:
        try:
            content = await file.read()
            temp_file.write(content)
            temp_file.flush()
            
            text = extract_text(temp_file.name)
            if not text:
                return {"error": "No text could be extracted from the PDF"}
            
            return {"text": text}
            
        except Exception as e:
            return {"error": f"Failed to process PDF: {str(e)}"}
        finally:
            # Only delete the temp file we created
            if os.path.exists(temp_file.name):
                os.unlink(temp_file.name)

if __name__ == "__main__":
    uvicorn.run(app, host="localhost", port=5001)