import { Request, Response } from "express";
import PDFDocument from "pdfkit";
import Asset from "../models/Asset";
import Liability from "../models/Liability";
import Budget from "../models/Budget";

export async function generateReport(req: Request, res: Response) {
  try {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    const userId = req.user._id;
    
    // Fetch data from the database
    const assets = await Asset.find({ userId });
    const liabilities = await Liability.find({ userId });
    const budgetItems = await Budget.find({ userId });

    // Calculate financial summaries
    const totalAssets = assets.reduce((sum, asset) => {
      const value = asset.value.replace(/[^0-9.-]+/g, '');
      return sum + (parseFloat(value) || 0);
    }, 0);

    const totalLiabilities = liabilities.reduce((sum, liability) => {
      const amount = liability.amount.replace(/[^0-9.-]+/g, '');
      return sum + (parseFloat(amount) || 0);
    }, 0);

    const netWorth = totalAssets - totalLiabilities;

    // Create a PDF document
    const doc = new PDFDocument({ margin: 50 });

    // Set response headers for PDF download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=finvault_report_${new Date().toISOString().split('T')[0]}.pdf`);

    // Pipe the PDF to the response
    doc.pipe(res);

    // Add document title
    doc.fontSize(25)
      .fillColor('#4F46E5')
      .text('FinVault Financial Report', { align: 'center' })
      .moveDown(1);

    // Add current date
    doc.fontSize(12)
      .fillColor('#6B7280')
      .text(`Generated on: ${new Date().toLocaleString()}`, { align: 'center' })
      .moveDown(2);

    // Add summary section
    doc.fontSize(18)
      .fillColor('#111827')
      .text('Financial Summary', { underline: true })
      .moveDown(0.5);

    doc.fontSize(12)
      .fillColor('#374151')
      .text(`Total Assets: ₹${totalAssets.toLocaleString()}`)
      .text(`Total Liabilities: ₹${totalLiabilities.toLocaleString()}`)
      .text(`Net Worth: ₹${netWorth.toLocaleString()}`)
      .moveDown(2);

    // Assets section
    doc.fontSize(18)
      .fillColor('#111827')
      .text('Assets', { underline: true })
      .moveDown(0.5);

    if (assets.length > 0) {
      // Create a table-like structure for assets
      const assetTableTop = doc.y;
      doc.fontSize(10).fillColor('#4B5563');
      
      // Table headers
      const assetColumns = [
        { header: 'Title', x: 50, width: 150 },
        { header: 'Type', x: 200, width: 100 },
        { header: 'Value', x: 300, width: 100 },
        { header: 'Change', x: 400, width: 50 },
        { header: 'Date', x: 450, width: 100 }
      ];

      // Draw headers
      assetColumns.forEach(column => {
        doc.text(column.header, column.x, assetTableTop, { width: column.width, align: 'left' });
      });
      
      // Draw a line below headers
      doc.moveTo(50, assetTableTop + 15)
         .lineTo(550, assetTableTop + 15)
         .stroke();
      
      // Move to start of data rows
      doc.moveDown();
      let assetY = doc.y;

      // Add data rows
      assets.forEach((asset, i) => {
        // Check if we need a new page
        if (assetY > 700) {
          doc.addPage();
          assetY = 50;
        }
        
        assetColumns.forEach(column => {
          let value = '';
          
          if (column.header === 'Title') value = asset.title;
          if (column.header === 'Type') value = asset.type;
          if (column.header === 'Value') value = asset.value;
          if (column.header === 'Change') value = asset.change || '0%';
          if (column.header === 'Date') {
            try {
              value = new Date(asset.date).toLocaleDateString();
            } catch (e) {
              value = asset.date;
            }
          }
          
          doc.fillColor(column.header === 'Title' ? '#1F2937' : '#4B5563')
             .text(value, column.x, assetY, { width: column.width, align: 'left' });
        });
        
        assetY += 20;
      });
      
      doc.moveDown(2);
    } else {
      doc.fontSize(10).fillColor('#6B7280').text('No assets found.').moveDown(1);
    }

    // Liabilities section
    doc.fontSize(18)
      .fillColor('#111827')
      .text('Liabilities', { underline: true })
      .moveDown(0.5);

    if (liabilities.length > 0) {
      // Create a table-like structure for liabilities
      const liabilityTableTop = doc.y;
      doc.fontSize(10).fillColor('#4B5563');
      
      // Table headers
      const liabilityColumns = [
        { header: 'Title', x: 50, width: 120 },
        { header: 'Type', x: 170, width: 80 },
        { header: 'Amount', x: 250, width: 80 },
        { header: 'Interest', x: 330, width: 60 },
        { header: 'Payment', x: 390, width: 80 },
        { header: 'Status', x: 470, width: 80 }
      ];

      // Draw headers
      liabilityColumns.forEach(column => {
        doc.text(column.header, column.x, liabilityTableTop, { width: column.width, align: 'left' });
      });
      
      // Draw a line below headers
      doc.moveTo(50, liabilityTableTop + 15)
         .lineTo(550, liabilityTableTop + 15)
         .stroke();
      
      // Move to start of data rows
      doc.moveDown();
      let liabilityY = doc.y;

      // Add data rows
      liabilities.forEach((liability, i) => {
        // Check if we need a new page
        if (liabilityY > 700) {
          doc.addPage();
          liabilityY = 50;
        }
        
        liabilityColumns.forEach(column => {
          let value = '';
          
          if (column.header === 'Title') value = liability.title;
          if (column.header === 'Type') value = liability.type;
          if (column.header === 'Amount') value = liability.amount;
          if (column.header === 'Interest') value = liability.interest || 'N/A';
          if (column.header === 'Payment') value = liability.payment || 'N/A';
          if (column.header === 'Status') value = liability.status;
          
          const textColor = column.header === 'Status' ? 
            (liability.status === 'late' ? '#EF4444' : 
             liability.status === 'warning' ? '#F59E0B' : '#10B981') : 
            (column.header === 'Title' ? '#1F2937' : '#4B5563');
            
          doc.fillColor(textColor)
             .text(value, column.x, liabilityY, { width: column.width, align: 'left' });
        });
        
        liabilityY += 20;
      });
      
      doc.moveDown(2);
    } else {
      doc.fontSize(10).fillColor('#6B7280').text('No liabilities found.').moveDown(1);
    }

    // Budget section
    doc.fontSize(18)
      .fillColor('#111827')
      .text('Budget', { underline: true })
      .moveDown(0.5);

    if (budgetItems.length > 0) {
      // Create a table-like structure for budget items
      const budgetTableTop = doc.y;
      doc.fontSize(10).fillColor('#4B5563');
      
      // Table headers
      const budgetColumns = [
        { header: 'Category', x: 50, width: 150 },
        { header: 'Budgeted', x: 200, width: 100 },
        { header: 'Spent', x: 300, width: 100 },
        { header: 'Percentage', x: 400, width: 80 },
        { header: 'Status', x: 480, width: 70 }
      ];

      // Draw headers
      budgetColumns.forEach(column => {
        doc.text(column.header, column.x, budgetTableTop, { width: column.width, align: 'left' });
      });
      
      // Draw a line below headers
      doc.moveTo(50, budgetTableTop + 15)
         .lineTo(550, budgetTableTop + 15)
         .stroke();
      
      // Move to start of data rows
      doc.moveDown();
      let budgetY = doc.y;

      // Add data rows
      budgetItems.forEach((budget, i) => {
        // Check if we need a new page
        if (budgetY > 700) {
          doc.addPage();
          budgetY = 50;
        }
        
        budgetColumns.forEach(column => {
          let value = '';
          
          if (column.header === 'Category') value = budget.title;
          if (column.header === 'Budgeted') value = budget.budgeted;
          if (column.header === 'Spent') value = budget.spent;
          if (column.header === 'Percentage') value = `${budget.percentage}%`;
          if (column.header === 'Status') value = budget.status;
          
          const textColor = column.header === 'Status' ? 
            (budget.status === 'danger' ? '#EF4444' : 
             budget.status === 'warning' ? '#F59E0B' : '#10B981') : 
            (column.header === 'Category' ? '#1F2937' : '#4B5563');
            
          doc.fillColor(textColor)
             .text(value, column.x, budgetY, { width: column.width, align: 'left' });
        });
        
        budgetY += 20;
      });
      
    } else {
      doc.fontSize(10).fillColor('#6B7280').text('No budget items found.').moveDown(1);
    }

    // Add footer
    doc.fontSize(10)
      .fillColor('#6B7280')
      .text('FinVault - Your Trusted Financial Companion', { align: 'center' })
      .moveDown(0.5);

    // Finalize the PDF and end the stream
    doc.end();
  } catch (error) {
    console.error('Error generating PDF report:', error);
    res.status(500).json({ error: 'Failed to generate report' });
  }
}