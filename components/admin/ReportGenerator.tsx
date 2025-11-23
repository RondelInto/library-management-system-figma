import { useState } from 'react';
import { Book, BorrowedBook } from '../../App';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { FileText, Download, Printer } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface ReportGeneratorProps {
  borrowedBooks: BorrowedBook[];
  books: Book[];
}

const mockUsers = [
  { id: '2', name: 'John Doe', email: 'john@library.com' },
  { id: '3', name: 'Sarah Smith', email: 'sarah@library.com' },
  { id: '4', name: 'Mike Johnson', email: 'mike@library.com' },
  { id: '5', name: 'Emma Wilson', email: 'emma@library.com' },
];

export function ReportGenerator({ borrowedBooks, books }: ReportGeneratorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [reportType, setReportType] = useState('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [format, setFormat] = useState<'html' | 'csv'>('html');

  const calculateFine = (dueDate: string, returnDate?: string) => {
    const due = new Date(dueDate);
    const returned = returnDate ? new Date(returnDate) : new Date();
    const daysLate = Math.max(0, Math.ceil((returned.getTime() - due.getTime()) / (1000 * 60 * 60 * 24)));
    return daysLate * 0.50;
  };

  const getFilteredTransactions = () => {
    let filtered = borrowedBooks.map(borrowed => {
      const book = books.find(b => b.id === borrowed.bookId);
      const user = mockUsers.find(u => u.id === borrowed.userId);
      const isOverdue = !borrowed.returnDate && new Date(borrowed.dueDate) < new Date();
      const status = borrowed.returnDate ? 'returned' : isOverdue ? 'overdue' : 'active';
      const fine = calculateFine(borrowed.dueDate, borrowed.returnDate);

      return {
        ...borrowed,
        book,
        user,
        status,
        fine,
        isOverdue
      };
    });

    // Apply filters
    if (reportType !== 'all') {
      filtered = filtered.filter(t => t.status === reportType);
    }

    if (dateFrom) {
      filtered = filtered.filter(t => new Date(t.borrowDate) >= new Date(dateFrom));
    }

    if (dateTo) {
      filtered = filtered.filter(t => new Date(t.borrowDate) <= new Date(dateTo));
    }

    return filtered.sort((a, b) => 
      new Date(b.borrowDate).getTime() - new Date(a.borrowDate).getTime()
    );
  };

  const generateHTMLReport = () => {
    const transactions = getFilteredTransactions();
    const totalFines = transactions.reduce((sum, t) => sum + t.fine, 0);
    const activeLoans = transactions.filter(t => t.status === 'active').length;
    const overdueBooks = transactions.filter(t => t.status === 'overdue').length;
    const returnedBooks = transactions.filter(t => t.status === 'returned').length;

    const reportDate = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Library Transaction History Report</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            background: #fff;
            padding: 40px;
            max-width: 1200px;
            margin: 0 auto;
        }
        .header {
            border-bottom: 4px solid #4F46E5;
            padding-bottom: 20px;
            margin-bottom: 30px;
        }
        .header h1 {
            color: #4F46E5;
            font-size: 32px;
            margin-bottom: 8px;
        }
        .header .subtitle {
            color: #6B7280;
            font-size: 14px;
        }
        .meta-info {
            background: #F9FAFB;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 30px;
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 15px;
        }
        .meta-item {
            display: flex;
            flex-direction: column;
        }
        .meta-item label {
            font-size: 12px;
            color: #6B7280;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 4px;
        }
        .meta-item value {
            font-size: 16px;
            color: #111827;
            font-weight: 600;
        }
        .summary {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 20px;
            margin-bottom: 40px;
        }
        .summary-card {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 20px;
            border-radius: 12px;
            color: white;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .summary-card.green {
            background: linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%);
        }
        .summary-card.yellow {
            background: linear-gradient(135deg, #ffeaa7 0%, #fdcb6e 100%);
        }
        .summary-card.red {
            background: linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%);
        }
        .summary-card h3 {
            font-size: 14px;
            opacity: 0.9;
            margin-bottom: 8px;
            font-weight: 500;
        }
        .summary-card .value {
            font-size: 32px;
            font-weight: 700;
        }
        .section-title {
            font-size: 20px;
            color: #111827;
            margin-bottom: 20px;
            padding-bottom: 10px;
            border-bottom: 2px solid #E5E7EB;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 40px;
            background: white;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
            border-radius: 8px;
            overflow: hidden;
        }
        thead {
            background: #F3F4F6;
        }
        th {
            padding: 12px 16px;
            text-align: left;
            font-size: 12px;
            font-weight: 600;
            color: #6B7280;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        td {
            padding: 12px 16px;
            border-top: 1px solid #E5E7EB;
            font-size: 14px;
        }
        tr:hover {
            background: #F9FAFB;
        }
        .status {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 12px;
            font-size: 12px;
            font-weight: 600;
            text-transform: uppercase;
        }
        .status.active {
            background: #DBEAFE;
            color: #1E40AF;
        }
        .status.overdue {
            background: #FEE2E2;
            color: #991B1B;
        }
        .status.returned {
            background: #D1FAE5;
            color: #065F46;
        }
        .fine {
            color: #DC2626;
            font-weight: 600;
        }
        .footer {
            margin-top: 60px;
            padding-top: 20px;
            border-top: 2px solid #E5E7EB;
            text-align: center;
            color: #6B7280;
            font-size: 12px;
        }
        .no-data {
            text-align: center;
            padding: 60px 20px;
            color: #6B7280;
            font-size: 16px;
        }
        @media print {
            body {
                padding: 20px;
            }
            .summary-card {
                break-inside: avoid;
            }
            table {
                page-break-inside: auto;
            }
            tr {
                page-break-inside: avoid;
                page-break-after: auto;
            }
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>📚 Library Transaction History Report</h1>
        <div class="subtitle">Comprehensive analysis of library borrowing activities</div>
    </div>

    <div class="meta-info">
        <div class="meta-item">
            <label>Report Generated</label>
            <value>${reportDate}</value>
        </div>
        <div class="meta-item">
            <label>Report Type</label>
            <value>${reportType === 'all' ? 'All Transactions' : reportType.charAt(0).toUpperCase() + reportType.slice(1)}</value>
        </div>
        ${dateFrom ? `
        <div class="meta-item">
            <label>Date From</label>
            <value>${new Date(dateFrom).toLocaleDateString()}</value>
        </div>
        ` : ''}
        ${dateTo ? `
        <div class="meta-item">
            <label>Date To</label>
            <value>${new Date(dateTo).toLocaleDateString()}</value>
        </div>
        ` : ''}
    </div>

    <div class="summary">
        <div class="summary-card">
            <h3>Total Transactions</h3>
            <div class="value">${transactions.length}</div>
        </div>
        <div class="summary-card green">
            <h3>Active Loans</h3>
            <div class="value">${activeLoans}</div>
        </div>
        <div class="summary-card yellow">
            <h3>Overdue Books</h3>
            <div class="value">${overdueBooks}</div>
        </div>
        <div class="summary-card red">
            <h3>Total Fines</h3>
            <div class="value">$${totalFines.toFixed(2)}</div>
        </div>
    </div>

    <h2 class="section-title">Transaction Details</h2>

    ${transactions.length === 0 ? `
    <div class="no-data">
        <p>No transactions found matching the selected criteria.</p>
    </div>
    ` : `
    <table>
        <thead>
            <tr>
                <th>Date</th>
                <th>User</th>
                <th>Book</th>
                <th>Author</th>
                <th>Due Date</th>
                <th>Return Date</th>
                <th>Status</th>
                <th>Fine</th>
            </tr>
        </thead>
        <tbody>
            ${transactions.map(t => `
            <tr>
                <td>${t.borrowDate}</td>
                <td>${t.user?.name || 'Unknown'}</td>
                <td>${t.book?.title || 'Unknown'}</td>
                <td>${t.book?.author || 'Unknown'}</td>
                <td>${t.dueDate}</td>
                <td>${t.returnDate || '-'}</td>
                <td><span class="status ${t.status}">${t.status}</span></td>
                <td class="fine">${t.fine > 0 ? '$' + t.fine.toFixed(2) : '-'}</td>
            </tr>
            `).join('')}
        </tbody>
    </table>
    `}

    <div class="footer">
        <p>Library Management System - Transaction History Report</p>
        <p>This report was automatically generated on ${reportDate}</p>
        <p style="margin-top: 10px; font-style: italic;">Confidential - For internal use only</p>
    </div>
</body>
</html>
    `;

    return html;
  };

  const generateCSVReport = () => {
    const transactions = getFilteredTransactions();
    
    const headers = [
      'Transaction ID',
      'Borrow Date',
      'User Name',
      'User Email',
      'Book Title',
      'Author',
      'ISBN',
      'Genre',
      'Due Date',
      'Return Date',
      'Status',
      'Fine ($)'
    ];

    const rows = transactions.map(t => [
      t.id,
      t.borrowDate,
      t.user?.name || 'Unknown',
      t.user?.email || 'Unknown',
      t.book?.title || 'Unknown',
      t.book?.author || 'Unknown',
      t.book?.isbn || 'Unknown',
      t.book?.genre || 'Unknown',
      t.dueDate,
      t.returnDate || 'Not Returned',
      t.status,
      t.fine.toFixed(2)
    ]);

    const csv = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    return csv;
  };

  const handleGenerateReport = () => {
    const transactions = getFilteredTransactions();
    
    if (transactions.length === 0) {
      toast.error('No transactions found for the selected criteria');
      return;
    }

    if (format === 'html') {
      const html = generateHTMLReport();
      const blob = new Blob([html], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `library-report-${new Date().toISOString().split('T')[0]}.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success('Report generated successfully');
    } else {
      const csv = generateCSVReport();
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `library-report-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success('CSV report generated successfully');
    }
  };

  const handlePrintPreview = () => {
    const html = generateHTMLReport();
    const printWindow = window.open('', '', 'width=1200,height=800');
    if (printWindow) {
      printWindow.document.write(html);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
      }, 250);
    }
  };

  return (
    <>
      <Button onClick={() => setIsOpen(true)} className="bg-indigo-600 hover:bg-indigo-700">
        <FileText className="w-4 h-4 mr-2" />
        Generate Report
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Generate Transaction Report</DialogTitle>
            <DialogDescription>
              Configure report parameters and download a comprehensive transaction history document
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Report Type</Label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Transactions</SelectItem>
                  <SelectItem value="active">Active Loans Only</SelectItem>
                  <SelectItem value="overdue">Overdue Only</SelectItem>
                  <SelectItem value="returned">Returned Only</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>From Date</Label>
                <Input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>To Date</Label>
                <Input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Format</Label>
              <Select value={format} onValueChange={(value: 'html' | 'csv') => setFormat(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="html">HTML Document (Formatted)</SelectItem>
                  <SelectItem value="csv">CSV Spreadsheet</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-500">
                {format === 'html' 
                  ? 'Beautiful formatted report that can be viewed in any browser and printed' 
                  : 'Spreadsheet format compatible with Excel, Google Sheets, etc.'}
              </p>
            </div>

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-900">
                <strong>Preview:</strong> {getFilteredTransactions().length} transactions will be included in this report
              </p>
            </div>

            <div className="flex gap-2 pt-4">
              <Button
                onClick={handlePrintPreview}
                variant="outline"
                className="flex-1"
                disabled={format !== 'html'}
              >
                <Printer className="w-4 h-4 mr-2" />
                Preview & Print
              </Button>
              <Button
                onClick={handleGenerateReport}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700"
              >
                <Download className="w-4 h-4 mr-2" />
                Download Report
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
