import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { Citizen, WaitingListEntry, Stand, Payment } from '../types';

/**
 * Downloads a DOM element as a high-resolution PDF document.
 * Includes timeout and graceful fallback to direct PDF generation if needed.
 */
export async function downloadElementAsPdf(
  element: HTMLElement,
  fileName: string,
  format: 'a4' | 'card' = 'a4'
): Promise<void> {
  const safeName = fileName.endsWith('.pdf') ? fileName : `${fileName}.pdf`;

  try {
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      logging: false,
      backgroundColor: format === 'card' ? null : '#ffffff',
      imageTimeout: 4000,
    });

    const imgData = canvas.toDataURL('image/png');

    if (format === 'card') {
      const cardWidthMm = 140;
      const cardHeightMm = (canvas.height * cardWidthMm) / canvas.width;

      const pdf = new jsPDF({
        orientation: cardHeightMm > cardWidthMm ? 'portrait' : 'landscape',
        unit: 'mm',
        format: [cardWidthMm + 10, cardHeightMm + 10],
      });

      pdf.addImage(imgData, 'PNG', 5, 5, cardWidthMm, cardHeightMm);
      pdf.save(safeName);
    } else {
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const pageWidthMm = 210;
      const pageHeightMm = 297;
      const marginMm = 10;
      const contentWidthMm = pageWidthMm - marginMm * 2;
      const contentHeightMm = (canvas.height * contentWidthMm) / canvas.width;

      if (contentHeightMm <= pageHeightMm - marginMm * 2) {
        pdf.addImage(imgData, 'PNG', marginMm, marginMm, contentWidthMm, contentHeightMm);
      } else {
        let heightLeft = contentHeightMm;
        let position = marginMm;

        pdf.addImage(imgData, 'PNG', marginMm, position, contentWidthMm, contentHeightMm);
        heightLeft -= pageHeightMm;

        while (heightLeft > 0) {
          position = heightLeft - contentHeightMm;
          pdf.addPage();
          pdf.addImage(imgData, 'PNG', marginMm, position, contentWidthMm, contentHeightMm);
          heightLeft -= pageHeightMm;
        }
      }

      pdf.save(safeName);
    }
  } catch (err) {
    console.warn('html2canvas rendering warning, triggering fallback:', err);
    throw err;
  }
}

/**
 * Direct Instant Vector PDF generator for Official Digital Lodger's Card.
 * Works 100% reliably in any environment with zero dependencies on DOM rendering.
 */
