import { Injectable } from "@nestjs/common";
const ejs = require('ejs');
const fs = require('fs');
const PDFDocument = require('pdfkit');
// const { renderFile } = ejs;
const pdf = require('html-pdf');


@Injectable()
export class PdfService {
    constructor () {}

    // async exportPdf(data: any): Promise<string> {
    //     const templatePath = './src/user/templates/pdfTemplate.ejs';
    //     const fileName = `diet_plan.pdf`;
    //     const outputFilePath = `./uploads/${fileName}`;
        
    //     return new Promise((resolve, reject) => {
    //         // Render the EJS template
    //         ejs.renderFile(templatePath, { data }, (err, html) => {
    //             if (err) {
    //                 console.error('Error rendering EJS template:', err);
    //                 return reject(err);
    //             }

    //             // Generate the PDF with PDFKit
    //             const pdfDoc = new PDFDocument({
    //                 margin: 50,
    //             });

    //             const writeStream = fs.createWriteStream(outputFilePath);
    //             pdfDoc.pipe(writeStream);

    //             // Add Title to PDF
    //             pdfDoc.fontSize(20).fillColor('#333').text('Diet Plan', { align: 'center' });
    //             pdfDoc.moveDown();

    //             // Loop through each day and create a table structure
    //             data.forEach((day) => {
    //                 // Add a header for each day
    //                 pdfDoc
    //                     .fontSize(16)
    //                     .fillColor('#444')
    //                     .text(day.name, { underline: true });
    //                 pdfDoc.moveDown(0.5);

    //                 // Table Headers
    //                 pdfDoc
    //                     .fontSize(12)
    //                     .fillColor('#000')
    //                     .text('Meal Type', 50, pdfDoc.y)
    //                     .moveUp()
    //                     .text('Name', 200, pdfDoc.y)
    //                     .moveUp()
    //                     .text('Quantity', 350, pdfDoc.y)
    //                     .moveUp()
    //                     .text('Calories', 450, pdfDoc.y);

    //                 pdfDoc.moveDown(0.5);
    //                 pdfDoc.strokeColor('#cccccc').moveTo(50, pdfDoc.y).lineTo(550, pdfDoc.y).stroke();

    //                 // Add rows for each meal
    //                 day.meals.forEach((meal) => {
    //                     pdfDoc.moveDown(0.3);
    //                     pdfDoc
    //                         .fontSize(11)
    //                         .fillColor('#666')
    //                         .text(meal.meal_type, 50, pdfDoc.y)
    //                         .moveUp()
    //                         .text(meal.items.name, 200, pdfDoc.y)
    //                         .moveUp()
    //                         .text(meal.items.quantity, 350, pdfDoc.y)
    //                         .moveUp()
    //                         .text(meal.items.calories, 450, pdfDoc.y);

    //                     pdfDoc.moveDown(0.2);
    //                     pdfDoc.strokeColor('#dddddd').moveTo(50, pdfDoc.y).lineTo(550, pdfDoc.y).stroke();
    //                 });

    //                 // Add a new page for the next day
    //                 pdfDoc.addPage();
    //             });

    //             // Finalize PDF file
    //             pdfDoc.end();

    //             // Resolve promise when writing is done
    //             writeStream.on('finish', () => {
    //                 console.log(`PDF generated at ${outputFilePath}`);
    //                 resolve(fileName);
    //             });

    //             writeStream.on('error', (err) => {
    //                 console.error('Error writing PDF:', err);
    //                 reject(err);
    //             });
    //         });
    //     });
    // }

    // async exportPdf(data: any): Promise<string> {
    //     const templatePath = './src/user/templates/pdfTemplate.ejs';
    //     const fileName = `diet_plan.pdf`;
    //     const outputFilePath = `./uploads/${fileName}`;
    
    //     return new Promise((resolve, reject) => {
    //         // Render the EJS template
    //         ejs.renderFile(templatePath, { data }, (err, html) => {
    //             if (err) {
    //                 console.error('Error rendering EJS template:', err);
    //                 return reject(err);
    //             }
    
    //             // Generate the PDF with PDFKit
    //             const pdfDoc = new PDFDocument({
    //                 margin: 30, // Reduced margins
    //                 size: 'A4' // Standard paper size
    //             });
    
