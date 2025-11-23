import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { BarChart3, BookOpen, CheckCircle2, Clock, TrendingUp, Award } from 'lucide-react';
import { ReadingProgressData } from './ReadingProgress';
import { ScrollArea } from '../ui/scroll-area';

interface ReadingStatsProps {
  readingProgress: ReadingProgressData[];
  totalBooks: number;
}

export function ReadingStats({ readingProgress, totalBooks }: ReadingStatsProps) {
  const completedBooks = readingProgress.filter(p => p.status === 'completed').length;
  const currentlyReading = readingProgress.filter(p => p.status === 'reading').length;
  const onHold = readingProgress.filter(p => p.status === 'on-hold').length;
  const averageProgress = readingProgress.length > 0
    ? Math.round(readingProgress.reduce((acc, p) => acc + p.progress, 0) / readingProgress.length)
    : 0;

  const booksThisMonth = readingProgress.filter(p => {
    if (!p.finishDate) return false;
    const date = new Date(p.finishDate);
    const now = new Date();
    return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
  }).length;

  const readingStreak = calculateStreak(readingProgress);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <BarChart3 className="w-4 h-4 mr-2" />
          Stats
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Your Reading Statistics</DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[70vh]">
          <div className="space-y-6 pr-4">
            {/* Overview Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                <CardContent className="p-4 text-center">
                  <BookOpen className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                  <div className="text-2xl">{totalBooks}</div>
                  <p className="text-xs text-gray-600 mt-1">Total Books</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                <CardContent className="p-4 text-center">
                  <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-green-600" />
                  <div className="text-2xl">{completedBooks}</div>
                  <p className="text-xs text-gray-600 mt-1">Completed</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
                <CardContent className="p-4 text-center">
                  <Clock className="w-8 h-8 mx-auto mb-2 text-amber-600" />
                  <div className="text-2xl">{currentlyReading}</div>
                  <p className="text-xs text-gray-600 mt-1">Reading</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                <CardContent className="p-4 text-center">
                  <TrendingUp className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                  <div className="text-2xl">{averageProgress}%</div>
                  <p className="text-xs text-gray-600 mt-1">Avg Progress</p>
                </CardContent>
              </Card>
            </div>

            {/* This Month & Streak */}
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                      <BookOpen className="w-6 h-6 text-indigo-600" />
                    </div>
                    <div>
                      <div className="text-2xl">{booksThisMonth}</div>
                      <p className="text-sm text-gray-600">Books This Month</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                      <Award className="w-6 h-6 text-orange-600" />
                    </div>
                    <div>
                      <div className="text-2xl">{readingStreak}</div>
                      <p className="text-sm text-gray-600">Day Streak 🔥</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Reading Activity */}
            <Card>
              <CardContent className="p-4 space-y-3">
                <h3 className="text-sm">Reading Activity</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Completed</span>
                    <div className="flex items-center gap-2">
                      <div className="w-48 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-600 h-2 rounded-full transition-all"
                          style={{ width: `${(completedBooks / totalBooks) * 100}%` }}
                        />
                      </div>
                      <Badge variant="secondary">{completedBooks}/{totalBooks}</Badge>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Reading</span>
                    <div className="flex items-center gap-2">
                      <div className="w-48 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-amber-600 h-2 rounded-full transition-all"
                          style={{ width: `${(currentlyReading / totalBooks) * 100}%` }}
                        />
                      </div>
                      <Badge variant="secondary">{currentlyReading}/{totalBooks}</Badge>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">On Hold</span>
                    <div className="flex items-center gap-2">
                      <div className="w-48 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all"
                          style={{ width: `${(onHold / totalBooks) * 100}%` }}
                        />
                      </div>
                      <Badge variant="secondary">{onHold}/{totalBooks}</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Achievements */}
            <Card>
              <CardContent className="p-4 space-y-3">
                <h3 className="text-sm">Achievements</h3>
                <div className="grid grid-cols-3 gap-3">
                  {completedBooks >= 1 && (
                    <div className="text-center p-3 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg border border-yellow-200">
                      <div className="text-3xl mb-1">📚</div>
                      <p className="text-xs">First Book</p>
                    </div>
                  )}
                  {completedBooks >= 5 && (
                    <div className="text-center p-3 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200">
                      <div className="text-3xl mb-1">⭐</div>
                      <p className="text-xs">5 Books</p>
                    </div>
                  )}
                  {completedBooks >= 10 && (
                    <div className="text-center p-3 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border border-purple-200">
                      <div className="text-3xl mb-1">🏆</div>
                      <p className="text-xs">10 Books!</p>
                    </div>
                  )}
                  {readingStreak >= 7 && (
                    <div className="text-center p-3 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg border border-orange-200">
                      <div className="text-3xl mb-1">🔥</div>
                      <p className="text-xs">Week Streak</p>
                    </div>
                  )}
                  {currentlyReading >= 3 && (
                    <div className="text-center p-3 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200">
                      <div className="text-3xl mb-1">📖</div>
                      <p className="text-xs">Multitasker</p>
                    </div>
                  )}
                  {averageProgress >= 50 && (
                    <div className="text-center p-3 bg-gradient-to-br from-pink-50 to-pink-100 rounded-lg border border-pink-200">
                      <div className="text-3xl mb-1">💪</div>
                      <p className="text-xs">Dedicated</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

function calculateStreak(progress: ReadingProgressData[]): number {
  const completedDates = progress
    .filter(p => p.finishDate)
    .map(p => new Date(p.finishDate!))
    .sort((a, b) => b.getTime() - a.getTime());

  if (completedDates.length === 0) return 0;

  let streak = 1;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 0; i < completedDates.length - 1; i++) {
    const current = new Date(completedDates[i]);
    const next = new Date(completedDates[i + 1]);
    current.setHours(0, 0, 0, 0);
    next.setHours(0, 0, 0, 0);

    const diffDays = Math.floor((current.getTime() - next.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 1) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}