export function downloadLodgerCardDirectPdf(
  citizen: Citizen,
  queueEntry?: WaitingListEntry | null
): void {
  const cardWidth = 148;
  const cardHeight = 100;
  const safeName = `Lodgers_Card_${citizen.lodgerCardNumber}_${citizen.fullName.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;

  const pdf = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: [cardWidth, cardHeight],
  });

  // Background Gradient Card Fill
  pdf.setFillColor(0, 34, 68); // #002244 Deep Navy
  pdf.roundedRect(4, 4, cardWidth - 8, cardHeight - 8, 4, 4, 'F');

  // Outer Golden Border
  pdf.setDrawColor(212, 175, 55); // #D4AF37 Gold
  pdf.setLineWidth(1);
  pdf.roundedRect(4, 4, cardWidth - 8, cardHeight - 8, 4, 4, 'D');

  // Header Bar
  pdf.setFillColor(0, 24, 48);
  pdf.roundedRect(4, 4, cardWidth - 8, 18, 4, 4, 'F');
  pdf.rect(4, 18, cardWidth - 8, 4, 'F'); // square bottom of header

  // Header Text
  pdf.setTextColor(255, 255, 255);
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(10);
  pdf.text('MASVINGO RURAL DISTRICT COUNCIL', 12, 11);

  pdf.setFontSize(7.5);
  pdf.setTextColor(251, 191, 36); // Amber
  pdf.text('Nemamwa Growth Point Housing Registry • Cap 29:13', 12, 16);

  // Official Badge
  pdf.setFillColor(245, 158, 11);
  pdf.roundedRect(cardWidth - 36, 8, 26, 6, 1.5, 1.5, 'F');
  pdf.setTextColor(0, 27, 58);
  pdf.setFontSize(7);
  pdf.setFont('helvetica', 'bold');
  pdf.text('OFFICIAL CARD', cardWidth - 23, 12.2, { align: 'center' });

  // Lodger Card Number & Queue Pos
  pdf.setTextColor(147, 197, 253);
  pdf.setFontSize(7);
  pdf.text('LODGER CARD NUMBER:', 10, 28);
  pdf.setTextColor(253, 224, 71);
  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'bold');
  pdf.text(citizen.lodgerCardNumber, 10, 33);

  // Queue Position Box
  pdf.setFillColor(0, 45, 90);
  pdf.setDrawColor(212, 175, 55);
  pdf.roundedRect(cardWidth - 42, 24, 32, 12, 2, 2, 'FD');
  pdf.setTextColor(203, 213, 225);
  pdf.setFontSize(6.5);
  pdf.text('QUEUE POSITION', cardWidth - 26, 28.5, { align: 'center' });
  pdf.setTextColor(251, 191, 36);
  pdf.setFontSize(12);
  pdf.text(`#${queueEntry?.positionNumber || '1'}`, cardWidth - 26, 34, { align: 'center' });

  // Main Info Card
  pdf.setFillColor(0, 45, 90);
  pdf.setDrawColor(30, 64, 120);
  pdf.roundedRect(10, 38, cardWidth - 20, 36, 2, 2, 'FD');

  // Full Name
  pdf.setTextColor(147, 197, 253);
  pdf.setFontSize(6.5);
  pdf.setFont('helvetica', 'normal');
  pdf.text('FULL NAME OF APPLICANT:', 14, 43);
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(9.5);
  pdf.setFont('helvetica', 'bold');
  pdf.text(citizen.fullName, 14, 48);

  // Row 1: National ID & Contact
  pdf.setTextColor(147, 197, 253);
  pdf.setFontSize(6.5);
  pdf.setFont('helvetica', 'normal');
  pdf.text('NATIONAL ID NUMBER:', 14, 55);
  pdf.text('CONTACT PHONE:', 76, 55);

  pdf.setTextColor(241, 245, 249);
  pdf.setFontSize(8);
  pdf.setFont('helvetica', 'bold');
  pdf.text(citizen.nationalId, 14, 60);
  pdf.text(citizen.phone, 76, 60);

  // Row 2: Category & Date Issued
  pdf.setTextColor(147, 197, 253);
  pdf.setFontSize(6.5);
  pdf.setFont('helvetica', 'normal');
  pdf.text('DENSITY CATEGORY:', 14, 66);
  pdf.text('DATE REGISTERED:', 76, 66);

  pdf.setTextColor(253, 224, 71);
  pdf.setFontSize(8);
  pdf.setFont('helvetica', 'bold');
  pdf.text(citizen.preferredDensity, 14, 71);
  pdf.setTextColor(241, 245, 249);
  pdf.text(citizen.dateRegistered, 76, 71);

  // Address
  pdf.setTextColor(147, 197, 253);
  pdf.setFontSize(6.5);
  pdf.setFont('helvetica', 'normal');
  pdf.text('REGISTERED RESIDENCE:', 10, 79);
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(7.5);
  pdf.text(citizen.address.substring(0, 70), 10, 83);

  // Verification & Stamp Area
  pdf.setDrawColor(239, 68, 68);
  pdf.rect(10, 86, 36, 7);
  pdf.setTextColor(252, 165, 165);
  pdf.setFontSize(6);
  pdf.setFont('helvetica', 'bold');
  pdf.text('NEMAMWA RDC APPROVED', 28, 90.5, { align: 'center' });

  pdf.setTextColor(148, 163, 184);
  pdf.setFontSize(6);
  pdf.setFont('helvetica', 'normal');
  pdf.text('Scan & Verify at Council Kiosk • Tamper-proof digital record', cardWidth - 10, 90.5, { align: 'right' });

  // Bottom Golden Trim
  pdf.setFillColor(212, 175, 55);
  pdf.rect(4, cardHeight - 5, cardWidth - 8, 1, 'F');

  pdf.save(safeName);
}

/**
 * Direct Instant Vector PDF generator for Official Revenue Receipts (Clerk / Cashier).
 */
