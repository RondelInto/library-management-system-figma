import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Star } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { ScrollArea } from '../ui/scroll-area';

export interface BookReview {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  review: string;
  date: string;
}

interface BookReviewRatingProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bookTitle: string;
  bookId: string;
  currentUserReview?: BookReview;
  allReviews: BookReview[];
  averageRating: number;
  onSubmitReview: (rating: number, review: string) => void;
}

export function BookReviewRating({
  open,
  onOpenChange,
  bookTitle,
  currentUserReview,
  allReviews,
  averageRating,
  onSubmitReview
}: BookReviewRatingProps) {
  const [rating, setRating] = useState(currentUserReview?.rating || 0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [review, setReview] = useState(currentUserReview?.review || '');

  const handleSubmit = () => {
    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }

    onSubmitReview(rating, review);
    onOpenChange(false);
    toast.success('Review submitted successfully');
  };

  const renderStars = (count: number, interactive: boolean = false) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            disabled={!interactive}
            onMouseEnter={() => interactive && setHoveredRating(star)}
            onMouseLeave={() => interactive && setHoveredRating(0)}
            onClick={() => interactive && setRating(star)}
            className={`${interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'} transition-all`}
          >
            <Star
              className={`w-6 h-6 ${
                star <= (interactive ? (hoveredRating || rating) : count)
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-gray-300'
              }`}
            />
          </button>
        ))}
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Reviews & Ratings</DialogTitle>
          <DialogDescription>{bookTitle}</DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[70vh]">
          <div className="space-y-6 pr-4">
            {/* Average Rating Display */}
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-6 rounded-lg text-center">
              <div className="text-4xl mb-2">{averageRating.toFixed(1)}</div>
              {renderStars(Math.round(averageRating))}
              <p className="text-sm text-gray-600 mt-2">
                Based on {allReviews.length} {allReviews.length === 1 ? 'review' : 'reviews'}
              </p>
            </div>

            <Separator />

            {/* Your Review Section */}
            <div className="space-y-4">
              <h3 className="text-lg">Your Review</h3>
              
              <div className="space-y-2">
                <Label>Rating *</Label>
                <div className="flex gap-2 items-center">
                  {renderStars(rating, true)}
                  {rating > 0 && (
                    <span className="text-sm text-gray-600 ml-2">
                      {rating === 1 && 'Poor'}
                      {rating === 2 && 'Fair'}
                      {rating === 3 && 'Good'}
                      {rating === 4 && 'Very Good'}
                      {rating === 5 && 'Excellent'}
                    </span>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Review (optional)</Label>
                <textarea
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                  placeholder="Share your thoughts about this book..."
                  className="w-full min-h-[120px] px-3 py-2 border rounded-md resize-none"
                />
              </div>

              <Button onClick={handleSubmit} className="w-full">
                {currentUserReview ? 'Update Review' : 'Submit Review'}
              </Button>
            </div>

            {allReviews.length > 0 && (
              <>
                <Separator />

                {/* All Reviews */}
                <div className="space-y-4">
                  <h3 className="text-lg">Community Reviews</h3>
                  {allReviews.map((rev) => (
                    <div key={rev.id} className="p-4 bg-gray-50 rounded-lg space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white text-sm">
                            {rev.userName.charAt(0).toUpperCase()}
                          </div>
                          <span className="text-sm">{rev.userName}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {renderStars(rev.rating)}
                          <span className="text-xs text-gray-500">
                            {new Date(rev.date).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      {rev.review && (
                        <p className="text-sm text-gray-700 leading-relaxed">{rev.review}</p>
                      )}
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
