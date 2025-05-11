"use client";

import { MeetingUI } from '../dataConverters';

/**
 * Generate a PDF document from meeting data
 * 
 * NOTE: This is a placeholder implementation that will be replaced
 * when we add jsPDF as a dependency. Currently, it uses the browser's
 * built-in print functionality to generate a PDF.
 * 
 * @param meetings List of meetings to include in the PDF
 * @param date Date string for the PDF title
 * @returns Promise that resolves when PDF is generated
 */
export async function generateMeetingsPDF(meetings: MeetingUI[], date: string): Promise<void> {
  // Create a new window for printing
  const printWindow = window.open('', '_blank');
  
  if (!printWindow) {
    throw new Error('Unable to open print window. Please check if pop-ups are blocked.');
  }
  
  // Generate HTML content
  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Meeting Schedule - ${date}</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          margin: 0;
          padding: 20px;
        }
        .container {
          max-width: 800px;
          margin: 0 auto;
        }
        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          padding-bottom: 10px;
          border-bottom: 1px solid #ddd;
        }
        .title {
          font-size: 24px;
          font-weight: bold;
          color: #333;
        }
        .date {
          font-size: 16px;
          color: #666;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 30px;
        }
        th {
          background-color: #f5f5f5;
          padding: 10px;
          text-align: left;
          font-weight: bold;
          border-bottom: 2px solid #ddd;
        }
        td {
          padding: 10px;
          border-bottom: 1px solid #ddd;
          vertical-align: top;
        }
        tr:nth-child(even) {
          background-color: #f9f9f9;
        }
        .footer {
          margin-top: 30px;
          text-align: center;
          font-size: 14px;
          color: #666;
          border-top: 1px solid #ddd;
          padding-top: 10px;
        }
        .empty-message {
          text-align: center;
          padding: 20px;
          color: #666;
          font-style: italic;
        }
        @media print {
          body {
            padding: 0;
          }
          .container {
            width: 100%;
          }
          .no-print {
            display: none;
          }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="title">Meeting Schedule</div>
          <div class="date">${date}</div>
        </div>
        
        <table>
          <thead>
            <tr>
              <th width="15%">Time</th>
              <th width="30%">Venue</th>
              <th width="40%">Agenda</th>
              <th width="15%">Comment</th>
            </tr>
          </thead>
          <tbody>
            ${meetings.length === 0 
              ? `<tr><td colspan="4" class="empty-message">No meetings scheduled for this date.</td></tr>` 
              : meetings.map(meeting => `
                <tr>
                  <td>${meeting.time}</td>
                  <td>${escapeHtml(meeting.venue)}</td>
                  <td>${escapeHtml(meeting.agenda)}</td>
                  <td>${meeting.commentLink 
                    ? `<a href="${meeting.commentLink}" target="_blank">Link</a>` 
                    : ''}
                  </td>
                </tr>
              `).join('')}
          </tbody>
        </table>
        
        <div class="footer">
          <p>${meetings.length} meeting${meetings.length !== 1 ? 's' : ''} scheduled for ${date}</p>
          <p class="no-print">Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
        </div>
      </div>
      
      <script>
        // Auto-print when the page loads
        window.onload = function() {
          window.print();
        }
      </script>
    </body>
    </html>
  `;
  
  // Write content to the new window
  printWindow.document.open();
  printWindow.document.write(htmlContent);
  printWindow.document.close();
  
  return new Promise((resolve) => {
    // Handle the afterprint event to resolve the promise
    printWindow.addEventListener('afterprint', () => {
      // Close the print window after printing is done or canceled
      setTimeout(() => {
        printWindow.close();
        resolve();
      }, 100);
    });
  });
}

/**
 * Escape HTML special characters to prevent XSS
 */
function escapeHtml(unsafe: string): string {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
