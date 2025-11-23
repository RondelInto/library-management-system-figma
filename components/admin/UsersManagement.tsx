import { useState, useMemo } from 'react';
import { Book, BorrowedBook } from '../../App';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Search, UserX, Eye } from 'lucide-react';

interface User {
  id: string;
  username: string;
  name: string;
  email: string;
  status: 'active' | 'banned';
  joinDate: string;
}

interface UsersManagementProps {
  borrowedBooks: BorrowedBook[];
  books: Book[];
}

const mockUsers: User[] = [
  { id: '2', username: 'user', name: 'John Doe', email: 'john@library.com', status: 'active', joinDate: '2025-01-15' },
  { id: '3', username: 'sarah', name: 'Sarah Smith', email: 'sarah@library.com', status: 'active', joinDate: '2025-02-20' },
  { id: '4', username: 'mike', name: 'Mike Johnson', email: 'mike@library.com', status: 'active', joinDate: '2025-03-10' },
  { id: '5', username: 'emma', name: 'Emma Wilson', email: 'emma@library.com', status: 'banned', joinDate: '2024-12-05' },
];

export function UsersManagement({ borrowedBooks, books }: UsersManagementProps) {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getUserBorrowedBooks = (userId: string) => {
    return borrowedBooks
      .filter(b => b.userId === userId && !b.returnDate)
      .map(b => ({
        ...b,
        book: books.find(book => book.id === b.bookId)
      }));
  };

  const getUserBorrowHistory = (userId: string) => {
    return borrowedBooks
      .filter(b => b.userId === userId)
      .map(b => ({
        ...b,
        book: books.find(book => book.id === b.bookId)
      }));
  };

  const toggleUserStatus = (userId: string) => {
    setUsers(prev => prev.map(user => 
      user.id === userId 
        ? { ...user, status: user.status === 'active' ? 'banned' as const : 'active' as const }
        : user
    ));
  };

  const handleViewHistory = (user: User) => {
    setSelectedUser(user);
    setIsHistoryOpen(true);
  };

  return (
    <>
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Users Management</CardTitle>
          <CardDescription className="text-slate-400">View and manage library members</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Search users by name, email, or username..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-slate-900 border-slate-700 text-white placeholder:text-slate-500"
            />
          </div>

          {/* Users Table */}
          <div className="border border-slate-700 rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-900 hover:bg-slate-900 border-slate-700">
                  <TableHead className="text-slate-300">Name</TableHead>
                  <TableHead className="text-slate-300">Email</TableHead>
                  <TableHead className="text-slate-300">Username</TableHead>
                  <TableHead className="text-slate-300">Join Date</TableHead>
                  <TableHead className="text-slate-300 text-center">Borrowed Books</TableHead>
                  <TableHead className="text-slate-300 text-center">Status</TableHead>
                  <TableHead className="text-slate-300 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map(user => {
                  const borrowedCount = getUserBorrowedBooks(user.id).length;
                  return (
                    <TableRow key={user.id} className="border-slate-700 hover:bg-slate-700/50">
                      <TableCell className="text-white">{user.name}</TableCell>
                      <TableCell className="text-slate-300">{user.email}</TableCell>
                      <TableCell className="text-slate-400">{user.username}</TableCell>
                      <TableCell className="text-slate-400">{user.joinDate}</TableCell>
                      <TableCell className="text-center text-slate-300">{borrowedCount}</TableCell>
                      <TableCell className="text-center">
                        {user.status === 'active' ? (
                          <Badge className="bg-green-600 hover:bg-green-700">Active</Badge>
                        ) : (
                          <Badge variant="destructive">Banned</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleViewHistory(user)}
                            className="border-slate-600 text-slate-300 hover:bg-slate-700"
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            History
                          </Button>
                          <Button
                            size="sm"
                            variant={user.status === 'active' ? 'destructive' : 'default'}
                            onClick={() => toggleUserStatus(user.id)}
                            className={user.status === 'active' ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}
                          >
                            <UserX className="w-4 h-4 mr-1" />
                            {user.status === 'active' ? 'Ban' : 'Unban'}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          {filteredUsers.length === 0 && (
            <div className="text-center py-8 text-slate-400">
              No users found matching your search criteria
            </div>
          )}
        </CardContent>
      </Card>

      {/* User History Dialog */}
      <Dialog open={isHistoryOpen} onOpenChange={setIsHistoryOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Borrow History - {selectedUser?.name}</DialogTitle>
            <DialogDescription>
              Complete borrowing history for {selectedUser?.email}
            </DialogDescription>
          </DialogHeader>
          
          {selectedUser && (
            <div className="space-y-4">
              {/* Currently Borrowed */}
              <div>
                <h4 className="mb-3">Currently Borrowed ({getUserBorrowedBooks(selectedUser.id).length})</h4>
                {getUserBorrowedBooks(selectedUser.id).length === 0 ? (
                  <p className="text-sm text-gray-500">No books currently borrowed</p>
                ) : (
                  <div className="space-y-2">
                    {getUserBorrowedBooks(selectedUser.id).map(({ book, borrowDate, dueDate }) => (
                      <div key={book?.id} className="p-3 bg-gray-50 rounded-md border">
                        <div className="flex justify-between items-start">
                          <div>
                            <p>{book?.title}</p>
                            <p className="text-sm text-gray-600">{book?.author}</p>
                          </div>
                          <div className="text-right text-sm">
                            <div className="text-gray-500">Borrowed: {borrowDate}</div>
                            <div className={new Date(dueDate) < new Date() ? 'text-red-600' : 'text-gray-500'}>
                              Due: {dueDate}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Full History */}
              <div className="pt-4 border-t">
                <h4 className="mb-3">Complete History ({getUserBorrowHistory(selectedUser.id).length})</h4>
                {getUserBorrowHistory(selectedUser.id).length === 0 ? (
                  <p className="text-sm text-gray-500">No borrowing history</p>
                ) : (
                  <div className="space-y-2">
                    {getUserBorrowHistory(selectedUser.id).map(({ id, book, borrowDate, dueDate, returnDate }) => (
                      <div key={id} className="p-3 bg-gray-50 rounded-md border">
                        <div className="flex justify-between items-start">
                          <div>
                            <p>{book?.title}</p>
                            <p className="text-sm text-gray-600">{book?.author}</p>
                          </div>
                          <div className="text-right text-sm">
                            <div className="text-gray-500">Borrowed: {borrowDate}</div>
                            <div className="text-gray-500">Due: {dueDate}</div>
                            {returnDate && (
                              <div className="text-green-600">Returned: {returnDate}</div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
