import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

/**
 *
 * @param {HTMLElement|{current:HTMLElement}} elOrRef
 * @param {string} title
 * @param {string|null} logoUrl
 */
export default async function generatePDF(elOrRef, title = 'Relatorio', logoUrl = null) {
  const el = elOrRef?.current ?? elOrRef;
  if (!el) return;

  const pdf = new jsPDF('portrait', 'pt', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 20;

  let yOffset = margin;

  if (logoUrl) {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = logoUrl;

    await new Promise((resolve) => {
      img.onload = () => {
        const maxLogoWidth = pageWidth - margin * 2;
        const logoHeight = (img.height / img.width) * maxLogoWidth;
        pdf.addImage(img, 'PNG', margin, yOffset, maxLogoWidth, logoHeight);
        yOffset += logoHeight + 10;
        resolve();
      };
      img.onerror = resolve;
    });
  }

  pdf.setFontSize(18);
  pdf.text(title, pageWidth / 2, yOffset + 20, { align: 'center' });
  yOffset += 40;

  const canvas = await html2canvas(el, {
    scale: 2,
    useCORS: true,
    backgroundColor: '#ffffff',
  });
  const imgData = canvas.toDataURL('image/png');

  const printableWidth = pageWidth - margin * 2;
  const scale = printableWidth / canvas.width;
  const imgHeight = canvas.height * scale;

  const availableHeightFirstPage = pageHeight - yOffset - margin;

  if (imgHeight <= availableHeightFirstPage) {
    pdf.addImage(imgData, 'PNG', margin, yOffset, printableWidth, imgHeight);
  } else {
    let srcY = 0;

    const sliceHeightPxFirst = availableHeightFirstPage / scale;
    const sliceHeightPx = (pageHeight - margin * 2) / scale;

    const sliceToDataURL = (sourceCanvas, syPx, shPx) => {
      const sliceCanvas = document.createElement('canvas');
      sliceCanvas.width = sourceCanvas.width;
      sliceCanvas.height = shPx;
      const ctx = sliceCanvas.getContext('2d');
      ctx.drawImage(
        sourceCanvas,
        0,
        syPx,
        sourceCanvas.width,
        shPx,
        0,
        0,
        sourceCanvas.width,
        shPx
      );
      return sliceCanvas.toDataURL('image/png');
    };

    const firstSlicePx = Math.min(sliceHeightPxFirst, canvas.height);
    const firstImg = sliceToDataURL(canvas, srcY, firstSlicePx);
    const firstImgHeightDraw = firstSlicePx * scale;

    pdf.addImage(firstImg, 'PNG', margin, yOffset, printableWidth, firstImgHeightDraw);
    srcY += firstSlicePx;

    while (srcY < canvas.height) {
      pdf.addPage();
      const thisSlicePx = Math.min(sliceHeightPx, canvas.height - srcY);
      const pageImg = sliceToDataURL(canvas, srcY, thisSlicePx);
      const drawHeight = thisSlicePx * scale;

      pdf.addImage(pageImg, 'PNG', margin, margin, printableWidth, drawHeight);
      srcY += thisSlicePx;
    }
  }

  pdf.save(`${title}.pdf`);
}