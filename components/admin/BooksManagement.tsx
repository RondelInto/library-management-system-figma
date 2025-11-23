import { useState } from 'react';
import { Book } from '../../App';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface BooksManagementProps {
  books: Book[];
  setBooks: React.Dispatch<React.SetStateAction<Book[]>>;
}

export function BooksManagement({ books, setBooks }: BooksManagementProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [formData, setFormData] = useState<Partial<Book>>({
    title: '',
    author: '',
    isbn: '',
    genre: '',
    quantity: 1,
    available: 1,
    publishDate: '',
    coverUrl: ''
  });

  const filteredBooks = books.filter(book =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.isbn.includes(searchTerm)
  );

  const handleOpenDialog = (book?: Book) => {
    if (book) {
      setEditingBook(book);
      setFormData(book);
    } else {
      setEditingBook(null);
      setFormData({
        title: '',
        author: '',
        isbn: '',
        genre: '',
        quantity: 1,
        available: 1,
        publishDate: '',
        coverUrl: ''
      });
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingBook(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingBook) {
      // Update existing book
      setBooks(prev => prev.map(book => 
        book.id === editingBook.id ? { ...book, ...formData } as Book : book
      ));
      toast.success('Book updated successfully');
    } else {
      // Add new book
      const newBook: Book = {
        id: `book-${Date.now()}`,
        title: formData.title || '',
        author: formData.author || '',
        isbn: formData.isbn || '',
        genre: formData.genre || '',
        quantity: formData.quantity || 1,
        available: formData.available || formData.quantity || 1,
        publishDate: formData.publishDate || '',
        coverUrl: formData.coverUrl || 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300'
      };
      setBooks(prev => [...prev, newBook]);
      toast.success('Book added successfully');
    }
    
    handleCloseDialog();
  };

  const handleDelete = (bookId: string) => {
    const book = books.find(b => b.id === bookId);
    if (book && confirm(`Are you sure you want to delete "${book.title}"?`)) {
      setBooks(prev => prev.filter(b => b.id !== bookId));
      toast.success('Book deleted successfully');
    }
  };

  return (
    <Card className="bg-[#1A1A1A] border-[#333333] shadow-purple-md">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-white">Books Management</CardTitle>
            <CardDescription className="text-[#BFBFBF]">Manage library book collection</CardDescription>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                onClick={() => handleOpenDialog()} 
                className="bg-[#4B0082] hover:bg-[#3A0066] text-white border-0 shadow-purple-sm button-press"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Book
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white">
              <DialogHeader>
                <DialogTitle className="text-[#000000]">{editingBook ? 'Edit Book' : 'Add New Book'}</DialogTitle>
                <DialogDescription className="text-[#666666]">
                  {editingBook ? 'Update the book details' : 'Add a new book to the library collection'}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title" className="text-[#000000]">Title *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      className="bg-white border-[#BFBFBF] focus:border-[#4B0082] focus:ring-[#4B0082] text-[#000000]"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="author" className="text-[#000000]">Author *</Label>
                    <Input
                      id="author"
                      value={formData.author}
                      onChange={(e) => setFormData(prev => ({ ...prev, author: e.target.value }))}
                      className="bg-white border-[#BFBFBF] focus:border-[#4B0082] focus:ring-[#4B0082] text-[#000000]"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="isbn" className="text-[#000000]">ISBN *</Label>
                    <Input
                      id="isbn"
                      value={formData.isbn}
                      onChange={(e) => setFormData(prev => ({ ...prev, isbn: e.target.value }))}
                      className="bg-white border-[#BFBFBF] focus:border-[#4B0082] focus:ring-[#4B0082] text-[#000000]"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="genre" className="text-[#000000]">Genre *</Label>
                    <Input
                      id="genre"
                      value={formData.genre}
                      onChange={(e) => setFormData(prev => ({ ...prev, genre: e.target.value }))}
                      className="bg-white border-[#BFBFBF] focus:border-[#4B0082] focus:ring-[#4B0082] text-[#000000]"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="quantity" className="text-[#000000]">Total Quantity *</Label>
                    <Input
                      id="quantity"
                      type="number"
                      min="1"
                      value={formData.quantity}
                      onChange={(e) => setFormData(prev => ({ ...prev, quantity: parseInt(e.target.value) }))}
                      className="bg-white border-[#BFBFBF] focus:border-[#4B0082] focus:ring-[#4B0082] text-[#000000]"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="available" className="text-[#000000]">Available Copies *</Label>
                    <Input
                      id="available"
                      type="number"
                      min="0"
                      max={formData.quantity}
                      value={formData.available}
                      onChange={(e) => setFormData(prev => ({ ...prev, available: parseInt(e.target.value) }))}
                      className="bg-white border-[#BFBFBF] focus:border-[#4B0082] focus:ring-[#4B0082] text-[#000000]"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="publishDate" className="text-[#000000]">Publish Date</Label>
                    <Input
                      id="publishDate"
                      type="date"
                      value={formData.publishDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, publishDate: e.target.value }))}
                      className="bg-white border-[#BFBFBF] focus:border-[#4B0082] focus:ring-[#4B0082] text-[#000000]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="coverUrl" className="text-[#000000]">Cover Image URL</Label>
                    <Input
                      id="coverUrl"
                      type="url"
                      placeholder="https://..."
                      value={formData.coverUrl}
                      onChange={(e) => setFormData(prev => ({ ...prev, coverUrl: e.target.value }))}
                      className="bg-white border-[#BFBFBF] focus:border-[#4B0082] focus:ring-[#4B0082] text-[#000000] placeholder:text-[#808080]"
                    />
                  </div>
                </div>
                <div className="flex gap-2 justify-end pt-4">
                  <Button type="button" variant="outline" onClick={handleCloseDialog} className="border-[#BFBFBF] text-[#666666] hover:bg-[#F2F2F2]">
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-[#4B0082] hover:bg-[#3A0066] text-white border-0 button-press">
                    {editingBook ? 'Update Book' : 'Add Book'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#808080]" />
          <Input
            placeholder="Search books by title, author, or ISBN..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-[#262626] border-[#333333] text-white placeholder:text-[#808080] focus:border-[#4B0082] focus:ring-[#4B0082]"
          />
        </div>

        {/* Books Table */}
        <div className="border border-[#333333] rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-[#262626] hover:bg-[#262626] border-[#333333]">
                <TableHead className="text-[#BFBFBF]">Title</TableHead>
                <TableHead className="text-[#BFBFBF]">Author</TableHead>
                <TableHead className="text-[#BFBFBF]">ISBN</TableHead>
                <TableHead className="text-[#BFBFBF]">Genre</TableHead>
                <TableHead className="text-[#BFBFBF] text-center">Quantity</TableHead>
                <TableHead className="text-[#BFBFBF] text-center">Available</TableHead>
                <TableHead className="text-[#BFBFBF] text-center">Status</TableHead>
                <TableHead className="text-[#BFBFBF] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBooks.map(book => (
                <TableRow key={book.id} className="border-[#333333] hover:bg-[#262626] transition-colors">
                  <TableCell className="text-white">{book.title}</TableCell>
                  <TableCell className="text-[#BFBFBF]">{book.author}</TableCell>
                  <TableCell className="text-[#808080]">{book.isbn}</TableCell>
                  <TableCell>
                    <Badge className="bg-[#4B0082] text-white border-0">{book.genre}</Badge>
                  </TableCell>
                  <TableCell className="text-center text-[#BFBFBF]">{book.quantity}</TableCell>
                  <TableCell className="text-center text-[#BFBFBF]">{book.available}</TableCell>
                  <TableCell className="text-center">
                    {book.available > 0 ? (
                      <Badge className="bg-[#7A3BA3] hover:bg-[#6B577C] text-white border-0">Available</Badge>
                    ) : (
                      <Badge variant="destructive">Borrowed</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleOpenDialog(book)}
                        className="border-[#4B0082] text-[#4B0082] hover:bg-[#4B0082] hover:text-white transition-smooth"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(book.id)}
                        className="bg-red-600 hover:bg-red-700 border-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {filteredBooks.length === 0 && (
          <div className="text-center py-8 text-[#808080]">
            No books found matching your search criteria
          </div>
        )}
      </CardContent>
    </Card>
  );
}