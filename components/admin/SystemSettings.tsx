import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Switch } from '../ui/switch';
import { Separator } from '../ui/separator';
import { Save, Clock, DollarSign, Bell, Shield } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

export function SystemSettings() {
  const [settings, setSettings] = useState({
    borrowPeriod: 28,
    maxBooksPerUser: 5,
    finePerDay: 0.50,
    autoRenew: false,
    emailNotifications: true,
    overdueReminders: true,
    reminderDaysBefore: 3,
    requireMFA: false,
    allowGuestBrowsing: true,
  });

  const handleSave = () => {
    // In a real app, this would save to backend
    toast.success('Settings saved successfully');
  };

  const updateSetting = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-6">
      {/* Library Policies */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-blue-400" />
            <div>
              <CardTitle className="text-white">Library Policies</CardTitle>
              <CardDescription className="text-slate-400">Configure borrowing rules and policies</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="borrowPeriod" className="text-slate-300">Default Borrow Period (days)</Label>
              <Input
                id="borrowPeriod"
                type="number"
                min="1"
                value={settings.borrowPeriod}
                onChange={(e) => updateSetting('borrowPeriod', parseInt(e.target.value))}
                className="bg-slate-900 border-slate-700 text-white"
              />
              <p className="text-xs text-slate-400">How long users can borrow books before they're due</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxBooks" className="text-slate-300">Maximum Books Per User</Label>
              <Input
                id="maxBooks"
                type="number"
                min="1"
                value={settings.maxBooksPerUser}
                onChange={(e) => updateSetting('maxBooksPerUser', parseInt(e.target.value))}
                className="bg-slate-900 border-slate-700 text-white"
              />
              <p className="text-xs text-slate-400">Maximum number of books a user can borrow at once</p>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-slate-900 rounded-lg">
            <div className="space-y-0.5">
              <Label htmlFor="autoRenew" className="text-slate-300">Auto-Renewal</Label>
              <p className="text-xs text-slate-400">Automatically renew books if no one is waiting</p>
            </div>
            <Switch
              id="autoRenew"
              checked={settings.autoRenew}
              onCheckedChange={(checked) => updateSetting('autoRenew', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Fine Settings */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <div className="flex items-center gap-3">
            <DollarSign className="w-5 h-5 text-green-400" />
            <div>
              <CardTitle className="text-white">Fine Settings</CardTitle>
              <CardDescription className="text-slate-400">Configure late return penalties</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="finePerDay" className="text-slate-300">Fine Per Day (USD)</Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                id="finePerDay"
                type="number"
                step="0.25"
                min="0"
                value={settings.finePerDay}
                onChange={(e) => updateSetting('finePerDay', parseFloat(e.target.value))}
                className="pl-10 bg-slate-900 border-slate-700 text-white"
              />
            </div>
            <p className="text-xs text-slate-400">Amount charged per day for overdue books</p>
          </div>

          <div className="p-4 bg-blue-950/50 border border-blue-900 rounded-lg">
            <p className="text-sm text-blue-300">
              Current fine calculation: ${settings.finePerDay} per day for each overdue book
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Bell className="w-5 h-5 text-yellow-400" />
            <div>
              <CardTitle className="text-white">Notification Settings</CardTitle>
              <CardDescription className="text-slate-400">Configure how users receive notifications</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-slate-900 rounded-lg">
            <div className="space-y-0.5">
              <Label htmlFor="emailNotifications" className="text-slate-300">Email Notifications</Label>
              <p className="text-xs text-slate-400">Send email notifications to users</p>
            </div>
            <Switch
              id="emailNotifications"
              checked={settings.emailNotifications}
              onCheckedChange={(checked) => updateSetting('emailNotifications', checked)}
            />
          </div>

          <div className="flex items-center justify-between p-4 bg-slate-900 rounded-lg">
            <div className="space-y-0.5">
              <Label htmlFor="overdueReminders" className="text-slate-300">Overdue Reminders</Label>
              <p className="text-xs text-slate-400">Send reminders for overdue books</p>
            </div>
            <Switch
              id="overdueReminders"
              checked={settings.overdueReminders}
              onCheckedChange={(checked) => updateSetting('overdueReminders', checked)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="reminderDays" className="text-slate-300">Send Reminder (days before due)</Label>
            <Input
              id="reminderDays"
              type="number"
              min="1"
              value={settings.reminderDaysBefore}
              onChange={(e) => updateSetting('reminderDaysBefore', parseInt(e.target.value))}
              className="bg-slate-900 border-slate-700 text-white"
            />
            <p className="text-xs text-slate-400">How many days before the due date to send a reminder</p>
          </div>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-purple-400" />
            <div>
              <CardTitle className="text-white">Security Settings</CardTitle>
              <CardDescription className="text-slate-400">Configure system security options</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-slate-900 rounded-lg">
            <div className="space-y-0.5">
              <Label htmlFor="requireMFA" className="text-slate-300">Require Multi-Factor Authentication</Label>
              <p className="text-xs text-slate-400">Require MFA for admin accounts</p>
            </div>
            <Switch
              id="requireMFA"
              checked={settings.requireMFA}
              onCheckedChange={(checked) => updateSetting('requireMFA', checked)}
            />
          </div>

          <div className="flex items-center justify-between p-4 bg-slate-900 rounded-lg">
            <div className="space-y-0.5">
              <Label htmlFor="guestBrowsing" className="text-slate-300">Allow Guest Browsing</Label>
              <p className="text-xs text-slate-400">Allow users to browse books without logging in</p>
            </div>
            <Switch
              id="guestBrowsing"
              checked={settings.allowGuestBrowsing}
              onCheckedChange={(checked) => updateSetting('allowGuestBrowsing', checked)}
            />
          </div>

          <div className="p-4 bg-yellow-950/50 border border-yellow-900 rounded-lg">
            <p className="text-sm text-yellow-300">
              Security Notice: Figma Make is not designed for collecting PII or securing sensitive data. 
              For production use, implement proper security measures and data protection.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} size="lg" className="bg-green-600 hover:bg-green-700">
          <Save className="w-4 h-4 mr-2" />
          Save Settings
        </Button>
      </div>
    </div>
  );
}
