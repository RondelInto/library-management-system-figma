import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Plus, Search, Loader2, BookOpen } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { ScrollArea } from '../ui/scroll-area';

interface BookResult {
  title: string;
  author: string;
  isbn: string;
  genre: string;
  publishDate: string;
  coverUrl: string;
  description: string;
  publisher: string;
}

interface AddBookDialogProps {
  onAddBook: (book: BookResult & { customTags?: string[] }) => void;
}

export function AddBookDialog({ onAddBook }: AddBookDialogProps) {
  const [open, setOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<BookResult[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Manual entry fields
  const [manualTitle, setManualTitle] = useState('');
  const [manualAuthor, setManualAuthor] = useState('');
  const [manualISBN, setManualISBN] = useState('');
  const [manualGenre, setManualGenre] = useState('');
  const [manualPublisher, setManualPublisher] = useState('');
  const [manualYear, setManualYear] = useState('');
  const [manualCover, setManualCover] = useState('');
  const [manualDescription, setManualDescription] = useState('');

  // Simulated API search (in production, replace with real API)
  const searchBooks = async () => {
    setIsSearching(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock results based on search query
    const mockResults: BookResult[] = [
      {
        title: `The Great ${searchQuery}`,
        author: 'F. Scott Fitzgerald',
        isbn: '978-0743273565',
        genre: 'Classic Fiction',
        publishDate: '1925-04-10',
        coverUrl: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400',
        description: 'A classic American novel set in the Jazz Age on Long Island.',
        publisher: 'Scribner'
      },
      {
        title: `${searchQuery} and the Art of Living`,
        author: 'Jane Austen',
        isbn: '978-0141439518',
        genre: 'Romance',
        publishDate: '1813-01-28',
        coverUrl: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400',
        description: 'A romantic novel of manners written in the early 19th century.',
        publisher: 'Penguin Classics'
      },
      {
        title: `Understanding ${searchQuery}`,
        author: 'George Orwell',
        isbn: '978-0451524935',
        genre: 'Dystopian Fiction',
        publishDate: '1949-06-08',
        coverUrl: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400',
        description: 'A dystopian social science fiction novel and cautionary tale.',
        publisher: 'Signet Classic'
      }
    ];
    
    setSearchResults(mockResults);
    setIsSearching(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      searchBooks();
    }
  };

  const handleSelectBook = (book: BookResult) => {
    onAddBook(book);
    setOpen(false);
    setSearchQuery('');
    setSearchResults([]);
    toast.success(`Added "${book.title}" to your library`);
  };

  const handleManualAdd = () => {
    if (!manualTitle || !manualAuthor) {
      toast.error('Please fill in at least Title and Author');
      return;
    }

    const newBook: BookResult = {
      title: manualTitle,
      author: manualAuthor,
      isbn: manualISBN || `MANUAL-${Date.now()}`,
      genre: manualGenre || 'Uncategorized',
      publishDate: manualYear ? `${manualYear}-01-01` : new Date().toISOString().split('T')[0],
      coverUrl: manualCover || 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=400',
      description: manualDescription || 'No description available.',
      publisher: manualPublisher || 'Unknown'
    };

    onAddBook(newBook);
    setOpen(false);
    
    // Reset form
    setManualTitle('');
    setManualAuthor('');
    setManualISBN('');
    setManualGenre('');
    setManualPublisher('');
    setManualYear('');
    setManualCover('');
    setManualDescription('');
    
    toast.success(`Added "${newBook.title}" to your library`);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-indigo-600 hover:bg-indigo-700">
          <Plus className="w-4 h-4 mr-2" />
          Add Book
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Add Book to Library</DialogTitle>
          <DialogDescription>
            Search for books using ISBN, title, or author, or add manually
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="search" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="search">Search Online</TabsTrigger>
            <TabsTrigger value="manual">Manual Entry</TabsTrigger>
          </TabsList>

          <TabsContent value="search" className="space-y-4">
            <form onSubmit={handleSearch} className="flex gap-2">
              <Input
                placeholder="Enter ISBN, title, or author..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1"
              />
              <Button type="submit" disabled={isSearching}>
                {isSearching ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Search className="w-4 h-4" />
                )}
                Search
              </Button>
            </form>

            <ScrollArea className="h-[400px]">
              {searchResults.length > 0 ? (
                <div className="space-y-3">
                  {searchResults.map((book, index) => (
                    <Card key={index} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex gap-4">
                          <div className="w-20 aspect-[2/3] bg-gray-100 rounded overflow-hidden flex-shrink-0">
                            <ImageWithFallback
                              src={book.coverUrl}
                              alt={book.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="line-clamp-1">{book.title}</h4>
                            <p className="text-sm text-gray-600 mt-1">{book.author}</p>
                            <div className="flex gap-2 mt-2 flex-wrap">
                              <Badge variant="secondary">{book.genre}</Badge>
                              <Badge variant="outline">{book.isbn}</Badge>
                            </div>
                            <p className="text-xs text-gray-500 mt-2 line-clamp-2">{book.description}</p>
                          </div>
                          <Button onClick={() => handleSelectBook(book)}>
                            Add to Library
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <BookOpen className="w-16 h-16 text-gray-300 mb-3" />
                  <p className="text-gray-500">Search for books to add to your library</p>
                  <p className="text-sm text-gray-400 mt-1">Try searching by ISBN, title, or author</p>
                </div>
              )}
            </ScrollArea>
          </TabsContent>

          <TabsContent value="manual" className="space-y-4">
            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title *</Label>
                    <Input
                      id="title"
                      value={manualTitle}
                      onChange={(e) => setManualTitle(e.target.value)}
                      placeholder="Enter book title"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="author">Author *</Label>
                    <Input
                      id="author"
                      value={manualAuthor}
                      onChange={(e) => setManualAuthor(e.target.value)}
                      placeholder="Enter author name"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="isbn">ISBN</Label>
                    <Input
                      id="isbn"
                      value={manualISBN}
                      onChange={(e) => setManualISBN(e.target.value)}
                      placeholder="978-0000000000"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="genre">Genre</Label>
                    <Input
                      id="genre"
                      value={manualGenre}
                      onChange={(e) => setManualGenre(e.target.value)}
                      placeholder="e.g., Fiction, Mystery"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="publisher">Publisher</Label>
                    <Input
                      id="publisher"
                      value={manualPublisher}
                      onChange={(e) => setManualPublisher(e.target.value)}
                      placeholder="Publisher name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="year">Publication Year</Label>
                    <Input
                      id="year"
                      type="number"
                      value={manualYear}
                      onChange={(e) => setManualYear(e.target.value)}
                      placeholder="2024"
                      min="1000"
                      max={new Date().getFullYear()}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cover">Cover Image URL</Label>
                  <Input
                    id="cover"
                    value={manualCover}
                    onChange={(e) => setManualCover(e.target.value)}
                    placeholder="https://example.com/cover.jpg"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <textarea
                    id="description"
                    value={manualDescription}
                    onChange={(e) => setManualDescription(e.target.value)}
                    placeholder="Enter book description..."
                    className="w-full min-h-[100px] px-3 py-2 border rounded-md resize-none"
                  />
                </div>

                <Button onClick={handleManualAdd} className="w-full">
                  Add Book to Library
                </Button>
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
