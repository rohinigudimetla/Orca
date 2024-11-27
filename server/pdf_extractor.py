import io
import re
import sys
from pdfminer.converter import TextConverter
from pdfminer.pdfinterp import PDFPageInterpreter, PDFResourceManager
from pdfminer.pdfpage import PDFPage

def extract_text_by_page(pdf_path):
    with open(pdf_path, 'rb') as pdf_file:
        for page in PDFPage.get_pages(pdf_file, 
                                    caching=True,
                                    check_extractable=True):
            resource_manager = PDFResourceManager()
            fake_file_handle = io.StringIO()
            converter = TextConverter(resource_manager, fake_file_handle)
            page_interpreter = PDFPageInterpreter(resource_manager, converter)
            page_interpreter.process_page(page)
            
            text = fake_file_handle.getvalue()
            yield text
        
            converter.close()
            fake_file_handle.close()

def filter_content(text):
    lines = text.splitlines()
    filtered_lines = []
    
    for line in lines:
        if not line.strip():
            continue
        
        if re.match(r'^\s*Page\s+\d+', line, re.IGNORECASE):
            continue
        if re.match(r'^\s*\d+\s*$', line):
            continue
        if len(line.strip()) < 5:
            continue
        
        filtered_lines.append(line)
    
    return "\n".join(filtered_lines)

def extract_text(pdf_path):
    page_texts = []
    for page_text in extract_text_by_page(pdf_path):
        filtered_text = filter_content(page_text)
        page_texts.append(filtered_text)
    return "\n\n".join(page_texts)

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Error: Please provide PDF path", file=sys.stderr)
        sys.exit(1)
    
    try:
        extracted_text = extract_text(sys.argv[1])
        print(extracted_text)
    except Exception as e:
        print(f"Error: {str(e)}", file=sys.stderr)
        sys.exit(1) 