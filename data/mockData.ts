import { Book, BorrowedBook } from '../App';

export const mockBooks: Book[] = [
  {
    id: '1',
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    isbn: '978-0-06-112008-4',
    genre: 'Fiction',
    quantity: 5,
    available: 3,
    publishDate: '1960-07-11',
    coverUrl: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300'
  },
  {
    id: '2',
    title: '1984',
    author: 'George Orwell',
    isbn: '978-0-452-28423-4',
    genre: 'Science Fiction',
    quantity: 4,
    available: 2,
    publishDate: '1949-06-08',
    coverUrl: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=300'
  },
  {
    id: '3',
    title: 'Pride and Prejudice',
    author: 'Jane Austen',
    isbn: '978-0-14-143951-8',
    genre: 'Romance',
    quantity: 6,
    available: 4,
    publishDate: '1813-01-28',
    coverUrl: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=300'
  },
  {
    id: '4',
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    isbn: '978-0-7432-7356-5',
    genre: 'Fiction',
    quantity: 3,
    available: 1,
    publishDate: '1925-04-10',
    coverUrl: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=300'
  },
  {
    id: '5',
    title: 'The Hobbit',
    author: 'J.R.R. Tolkien',
    isbn: '978-0-547-92822-7',
    genre: 'Fantasy',
    quantity: 7,
    available: 5,
    publishDate: '1937-09-21',
    coverUrl: 'https://images.unsplash.com/photo-1589998059171-988d887df646?w=300'
  },
  {
    id: '6',
    title: 'Harry Potter and the Philosopher\'s Stone',
    author: 'J.K. Rowling',
    isbn: '978-0-439-70818-8',
    genre: 'Fantasy',
    quantity: 8,
    available: 0,
    publishDate: '1997-06-26',
    coverUrl: 'https://images.unsplash.com/photo-1621351183012-e2f9972dd9bf?w=300'
  },
  {
    id: '7',
    title: 'The Catcher in the Rye',
    author: 'J.D. Salinger',
    isbn: '978-0-316-76948-0',
    genre: 'Fiction',
    quantity: 4,
    available: 3,
    publishDate: '1951-07-16',
    coverUrl: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=300'
  },
  {
    id: '8',
    title: 'The Lord of the Rings',
    author: 'J.R.R. Tolkien',
    isbn: '978-0-618-64561-1',
    genre: 'Fantasy',
    quantity: 5,
    available: 2,
    publishDate: '1954-07-29',
    coverUrl: 'https://images.unsplash.com/photo-1541963463532-d68292c34b19?w=300'
  },
  {
    id: '9',
    title: 'The Alchemist',
    author: 'Paulo Coelho',
    isbn: '978-0-06-112241-5',
    genre: 'Fiction',
    quantity: 6,
    available: 4,
    publishDate: '1988-01-01',
    coverUrl: 'https://images.unsplash.com/photo-1509021436665-8f07dbf5bf1d?w=300'
  },
  {
    id: '10',
    title: 'Sapiens: A Brief History of Humankind',
    author: 'Yuval Noah Harari',
    isbn: '978-0-06-231609-7',
    genre: 'Non-Fiction',
    quantity: 5,
    available: 3,
    publishDate: '2011-01-01',
    coverUrl: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=300'
  }
];

export const mockBorrowedBooks: BorrowedBook[] = [
  {
    id: 'b1',
    bookId: '1',
    userId: '2',
    borrowDate: '2025-11-01',
    dueDate: '2025-11-29',
  },
  {
    id: 'b2',
    bookId: '2',
    userId: '2',
    borrowDate: '2025-11-05',
    dueDate: '2025-12-03',
  },
  {
    id: 'b3',
    bookId: '4',
    userId: '3',
    borrowDate: '2025-11-10',
    dueDate: '2025-12-08',
  },
  {
    id: 'b4',
    bookId: '6',
    userId: '2',
    borrowDate: '2025-10-15',
    dueDate: '2025-11-12',
  },
];
