# Medical Document Processing AI

An intelligent AI-powered medical document processing and filing system built with Next.js, designed to extract key information from medical documents and streamline the filing process for healthcare practices.

👉 **[View Deployed App](https://documentprocessingtool-2i4e-144jo45sk-harshiniprasads-projects.vercel.app/)**

---

## Features

- **PDF Document Processing**: Upload and extract text from medical PDF documents  
- **AI-Powered Field Extraction**: Uses Google Gemini AI to extract 7 key medical document fields  
- **Human Review Interface**: Review and edit extracted data before filing  
- **Medical Document Categories**: Support for 30+ medical document categories  
- **Modern UI**: Clean, responsive interface with progress tracking  
- **Error Handling**: Robust error handling and validation  

---

## Required Fields

The system extracts the following 7 key fields from medical documents:

1. **Patient Name** - Full patient name as found in document  
2. **Date of Report** - Date in YYYY-MM-DD format  
3. **Subject** - Brief description of document content or procedure  
4. **Contact of Source** - Medical facility, clinic, or organization  
5. **Store In** - "Correspondence" or "Investigations"  
6. **Doctor/GP** - Doctor name with title  
7. **Category** - One of 30+ medical document categories  

---

## Document Categories

- Admissions summary  
- Advance care planning  
- Allied health letter  
- Certificate  
- Clinical notes  
- Clinical photograph  
- Consent form  
- DAS21  
- Discharge summary  
- ECG  
- Email  
- Form  
- Immunisation  
- Indigenous PIP  
- Letter  
- Medical imaging report  
- MyHealth registration  
- New PT registration form  
- Pathology results  
- Patient consent  
- Record request  
- Referral letter  
- Workcover  
- Workcover consent  

---

## Prerequisites

- Node.js 18+  
- npm or yarn  
- Google Gemini API key  

---

## Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd medical-document-processor
