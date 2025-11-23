import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Slider } from '../ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import { BookOpen, CheckCircle2, Clock, PlayCircle } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner@2.0.3';

export type ReadingStatus = 'not-started' | 'reading' | 'completed' | 'on-hold';

export interface ReadingProgressData {
  bookId: string;
  status: ReadingStatus;
  progress: number; // 0-100
  currentPage?: number;
  totalPages?: number;
  startDate?: string;
  finishDate?: string;
  notes?: string;
}

interface ReadingProgressProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bookTitle: string;
  currentProgress?: ReadingProgressData;
  onSave: (progress: ReadingProgressData) => void;
}

export function ReadingProgress({ 
  open, 
  onOpenChange, 
  bookTitle, 
  currentProgress,
  onSave 
}: ReadingProgressProps) {
  const [status, setStatus] = useState<ReadingStatus>(currentProgress?.status || 'not-started');
  const [progress, setProgress] = useState(currentProgress?.progress || 0);
  const [currentPage, setCurrentPage] = useState(currentProgress?.currentPage || 0);
  const [totalPages, setTotalPages] = useState(currentProgress?.totalPages || 300);
  const [notes, setNotes] = useState(currentProgress?.notes || '');

  const handleSave = () => {
    const progressData: ReadingProgressData = {
      bookId: currentProgress?.bookId || '',
      status,
      progress,
      currentPage,
      totalPages,
      notes,
      startDate: currentProgress?.startDate || (status !== 'not-started' ? new Date().toISOString().split('T')[0] : undefined),
      finishDate: status === 'completed' ? new Date().toISOString().split('T')[0] : undefined
    };

    onSave(progressData);
    onOpenChange(false);
    toast.success('Reading progress updated');
  };

  const getStatusIcon = (s: ReadingStatus) => {
    switch (s) {
      case 'reading': return <BookOpen className="w-4 h-4" />;
      case 'completed': return <CheckCircle2 className="w-4 h-4" />;
      case 'on-hold': return <Clock className="w-4 h-4" />;
      default: return <PlayCircle className="w-4 h-4" />;
    }
  };

  const getStatusColor = (s: ReadingStatus) => {
    switch (s) {
      case 'reading': return 'bg-blue-600';
      case 'completed': return 'bg-green-600';
      case 'on-hold': return 'bg-amber-600';
      default: return 'bg-gray-600';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Reading Progress</DialogTitle>
          <DialogDescription>{bookTitle}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Status Selection */}
          <div className="space-y-3">
            <Label>Reading Status</Label>
            <div className="grid grid-cols-2 gap-2">
              {(['not-started', 'reading', 'completed', 'on-hold'] as ReadingStatus[]).map(s => (
                <button
                  key={s}
                  onClick={() => {
                    setStatus(s);
                    if (s === 'completed') setProgress(100);
                    if (s === 'not-started') setProgress(0);
                  }}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    status === s 
                      ? 'border-indigo-600 bg-indigo-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-full ${getStatusColor(s)} flex items-center justify-center text-white`}>
                      {getStatusIcon(s)}
                    </div>
                    <span className="text-sm capitalize">{s.replace('-', ' ')}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Progress Bar */}
          {status !== 'not-started' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Progress</Label>
                <Badge className={getStatusColor(status)}>{progress}%</Badge>
              </div>
              <Slider
                value={[progress]}
                onValueChange={(value) => setProgress(value[0])}
                max={100}
                step={1}
                className="w-full"
                disabled={status === 'completed'}
              />
            </div>
          )}

          {/* Page Numbers */}
          {status !== 'not-started' && (
            <div className="space-y-3">
              <Label>Pages</Label>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs text-gray-500">Current Page</Label>
                  <input
                    type="number"
                    value={currentPage}
                    onChange={(e) => {
                      const page = parseInt(e.target.value) || 0;
                      setCurrentPage(page);
                      setProgress(Math.min(100, Math.round((page / totalPages) * 100)));
                    }}
                    className="w-full px-3 py-2 border rounded-md"
                    min="0"
                    max={totalPages}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs text-gray-500">Total Pages</Label>
                  <input
                    type="number"
                    value={totalPages}
                    onChange={(e) => {
                      const total = parseInt(e.target.value) || 300;
                      setTotalPages(total);
                      setProgress(Math.min(100, Math.round((currentPage / total) * 100)));
                    }}
                    className="w-full px-3 py-2 border rounded-md"
                    min="1"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Notes */}
          <div className="space-y-2">
            <Label>Notes (optional)</Label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add your thoughts, favorite quotes, or reminders..."
              className="w-full min-h-[80px] px-3 py-2 border rounded-md resize-none text-sm"
            />
          </div>

          <div className="flex gap-2">
            <Button onClick={handleSave} className="flex-1">
              Save Progress
            </Button>
            <Button onClick={() => onOpenChange(false)} variant="outline">
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
