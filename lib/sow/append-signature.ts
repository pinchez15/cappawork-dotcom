import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

export async function appendSignaturePage(
  originalPdfBytes: Uint8Array,
  options: {
    signatureDataUrl: string;
    signedByName: string;
    signedAt: string;
  }
): Promise<Buffer> {
  const pdfDoc = await PDFDocument.load(originalPdfBytes);

  // Add a new signature page
  const page = pdfDoc.addPage([595.28, 841.89]); // A4
  const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const blue = rgb(0.145, 0.388, 0.922); // #2563eb
  const dark = rgb(0.11, 0.098, 0.09); // #1c1917
  const gray = rgb(0.341, 0.325, 0.306); // #57534e

  // Header
  page.drawText("CappaWork", {
    x: 50,
    y: 770,
    size: 20,
    font: helveticaBold,
    color: blue,
  });

  page.drawLine({
    start: { x: 50, y: 755 },
    end: { x: 545, y: 755 },
    thickness: 2,
    color: blue,
  });

  // Title
  page.drawText("Signature & Acceptance", {
    x: 50,
    y: 720,
    size: 16,
    font: helveticaBold,
    color: dark,
  });

  page.drawText(
    "By signing below, the undersigned agrees to the terms outlined in this",
    { x: 50, y: 690, size: 10, font: helvetica, color: gray }
  );
  page.drawText("Statement of Work.", {
    x: 50,
    y: 676,
    size: 10,
    font: helvetica,
    color: gray,
  });

  // Embed signature image
  const sigBase64 = options.signatureDataUrl.replace(
    /^data:image\/png;base64,/,
    ""
  );
  const sigBytes = Buffer.from(sigBase64, "base64");
  const sigImage = await pdfDoc.embedPng(sigBytes);

  const sigDims = sigImage.scale(
    Math.min(200 / sigImage.width, 60 / sigImage.height)
  );

  page.drawImage(sigImage, {
    x: 50,
    y: 580,
    width: sigDims.width,
    height: sigDims.height,
  });

  // Signature line
  page.drawLine({
    start: { x: 50, y: 575 },
    end: { x: 300, y: 575 },
    thickness: 1,
    color: dark,
  });

  page.drawText("Signature", {
    x: 50,
    y: 560,
    size: 9,
    font: helvetica,
    color: gray,
  });

  // Signer info
  page.drawText(`Signed by: ${options.signedByName}`, {
    x: 50,
    y: 530,
    size: 10,
    font: helveticaBold,
    color: dark,
  });

  const signedDate = new Date(options.signedAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  page.drawText(`Date: ${signedDate}`, {
    x: 50,
    y: 514,
    size: 10,
    font: helvetica,
    color: gray,
  });

  // Footer
  page.drawLine({
    start: { x: 50, y: 50 },
    end: { x: 545, y: 50 },
    thickness: 0.5,
    color: rgb(0.906, 0.894, 0.882), // #e7e5e4
  });

  page.drawText(
    "CappaWork — Operational Analytics & Automation Consultancy",
    {
      x: 150,
      y: 36,
      size: 8,
      font: helvetica,
      color: rgb(0.659, 0.635, 0.612), // #a8a29e
    }
  );

  const pdfBytes = await pdfDoc.save();
  return Buffer.from(pdfBytes);
}
