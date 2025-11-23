import { useState, useMemo } from 'react';
import { Book, BorrowedBook } from '../../App';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Search, Calendar, DollarSign } from 'lucide-react';
import { ReportGenerator } from './ReportGenerator';

interface TransactionHistoryProps {
  borrowedBooks: BorrowedBook[];
  books: Book[];
  setBorrowedBooks: React.Dispatch<React.SetStateAction<BorrowedBook[]>>;
}

const mockUsers = [
  { id: '2', name: 'John Doe' },
  { id: '3', name: 'Sarah Smith' },
  { id: '4', name: 'Mike Johnson' },
  { id: '5', name: 'Emma Wilson' },
];

export function TransactionHistory({ borrowedBooks, books, setBorrowedBooks }: TransactionHistoryProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const transactions = useMemo(() => {
    return borrowedBooks.map(borrowed => {
      const book = books.find(b => b.id === borrowed.bookId);
      const user = mockUsers.find(u => u.id === borrowed.userId);
      const isOverdue = !borrowed.returnDate && new Date(borrowed.dueDate) < new Date();
      const status = borrowed.returnDate ? 'returned' : isOverdue ? 'overdue' : 'active';
      
      return {
        ...borrowed,
        book,
        user,
        status,
        isOverdue
      };
    });
  }, [borrowedBooks, books]);

  const filteredTransactions = useMemo(() => {
    let filtered = transactions.filter(transaction => {
      const matchesSearch = 
        transaction.book?.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.user?.name.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = 
        filterStatus === 'all' || transaction.status === filterStatus;
      
      const matchesDateFrom = 
        !dateFrom || new Date(transaction.borrowDate) >= new Date(dateFrom);
      
      const matchesDateTo = 
        !dateTo || new Date(transaction.borrowDate) <= new Date(dateTo);
      
      return matchesSearch && matchesStatus && matchesDateFrom && matchesDateTo;
    });

    return filtered.sort((a, b) => 
      new Date(b.borrowDate).getTime() - new Date(a.borrowDate).getTime()
    );
  }, [transactions, searchTerm, filterStatus, dateFrom, dateTo]);

  const calculateFine = (dueDate: string, returnDate?: string) => {
    const due = new Date(dueDate);
    const returned = returnDate ? new Date(returnDate) : new Date();
    const daysLate = Math.max(0, Math.ceil((returned.getTime() - due.getTime()) / (1000 * 60 * 60 * 24)));
    return daysLate * 0.50; // $0.50 per day
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-[#7A3BA3] hover:bg-[#6B577C] text-white border-0">Active</Badge>;
      case 'overdue':
        return <Badge variant="destructive">Overdue</Badge>;
      case 'returned':
        return <Badge className="bg-[#4B0082] hover:bg-[#3A0066] text-white border-0">Returned</Badge>;
      default:
        return null;
    }
  };

  return (
    <Card className="bg-[#1A1A1A] border-[#333333] shadow-purple-md">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-white">Transaction History</CardTitle>
            <CardDescription className="text-[#BFBFBF]">View and manage all borrowing transactions</CardDescription>
          </div>
          <ReportGenerator borrowedBooks={borrowedBooks} books={books} />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#808080]" />
            <Input
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-[#262626] border-[#333333] text-white placeholder:text-[#808080] focus:border-[#4B0082] focus:ring-[#4B0082]"
            />
          </div>

          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="bg-[#262626] border-[#333333] text-white focus:border-[#4B0082] focus:ring-[#4B0082]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent className="bg-[#262626] border-[#333333] text-white">
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="overdue">Overdue</SelectItem>
              <SelectItem value="returned">Returned</SelectItem>
            </SelectContent>
          </Select>

          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#808080]" />
            <Input
              type="date"
              placeholder="From date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="pl-10 bg-[#262626] border-[#333333] text-white placeholder:text-[#808080] focus:border-[#4B0082] focus:ring-[#4B0082]"
            />
          </div>

          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#808080]" />
            <Input
              type="date"
              placeholder="To date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="pl-10 bg-[#262626] border-[#333333] text-white placeholder:text-[#808080] focus:border-[#4B0082] focus:ring-[#4B0082]"
            />
          </div>
        </div>

        {/* Transactions Table */}
        <div className="border border-[#333333] rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-[#262626] hover:bg-[#262626] border-[#333333]">
                <TableHead className="text-[#BFBFBF]">User</TableHead>
                <TableHead className="text-[#BFBFBF]">Book</TableHead>
                <TableHead className="text-[#BFBFBF]">Borrow Date</TableHead>
                <TableHead className="text-[#BFBFBF]">Due Date</TableHead>
                <TableHead className="text-[#BFBFBF]">Return Date</TableHead>
                <TableHead className="text-[#BFBFBF] text-center">Status</TableHead>
                <TableHead className="text-[#BFBFBF] text-right">Fine</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.map(transaction => {
                const fine = calculateFine(transaction.dueDate, transaction.returnDate);
                return (
                  <TableRow key={transaction.id} className="border-[#333333] hover:bg-[#262626] transition-colors">
                    <TableCell className="text-white">{transaction.user?.name}</TableCell>
                    <TableCell>
                      <div>
                        <div className="text-white">{transaction.book?.title}</div>
                        <div className="text-sm text-[#BFBFBF]">{transaction.book?.author}</div>
                      </div>
                    </TableCell>
                    <TableCell className="text-[#BFBFBF]">{transaction.borrowDate}</TableCell>
                    <TableCell className={transaction.isOverdue ? 'text-red-400' : 'text-[#BFBFBF]'}>
                      {transaction.dueDate}
                    </TableCell>
                    <TableCell className="text-[#BFBFBF]">
                      {transaction.returnDate || '-'}
                    </TableCell>
                    <TableCell className="text-center">
                      {getStatusBadge(transaction.status)}
                    </TableCell>
                    <TableCell className="text-right">
                      {fine > 0 ? (
                        <div className="flex items-center justify-end gap-1 text-red-400">
                          <DollarSign className="w-4 h-4" />
                          <span>{fine.toFixed(2)}</span>
                        </div>
                      ) : (
                        <span className="text-[#808080]">-</span>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>

        {filteredTransactions.length === 0 && (
          <div className="text-center py-8 text-[#808080]">
            No transactions found matching your criteria
          </div>
        )}

        {/* Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-[#333333]">
          <div className="p-4 bg-[#262626] rounded-lg border border-[#333333]">
            <div className="text-sm text-[#BFBFBF]">Total Transactions</div>
            <div className="text-white">{filteredTransactions.length}</div>
          </div>
          <div className="p-4 bg-[#262626] rounded-lg border border-[#333333]">
            <div className="text-sm text-[#BFBFBF]">Active Loans</div>
            <div className="text-white">
              {filteredTransactions.filter(t => t.status === 'active').length}
            </div>
          </div>
          <div className="p-4 bg-[#262626] rounded-lg border border-[#333333]">
            <div className="text-sm text-[#BFBFBF]">Overdue Books</div>
            <div className="text-red-400">
              {filteredTransactions.filter(t => t.status === 'overdue').length}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}