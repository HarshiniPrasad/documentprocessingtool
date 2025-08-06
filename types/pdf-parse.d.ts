declare module 'pdf-parse' {
  interface PDFPage {
    pageInfo: {
      num: number;
    };
  }

  interface PDFData {
    numpages: number;
    numrender: number;
    info: any;
    metadata: any;
    version: string;
    text: string;
  }

  type PDFParse = (dataBuffer: Buffer) => Promise<PDFData>;

  const pdf: PDFParse;
  export default pdf;
}
