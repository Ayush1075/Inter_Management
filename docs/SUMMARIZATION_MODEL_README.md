# Resume Summarization Model README

## Overview
The resume summarization model is a backend feature that automatically analyzes uploaded PDF resumes, extracts key information, and generates a summary for admin review. This helps HR/admins quickly understand an intern's skills, projects, and likely role.

## How It Works
1. **PDF Parsing:**
   - Uses the `pdf-parse` library to extract raw text from uploaded PDF resumes.
2. **Information Extraction:**
   - **Skills:** Extracted using regex to find a "Skills" section and split by commas/newlines.
   - **Projects:** Extracted using regex to find a "Projects" section and split by newlines.
   - **Summary Text:** The first 1000 characters of the resume are saved for context.
   - **Suggested Role:**
     - The model scans the extracted skills for keywords (e.g., React, Node, ML, AWS, etc.).
     - Based on these keywords, it infers a likely role (e.g., Frontend Engineer, Backend Engineer, Data Scientist, DevOps, Full Stack, Software Engineer).
     - The suggested role is prepended to the summary for quick admin review.
3. **Storage:**
   - All extracted data (skills, projects, summary, suggested role) are saved in the `Document` model in MongoDB.

## Libraries Used
- `pdf-parse` - For extracting text from PDF files
- `multer` - For handling file uploads
- `mongoose` - For storing parsed data in MongoDB

## Limitations
- The extraction uses simple regex and keyword matching, so it works best with well-structured resumes.
- It may miss skills/projects if the resume uses unusual section names or formats.
- The role inference is basic and can be improved with more advanced NLP or AI models.

## How to Improve
- Integrate a dedicated resume parsing API or AI model for more accurate extraction.
- Use NLP libraries (like spaCy, NLTK, or OpenAI APIs) for deeper analysis.
- Add support for DOCX and other file formats.
- Allow admins to edit or correct extracted summaries.

## Example Output
- **Skills:** Python, React, SQL, AWS
- **Projects:** E-commerce platform, Data pipeline
- **Suggested Role:** Backend Engineer
- **Summary:** First 1000 chars of resume text 