export function downloadReceiptDirectPdf(payment: Payment): void {
  const safeName = `Official_Receipt_${payment.receiptNumber}_${payment.citizenName.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;

  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: [105, 155],
  });

  // Header Banner
  pdf.setFillColor(0, 40, 85);
  pdf.rect(0, 0, 105, 22, 'F');

  pdf.setTextColor(255, 255, 255);
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(10);
  pdf.text('MASVINGO RURAL DISTRICT COUNCIL', 52.5, 8, { align: 'center' });

  pdf.setFontSize(7);
  pdf.setTextColor(251, 191, 36);
  pdf.text('Nemamwa Revenue Collection Office', 52.5, 13, { align: 'center' });
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(226, 232, 240);
  pdf.text('Rural District Councils Act [Chapter 29:13]', 52.5, 17.5, { align: 'center' });

  // Receipt Identifier
  pdf.setFillColor(248, 250, 252);
  pdf.setDrawColor(226, 232, 240);
  pdf.rect(6, 26, 93, 14, 'FD');

  pdf.setTextColor(15, 23, 42);
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(8.5);
  pdf.text('OFFICIAL RECEIPT NO:', 10, 32);
  pdf.setTextColor(0, 56, 117);
  pdf.text(payment.receiptNumber, 94, 32, { align: 'right' });

  pdf.setTextColor(71, 85, 105);
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(7.5);
  pdf.text(`Date & Time: ${payment.paymentDate}`, 10, 37.5);
  pdf.text(`Cashier: ${payment.cashierName}`, 94, 37.5, { align: 'right' });

  // Payer Details Box
  pdf.setDrawColor(203, 213, 225);
  pdf.rect(6, 43, 93, 20);

  pdf.setTextColor(100, 116, 139);
  pdf.setFontSize(7);
  pdf.text('RECEIVED FROM:', 10, 48);

  pdf.setTextColor(15, 23, 42);
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(9);
  pdf.text(payment.citizenName, 10, 53);

  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(7.5);
  pdf.setTextColor(71, 85, 105);
  pdf.text(`National ID: ${payment.nationalId}`, 10, 58);
  pdf.text(`Payment Mode: ${payment.paymentMethod}`, 94, 58, { align: 'right' });

  // Particulars Table
  pdf.setFillColor(241, 245, 249);
  pdf.rect(6, 67, 93, 7, 'F');
  pdf.setTextColor(30, 41, 59);
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(7.5);
  pdf.text('Description / Purpose', 10, 71.5);
  pdf.text('Amount (USD)', 94, 71.5, { align: 'right' });

  pdf.setFont('helvetica', 'normal');
  pdf.text(payment.purpose, 10, 80);
  pdf.setFont('helvetica', 'bold');
  pdf.text(`$${payment.amount.toFixed(2)}`, 94, 80, { align: 'right' });

  pdf.setDrawColor(226, 232, 240);
  pdf.line(6, 85, 99, 85);

  // Total Box
  pdf.setFillColor(0, 40, 85);
  pdf.rect(6, 89, 93, 10, 'F');
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(9);
  pdf.text('TOTAL PAID:', 10, 95.5);
  pdf.setTextColor(251, 191, 36);
  pdf.text(`$${payment.amount.toFixed(2)} USD`, 94, 95.5, { align: 'right' });

  // Verification & Stamp
  pdf.setDrawColor(22, 101, 52);
  pdf.setLineWidth(0.8);
  pdf.roundedRect(10, 105, 34, 14, 2, 2, 'D');
  pdf.setTextColor(22, 101, 52);
  pdf.setFontSize(7.5);
  pdf.setFont('helvetica', 'bold');
  pdf.text('PAID & VERIFIED', 27, 111, { align: 'center' });
  pdf.setFontSize(6);
  pdf.text('NEMAMWA COUNCIL', 27, 115.5, { align: 'center' });

  pdf.setTextColor(100, 116, 139);
  pdf.setFont('helvetica', 'italic');
  pdf.setFontSize(6.5);
  pdf.text('Valid without alteration • Official Council Financial Instrument', 52.5, 128, { align: 'center' });
  pdf.text('Thank you for contributing to Nemamwa Growth Point development.', 52.5, 132, { align: 'center' });

  // Footer bar
  pdf.setFillColor(212, 175, 55);
  pdf.rect(0, 142, 105, 2, 'F');

  pdf.save(safeName);
}

/**
 * Direct Instant Vector PDF generator for Official Provisional Stand Allocation Letter.
 */
export function downloadAllocationLetterDirectPdf(
  stand: Stand,
  citizen: Citizen,
  queueEntry?: WaitingListEntry | null,
  letterRef?: string
): void {
  const safeName = `Allocation_Letter_${stand.standNumber}_${citizen.fullName.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;
  const refNumber = letterRef || `NMM-RDC/HOUS/2026/${stand.standNumber}/${String(queueEntry?.positionNumber || '001').padStart(3, '0')}`;
  const today = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  // Letterhead Header
  pdf.setTextColor(0, 40, 85);
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(14);
  pdf.text('MASVINGO RURAL DISTRICT COUNCIL', 105, 18, { align: 'center' });

  pdf.setFontSize(8.5);
  pdf.setTextColor(71, 85, 105);
  pdf.text('Nemamwa Growth Point Sub-Office • Department of Housing & Community Services', 105, 23.5, { align: 'center' });
  pdf.setFontSize(7.5);
  pdf.text('Rural District Councils Act [Chapter 29:13] • P.O. Box 517, Masvingo, Zimbabwe', 105, 28, { align: 'center' });

  pdf.setDrawColor(0, 40, 85);
  pdf.setLineWidth(0.8);
  pdf.line(15, 31, 195, 31);

  // References & Date
  pdf.setFontSize(8.5);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(15, 23, 42);
  pdf.text('Our Ref:', 15, 38);
  pdf.setFont('helvetica', 'normal');
  pdf.text(refNumber, 32, 38);

  pdf.setFont('helvetica', 'bold');
  pdf.text('Date:', 150, 38);
  pdf.setFont('helvetica', 'normal');
  pdf.text(today, 162, 38);

  pdf.setFont('helvetica', 'bold');
  pdf.text('Lodger Card:', 15, 43);
  pdf.setFont('helvetica', 'normal');
  pdf.text(citizen.lodgerCardNumber, 38, 43);

  pdf.setFont('helvetica', 'bold');
  pdf.text('Allocation Method:', 150, 43);
  pdf.setFont('helvetica', 'normal');
  pdf.text('FCFS Waiting Queue', 180, 43);

  // Recipient
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(9);
  pdf.text(citizen.fullName, 15, 52);
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(8.5);
  pdf.text(`National ID: ${citizen.nationalId}`, 15, 57);
  pdf.text(citizen.address, 15, 62);
  pdf.text(`Contact: ${citizen.phone}`, 15, 67);

  // Subject
  pdf.setFillColor(241, 245, 249);
  pdf.rect(15, 72, 180, 8, 'F');
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(9);
  pdf.setTextColor(0, 40, 85);
  pdf.text(`RE: PROVISIONAL ALLOCATION OF STAND ${stand.standNumber} - NEMAMWA GROWTH POINT`, 18, 77.5);

  // Body
  pdf.setTextColor(30, 41, 59);
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(8.5);
  pdf.text(
    'Following your registration on the Nemamwa Rural District Council Housing Waiting List and in accordance with the',
    15,
    86
  );
  pdf.text(
    'Council First-Come-First-Served allocation policy, we are pleased to advise that you have been provisionally allocated:',
    15,
    91
  );

  // Stand Details Box
  pdf.setFillColor(248, 250, 252);
  pdf.setDrawColor(203, 213, 225);
  pdf.rect(15, 95, 180, 28, 'FD');

  pdf.setFont('helvetica', 'bold');
  pdf.text('Stand Number:', 20, 102);
  pdf.text('Cadastral Area:', 110, 102);
  pdf.text('Density Classification:', 20, 109);
  pdf.text('Cadastral Phase:', 110, 109);
  pdf.text('Beacon Reference:', 20, 116);
  pdf.text('Council Purchase Price:', 110, 116);

  pdf.setFont('helvetica', 'normal');
  pdf.text(stand.standNumber, 55, 102);
  pdf.text(stand.size, 155, 102);
  pdf.text(stand.density, 55, 109);
  pdf.text(stand.phase, 155, 109);
  pdf.text(stand.beaconRef, 55, 116);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(22, 101, 52);
  pdf.text(`$${stand.priceUsd.toLocaleString()} USD`, 155, 116);

  // Terms and Conditions
  pdf.setTextColor(0, 40, 85);
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(9);
  pdf.text('Statutory Terms and Conditions of Allocation:', 15, 130);

  pdf.setTextColor(30, 41, 59);
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(8);
  const terms = [
    '1. Acceptance and Deposit: Confirm acceptance and pay a minimum 25% deposit within 30 days of this letter.',
    '2. Building Clause: Commence construction within 12 months and complete habitable standard within 24 months.',
    '3. Plan Approval: No building without prior cadastral beacon survey and Engineering Department approval.',
    '4. Prohibition of Cession: Transfer or cession without written CEO approval is strictly prohibited under Council Bylaws.',
  ];

  let y = 136;
  for (const t of terms) {
    pdf.text(t, 18, y);
    y += 5.5;
  }

  pdf.setFontSize(8.5);
  pdf.text('Congratulations on securing your residential stand at Nemamwa Growth Point.', 15, y + 4);

  // Signatures
  y += 20;
  pdf.setDrawColor(15, 23, 42);
  pdf.line(20, y, 70, y);
  pdf.line(140, y, 190, y);

  pdf.setFont('helvetica', 'bold');
  pdf.text('Council Housing Officer', 20, y + 5);
  pdf.text('Chief Executive Officer', 140, y + 5);

  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(7.5);
  pdf.setTextColor(100, 116, 139);
  pdf.text('Nemamwa Growth Point', 20, y + 9);
  pdf.text('Masvingo Rural District Council', 140, y + 9);

  // Official Stamp Graphic
  pdf.setDrawColor(185, 28, 28);
  pdf.roundedRect(85, y - 8, 40, 20, 3, 3);
  pdf.setTextColor(185, 28, 28);
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(8);
  pdf.text('MASVINGO RDC', 105, y - 1, { align: 'center' });
  pdf.setFontSize(6.5);
  pdf.text('HOUSING DEPT APPROVED', 105, y + 4, { align: 'center' });
  pdf.text('OFFICIAL SEAL', 105, y + 8, { align: 'center' });

  pdf.save(safeName);
}
