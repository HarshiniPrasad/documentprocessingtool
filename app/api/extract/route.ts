import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const CATEGORIES = [
  'Admissions summary', 'Advance care planning', 'Allied health letter',
  'Certificate', 'Clinical notes', 'Clinical photograph', 'Consent form',
  'DAS21', 'Discharge summary', 'ECG', 'Email', 'Form', 'Immunisation',
  'Indigenous PIP', 'Letter', 'Medical imaging report', 'MyHealth registration',
  'New PT registration form', 'Pathology results', 'Patient consent',
  'Record request', 'Referral letter', 'Workcover', 'Workcover consent'
];

export async function OPTIONS() {
  return NextResponse.json({}, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json();

    if (!text) {
      return NextResponse.json({ error: 'No text provided' }, {
        status: 400,
        headers: { 'Access-Control-Allow-Origin': '*' },
      });
    }

    const apiKey = process.env.GOOGLE_API_KEY || 'AIzaSyC3TLgF4OElLjj7i3izVB0mxVZZrH8TkaI';
    if (!apiKey) {
      const fallbackFields = {
        patient_name: 'Sample Patient Name',
        date_of_report: new Date().toISOString().split('T')[0],
        subject: 'Medical document review',
        contact_of_source: 'Sample Medical Facility',
        store_in: 'Correspondence',
        doctor: 'Dr. Sample Doctor',
        category: 'Letter',
      };

      return NextResponse.json(
        {
          fields: fallbackFields,
          confidence: 'low',
          missingFields: ['API key not configured'],
          message: 'Using fallback data - please configure GOOGLE_API_KEY for AI extraction',
        },
        {
          headers: { 'Access-Control-Allow-Origin': '*' },
        }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const prompt = `You are Samantha, an AI medical document processing assistant. Your job is to extract and return only the following 7 fields from the provided medical document text, strictly as a valid JSON object.

Guidelines:
1. **patient_name**: Full name of the patient.
2. **date_of_report**: Use the actual report creation or issue date (often near the signature). Avoid using service or appointment dates.
3. **subject**: The topic of the document (e.g., SCROTAL ULTRASOUND).
4. **contact_of_source**: Name of the clinic, hospital, radiology center, or lab that produced the document (e.g., iMED Radiology, not individual doctor names or phone numbers).
5. **store_in**: Either "Correspondence" or "Investigations" only.
6. **doctor**: Full name of the referring or signing doctor (usually appears under "Referrer" or with a title like Dr.).
7. **category**: One of the following values: ${CATEGORIES.join(', ')}.

Return only a valid JSON object with keys: patient_name, date_of_report, subject, contact_of_source, store_in, doctor, and category.

MEDICAL DOCUMENT TEXT:
${text}

JSON RESPONSE:`;



    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent(prompt);

    let responseText;
    try {
      responseText = result.response.text();
    } catch (textError) {
      throw new Error('Could not extract text from Gemini response');
    }

    responseText = responseText.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
    let extracted: any;

    try {
      extracted = JSON.parse(responseText);
    } catch {
      const match = responseText.match(/\{[\s\S]*\}/);
      if (match) {
        extracted = JSON.parse(match[0]);
      } else {
        throw new Error('No valid JSON found in AI response');
      }
    }

    const requiredFields = ['patient_name', 'date_of_report', 'subject', 'contact_of_source', 'store_in', 'doctor', 'category'];
    const missingFields = requiredFields.filter(f => !extracted[f] || extracted[f].trim() === '');

    if (extracted.category && !CATEGORIES.includes(extracted.category)) {
      const similar = CATEGORIES.find(c => c.toLowerCase().includes(extracted.category.toLowerCase()));
      if (similar) extracted.category = similar;
    }

    if (extracted.store_in && !['Correspondence', 'Investigations'].includes(extracted.store_in)) {
      extracted.store_in = 'Correspondence';
    }

    return NextResponse.json(
      {
        fields: extracted,
        confidence: 'high',
        missingFields,
      },
      {
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  } catch (err: any) {
    console.error('[ERROR IN /api/extract]', err);
    return NextResponse.json(
      {
        error: 'Failed to extract fields',
        message: err.message,
      },
      {
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  }
}
