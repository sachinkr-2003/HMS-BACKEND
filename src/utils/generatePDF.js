const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

/**
 * Generate a professional Medical Bill PDF
 * @param {Object} bill - The bill object
 * @param {string} filePath - Path where the PDF will be saved
 */
const generateInvoicePDF = (bill, filePath) => {
    return new Promise((resolve, reject) => {
        const doc = new PDFDocument({ margin: 40, size: 'A4' });

        // Ensure directory exists
        const dir = path.dirname(filePath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        const stream = fs.createWriteStream(filePath);
        doc.pipe(stream);

        const greenColor = '#27ae60';
        const lightGreen = '#eafaf1';

        // --- HEADER ---
        doc.fillColor(greenColor).rect(0, 0, 600, 50).fill();
        doc.fillColor('white').fontSize(24).font('Helvetica-Bold').text('Medical Bill', 0, 15, { align: 'center' });
        
        doc.fillColor('black').fontSize(10).font('Helvetica').text(`Bill Number: ${bill._id.toString().slice(-6).toUpperCase()}`, 450, 60);
        
        // --- SHOP INFO ---
        doc.fillColor('black').fontSize(12).font('Helvetica-Bold').text('HealthRekha Hospital & Pharmacy', 40, 70);
        doc.fontSize(9).font('Helvetica').text('123, Wellness Plaza, Healthcare City', 40, 85);
        doc.text('Phone: +91 98765 43210 | Email: contact@healthrekha.ai', 40, 97);
        
        doc.moveTo(40, 115).lineTo(555, 115).strokeColor('#eeeeee').stroke();

        // --- BILLING TO ---
        doc.fillColor(greenColor).rect(40, 125, 515, 20).fill();
        doc.fillColor('white').fontSize(10).font('Helvetica-Bold').text('Billing To', 45, 130);

        doc.fillColor('black').fontSize(10).font('Helvetica-Bold').text('Customer Name:', 45, 155);
        doc.font('Helvetica').text(bill.patient?.name || 'Walk-in Customer', 130, 155);
        
        doc.font('Helvetica-Bold').text('Date:', 400, 155);
        doc.font('Helvetica').text(new Date(bill.createdAt || Date.now()).toLocaleDateString(), 440, 155);

        // --- TABLE HEADER ---
        const tableTop = 190;
        doc.fillColor(greenColor).rect(40, tableTop, 515, 25).fill();
        doc.fillColor('white').fontSize(10).font('Helvetica-Bold');
        doc.text('S.No', 45, tableTop + 7);
        doc.text('Item Description', 100, tableTop + 7);
        doc.text('Qty', 350, tableTop + 7, { width: 30, align: 'center' });
        doc.text('MRP (Rs)', 410, tableTop + 7, { width: 50, align: 'right' });
        doc.text('Amount (Rs)', 480, tableTop + 7, { width: 70, align: 'right' });

        // --- TABLE ITEMS ---
        let itemY = tableTop + 35;
        doc.fillColor('black').font('Helvetica').fontSize(9);
        
        bill.items.forEach((item, index) => {
            doc.text(index + 1, 45, itemY);
            doc.text(item.description, 100, itemY, { width: 240 });
            doc.text(item.quantity || 1, 350, itemY, { width: 30, align: 'center' });
            doc.text((item.amount / (item.quantity || 1)).toFixed(2), 410, itemY, { width: 50, align: 'right' });
            doc.text(item.amount.toFixed(2), 480, itemY, { width: 70, align: 'right' });
            
            itemY += 25;
            // Draw thin line
            doc.moveTo(40, itemY - 5).lineTo(555, itemY - 5).strokeColor('#f5f5f5').stroke();
        });

        // --- SUMMARY ---
        const summaryY = Math.max(itemY + 20, 500);
        
        // Horizontal line for total
        doc.moveTo(40, summaryY).lineTo(555, summaryY).strokeColor(greenColor).stroke();

        doc.fontSize(10).font('Helvetica-Bold');
        doc.text('Total:', 400, summaryY + 10);
        doc.font('Helvetica').text(`Rs. ${bill.totalAmount.toFixed(2)}`, 480, summaryY + 10, { width: 70, align: 'right' });

        doc.font('Helvetica-Bold').text('GST (18%):', 400, summaryY + 30);
        doc.font('Helvetica').text(`Included`, 480, summaryY + 30, { width: 70, align: 'right' });

        doc.fillColor(greenColor).rect(390, summaryY + 50, 165, 25).fill();
        doc.fillColor('white').font('Helvetica-Bold').fontSize(11).text('Grand Total:', 400, summaryY + 57);
        doc.text(`Rs. ${bill.totalAmount.toFixed(2)}`, 480, summaryY + 57, { width: 70, align: 'right' });

        // Amount in words placeholder
        doc.fillColor('black').fontSize(9).font('Helvetica-Bold').text('Amount in Words:', 45, summaryY + 10);
        doc.font('Helvetica').text('Rupees ' + bill.totalAmount.toFixed(2).toString() + ' Only', 45, summaryY + 25);

        // --- FOOTER ---
        doc.rect(400, summaryY + 100, 140, 50).strokeColor('#cccccc').stroke();
        doc.fontSize(8).text('Authorized Signature', 400, summaryY + 155, { width: 140, align: 'center' });

        doc.fontSize(8).fillColor('#999999').text('This is a computer generated invoice and does not require a physical signature.', 0, 780, { align: 'center' });
        doc.text('HealthRekha AI - Professional Hospital ERP', 0, 792, { align: 'center' });

        doc.end();

        stream.on('finish', () => resolve(filePath));
        stream.on('error', (err) => reject(err));
    });
};

module.exports = { generateInvoicePDF };
