import { useState } from 'react';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '../ui/sheet';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { Folder, Plus, X, Edit2, Check } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

export interface Category {
  id: string;
  name: string;
  color: string;
  bookCount: number;
}

interface CustomCategoriesProps {
  categories: Category[];
  onAddCategory: (name: string, color: string) => void;
  onDeleteCategory: (id: string) => void;
  onEditCategory: (id: string, name: string, color: string) => void;
}

const PRESET_COLORS = [
  '#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#6366F1', 
  '#8B5CF6', '#EC4899', '#14B8A6', '#F97316', '#84CC16'
];

export function CustomCategories({ categories, onAddCategory, onDeleteCategory, onEditCategory }: CustomCategoriesProps) {
  const [open, setOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [selectedColor, setSelectedColor] = useState(PRESET_COLORS[0]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editColor, setEditColor] = useState('');

  const handleAdd = () => {
    if (!newCategoryName.trim()) {
      toast.error('Please enter a category name');
      return;
    }

    onAddCategory(newCategoryName.trim(), selectedColor);
    setNewCategoryName('');
    setSelectedColor(PRESET_COLORS[0]);
    toast.success('Category created');
  };

  const startEdit = (category: Category) => {
    setEditingId(category.id);
    setEditName(category.name);
    setEditColor(category.color);
  };

  const handleEdit = () => {
    if (editingId && editName.trim()) {
      onEditCategory(editingId, editName.trim(), editColor);
      setEditingId(null);
      toast.success('Category updated');
    }
  };

  const handleDelete = (id: string) => {
    onDeleteCategory(id);
    toast.success('Category deleted');
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm">
          <Folder className="w-4 h-4 mr-2" />
          Categories ({categories.length})
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Custom Categories</SheetTitle>
          <SheetDescription>
            Organize your library with custom categories
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6 mt-6">
          {/* Add New Category */}
          <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
            <Label>Create New Category</Label>
            <Input
              placeholder="Category name..."
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
            />
            <div className="space-y-2">
              <Label className="text-xs">Color</Label>
              <div className="flex gap-2 flex-wrap">
                {PRESET_COLORS.map(color => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`w-8 h-8 rounded-full border-2 transition-all ${
                      selectedColor === color ? 'border-gray-900 scale-110' : 'border-gray-300'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
            <Button onClick={handleAdd} className="w-full" size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add Category
            </Button>
          </div>

          {/* Categories List */}
          <div className="space-y-2">
            <Label>Your Categories</Label>
            {categories.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-8">
                No custom categories yet
              </p>
            ) : (
              <div className="space-y-2">
                {categories.map(category => (
                  <div key={category.id} className="flex items-center gap-2 p-3 bg-white border rounded-lg">
                    {editingId === category.id ? (
                      <>
                        <div
                          className="w-4 h-4 rounded-full flex-shrink-0"
                          style={{ backgroundColor: editColor }}
                        />
                        <Input
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="flex-1 h-8"
                          autoFocus
                        />
                        <div className="flex gap-2">
                          {PRESET_COLORS.slice(0, 5).map(color => (
                            <button
                              key={color}
                              onClick={() => setEditColor(color)}
                              className={`w-6 h-6 rounded-full border ${
                                editColor === color ? 'border-gray-900' : 'border-gray-300'
                              }`}
                              style={{ backgroundColor: color }}
                            />
                          ))}
                        </div>
                        <Button size="sm" onClick={handleEdit} variant="ghost">
                          <Check className="w-4 h-4" />
                        </Button>
                        <Button size="sm" onClick={() => setEditingId(null)} variant="ghost">
                          <X className="w-4 h-4" />
                        </Button>
                      </>
                    ) : (
                      <>
                        <div
                          className="w-4 h-4 rounded-full flex-shrink-0"
                          style={{ backgroundColor: category.color }}
                        />
                        <span className="flex-1 text-sm">{category.name}</span>
                        <Badge variant="secondary" className="text-xs">
                          {category.bookCount}
                        </Badge>
                        <Button size="sm" onClick={() => startEdit(category)} variant="ghost">
                          <Edit2 className="w-3 h-3" />
                        </Button>
                        <Button 
                          size="sm" 
                          onClick={() => handleDelete(category.id)} 
                          variant="ghost"
                          className="hover:text-red-600"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