    //             const writeStream = fs.createWriteStream(outputFilePath);
    //             pdfDoc.pipe(writeStream);
    
    //             // Add Title to PDF (Ensure visibility)
    //             pdfDoc
    //                 .fontSize(20)  // Increase font size for better visibility
    //                 .fillColor('#333')  // Ensure proper contrast with background
    //                 .text('Diet Plan', { align: 'center' });  // Ensure it is centered properly
    //             pdfDoc.moveDown(1); // Add a little more space after the title
    
    //             // Loop through each day and create a table structure
    //             data.forEach((day, dayIndex) => {
    //                 // Add a header for each day
    //                 pdfDoc
    //                     .fontSize(14)  // Increased font size for day headers
    //                     .fillColor('#00796b')  // Ensure color is visible
    //                     .text(day.name, { underline: true });
    //                 pdfDoc.moveDown(0.5);
    
    //                 // Table Headers with color
    //                 pdfDoc
    //                     .fontSize(10)
    //                     .fillColor('white')
    //                     .rect(50, pdfDoc.y, 500, 20)
    //                     .fill('#009688') // Table header background color
    //                     .fillColor('white') // Table header text color
    //                     .text('Meal Type', 55, pdfDoc.y + 5)
    //                     .text('Name', 200, pdfDoc.y + 5)
    //                     .text('Quantity', 350, pdfDoc.y + 5)
    //                     .text('Calories', 450, pdfDoc.y + 5);
    
    //                 pdfDoc.moveDown(1.5);
    
    //                 // Add rows for each meal with alternating row colors
    //                 day.meals.forEach((meal, index) => {
    //                     const yPosition = pdfDoc.y;
    //                     const rowColor = index % 2 === 0 ? '#f2f2f2' : '#ffffff'; // Alternating row color
    
    //                     // Add background color to the row
    //                     pdfDoc.rect(50, yPosition, 500, 20).fill(rowColor);
    
    //                     // Add meal data
    //                     pdfDoc
    //                         .fontSize(10)
    //                         .fillColor('#666')
    //                         .text(meal.meal_type, 55, yPosition + 5)
    //                         .text(meal.items.name, 200, yPosition + 5)
    //                         .text(meal.items.quantity, 350, yPosition + 5)
    //                         .text(meal.items.calories, 450, yPosition + 5);
    
    //                     // Add a bottom border to the row
    //                     pdfDoc.strokeColor('#dddddd').moveTo(50, pdfDoc.y + 20).lineTo(550, pdfDoc.y + 20).stroke();
    
    //                     pdfDoc.moveDown(0.5);
    
    //                     // Check if the content exceeds the page height, then add a new page
    //                     if (pdfDoc.y > pdfDoc.page.height - 50) {
    //                         pdfDoc.addPage();
    //                     }
    //                 });
    
    //                 // Only add a new page if it's not the last day to prevent extra page
    //                 if (dayIndex !== data.length - 1) {
    //                     pdfDoc.addPage();
    //                 }
    //             });
    
    //             // Finalize PDF file
    //             pdfDoc.end();
    
    //             // Resolve promise when writing is done
    //             writeStream.on('finish', () => {
    //                 console.log(`PDF generated at ${outputFilePath}`);
    //                 resolve(fileName);
    //             });
    
    //             writeStream.on('error', (err) => {
    //                 console.error('Error writing PDF:', err);
    //                 reject(err);
    //             });
    //         });
    //     });
    // }

    async exportPdf (data) {
        const templatePath = './src/user/templates/pdfTemplate.ejs';
        const fileName = `${Date.now()}_diet_plan.pdf`;
        const outputFilePath = `./uploads/${fileName}`;
    
        return new Promise((resolve, reject) => {
            ejs.renderFile(templatePath, { data }, (err, html) => {
                if (err) {
                    console.error('Error rendering EJS template:', err);
                    return reject(err);
                }
                pdf.create(html).toFile(outputFilePath, (err, res) => {
                    if (err) {
                        console.error('Error generating PDF:', err);
                        return reject(err);
                    }
                    console.log(`PDF generated at ${res.filename}`);
                    resolve(fileName);
                });
            });
        });
    }
    
    
}


