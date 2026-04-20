const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

/**
 * Generate a PDF invoice for a bill
 * @param {Object} bill - The bill object
 * @param {string} filePath - Path where the PDF will be saved
 */
const generateInvoicePDF = (bill, filePath) => {
    return new Promise((resolve, reject) => {
        const doc = new PDFDocument({ margin: 50 });

        // Ensure directory exists
        const dir = path.dirname(filePath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        const stream = fs.createWriteStream(filePath);
        doc.pipe(stream);

        // Header
        doc.fontSize(20).text('HealthRekha AI', { align: 'center' });
        doc.fontSize(10).text('AI-Powered Hospital Management System', { align: 'center' });
        doc.moveDown();
        doc.moveTo(50, 100).lineTo(550, 100).stroke();

        // Bill Info
        doc.moveDown();
        doc.fontSize(14).text('INVOICE', { underline: true });
        doc.moveDown();
        doc.fontSize(10).text(`Bill ID: ${bill._id}`);
        doc.text(`Date: ${new Date().toLocaleDateString()}`);
        doc.text(`Patient Name: ${bill.patient.name}`);
        doc.moveDown();

        // Table Header
        doc.fontSize(12).text('Description', 50, 250);
        doc.text('Amount', 450, 250);
        doc.moveTo(50, 265).lineTo(550, 265).stroke();

        // Items
        let y = 280;
        bill.items.forEach(item => {
            doc.fontSize(10).text(item.description, 50, y);
            doc.text(`Rs. ${item.amount}`, 450, y);
            y += 20;
        });

        // Total
        doc.moveTo(50, y + 10).lineTo(550, y + 10).stroke();
        doc.fontSize(14).text(`Total Amount: Rs. ${bill.totalAmount}`, 350, y + 25, { bold: true });

        // Footer
        doc.fontSize(10).text('Thank you for choosing HealthRekha AI!', 50, 700, { align: 'center' });

        doc.end();

        stream.on('finish', () => resolve(filePath));
        stream.on('error', (err) => reject(err));
    });
};

module.exports = { generateInvoicePDF };
