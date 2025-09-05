Medical Document Processing AI

An intelligent AI-powered medical document processing and filing system built with Next.js, designed to extract key information from medical documents and streamline the filing process for healthcare practices.

👉 View Deployed App

Features

PDF Document Processing: Upload and extract text from medical PDF documents

AI-Powered Field Extraction: Uses Google Gemini AI to extract 7 key medical document fields

Human Review Interface: Review and edit extracted data before filing

Medical Document Categories: Support for 30+ medical document categories

Modern UI: Clean, responsive interface with progress tracking

Error Handling: Robust error handling and validation

Required Fields

The system extracts the following 7 key fields from medical documents:

Patient Name - Full patient name as found in document

Date of Report - Date in YYYY-MM-DD format

Subject - Brief description of document content or procedure

Contact of Source - Medical facility, clinic, or organization

Store In - "Correspondence" or "Investigations"

Doctor/GP - Doctor name with title

Category - One of 30+ medical document categories

Document Categories

Admissions summary

Advance care planning

Allied health letter

Certificate

Clinical notes

Clinical photograph

Consent form

DAS21

Discharge summary

ECG

Email

Form

Immunisation

Indigenous PIP

Letter

Medical imaging report

MyHealth registration

New PT registration form

Pathology results

Patient consent

Record request

Referral letter

Workcover

Workcover consent

Prerequisites

Node.js 18+

npm or yarn

Google Gemini API key

Setup Instructions

Clone the repository

git clone <repository-url>
cd medical-document-processor


Install dependencies

npm install


Set up environment variables
Create a .env.local file in the root directory:

GOOGLE_API_KEY=your_google_gemini_api_key_here


Get Google Gemini API Key

Go to Google AI Studio

Create a new API key

Add it to your .env.local file

Run the development server

npm run dev


Open your browser
Navigate to http://localhost:3000

Usage

Upload Document: Drag and drop or browse to select a PDF medical document

AI Processing: The system will automatically extract text and analyze the document

Review & Edit: Review the extracted fields and make any necessary corrections

File Document: Submit the document to be filed in the practice management system

API Endpoints

POST /api/upload - Upload and extract text from PDF files

POST /api/extract - Extract medical fields using AI

Technology Stack

Frontend: Next.js 13, React 18, TypeScript

Styling: Tailwind CSS

File Upload: FilePond with validation plugins

PDF Processing: pdf-parse

AI: Google Gemini API

Icons: Lucide React

File Structure
├── app/
│   ├── api/
│   │   ├── extract/
│   │   │   └── route.ts          # AI field extraction
│   │   └── upload/
│   │       └── route.ts          # PDF upload and text extraction
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Main application page
├── components/
│   ├── file-upload.tsx           # File upload component
│   └── document-review.tsx       # Document review interface
├── package.json
└── README.md

Development
Running in Development Mode
npm run dev

Building for Production
npm run build
npm start

Linting
npm run lint

Security Considerations

File size limit: 10MB

Supported file types: PDF only

Temporary files are automatically cleaned up

API keys are stored in environment variables

Contributing

Fork the repository

Create a feature branch

Make your changes

Test thoroughly

Submit a pull request

License & Credits

This project is licensed under the MIT License.

⚠️ Disclaimer: This is a cloning attempt of the original project by Care GP.
All credits for the original concept and implementation go to Care GP.
