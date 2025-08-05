import { NextRequest, NextResponse } from 'next/server';
import { writeFile, unlink } from 'fs/promises';
import { join } from 'path';
import { tmpdir } from 'os';
import pdf from 'pdf-parse';

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

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        {
          status: 400,
          headers: {
            'Access-Control-Allow-Origin': '*',
          },
        }
      );
    }

    console.log('File upload details:');
    console.log('File name:', file.name);
    console.log('File type:', file.type);
    console.log('File size:', file.size);

    const validTypes = ['application/pdf', 'application/octet-stream'];
    const validExtensions = ['.pdf'];
    const fileName = file.name.toLowerCase();

    const hasValidType = validTypes.includes(file.type);
    const hasValidExtension = validExtensions.some(ext => fileName.endsWith(ext));

    if (!hasValidType && !hasValidExtension) {
      return NextResponse.json(
        { error: `Only PDF files are supported. Received: ${file.type || 'unknown type'}` },
        {
          status: 400,
          headers: {
            'Access-Control-Allow-Origin': '*',
          },
        }
      );
    }

    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File size exceeds 10MB limit' },
        {
          status: 400,
          headers: {
            'Access-Control-Allow-Origin': '*',
          },
        }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const tempFilePath = join(tmpdir(), `upload-${Date.now()}.pdf`);

    try {
      await writeFile(tempFilePath, buffer);
      const data = await pdf(buffer);
      const text = data.text;

      if (!text || text.trim().length === 0) {
        return NextResponse.json(
          { error: 'No text content found in PDF' },
          {
            status: 400,
            headers: {
              'Access-Control-Allow-Origin': '*',
            },
          }
        );
      }

      await unlink(tempFilePath);

      return NextResponse.json(
        {
          success: true,
          text: text.trim(),
          pages: data.numpages,
          info: data.info,
        },
        {
          headers: {
            'Access-Control-Allow-Origin': '*',
          },
        }
      );
    } catch (pdfError) {
      try {
        await unlink(tempFilePath);
      } catch (cleanupError) {
        console.error('Error cleaning up temp file:', cleanupError);
      }

      console.error('PDF parsing error:', pdfError);
      return NextResponse.json(
        { error: 'Failed to parse PDF file. Please ensure the file is a valid PDF.' },
        {
          status: 500,
          headers: {
            'Access-Control-Allow-Origin': '*',
          },
        }
      );
    }
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      {
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  }
}
