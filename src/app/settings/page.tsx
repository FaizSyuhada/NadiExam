"use client";

import { Header } from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAppStore } from "@/lib/store";
import { Globe, Bell, Database, Save, Trash2, Upload } from "lucide-react";

export default function SettingsPage() {
  const { generalSettings, setGeneralSettings, resetToDemo, addActivity } =
    useAppStore();

  const handleSaveSettings = () => {
    addActivity({
      type: "upload",
      title: "Settings saved",
      description: "General settings have been updated",
    });
  };

  const handleClearData = () => {
    if (
      confirm(
        "Are you sure you want to clear all data? This action cannot be undone."
      )
    ) {
      resetToDemo();
      addActivity({
        type: "upload",
        title: "Data cleared",
        description: "All data has been reset to defaults",
      });
    }
  };

  const handleImportStudents = () => {
    // Trigger file input
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".csv,.xlsx";
    input.onchange = () => {
      addActivity({
        type: "upload",
        title: "Data uploaded",
        description: "Student data imported successfully",
      });
    };
    input.click();
  };

  const handleImportRooms = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".csv,.xlsx";
    input.onchange = () => {
      addActivity({
        type: "upload",
        title: "Data uploaded",
        description: "Room data imported successfully",
      });
    };
    input.click();
  };

  return (
    <div className="min-h-screen">
      <Header title="Settings" />

      <div className="mx-auto max-w-2xl p-6">
        {/* General Settings */}
        <Card className="mb-6 bg-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Globe className="h-5 w-5" />
              General Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="academicYear">Academic Year</Label>
              <Input
                id="academicYear"
                value={generalSettings.academicYear}
                onChange={(e) =>
                  setGeneralSettings({
                    ...generalSettings,
                    academicYear: e.target.value,
                  })
                }
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="semester">Semester</Label>
              <Select
                value={generalSettings.semester}
                onValueChange={(value) =>
                  setGeneralSettings({ ...generalSettings, semester: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Fall">Fall</SelectItem>
                  <SelectItem value="Spring">Spring</SelectItem>
                  <SelectItem value="Summer">Summer</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="institution">Institution Name</Label>
              <Input
                id="institution"
                value={generalSettings.institutionName}
                onChange={(e) =>
                  setGeneralSettings({
                    ...generalSettings,
                    institutionName: e.target.value,
                  })
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card className="mb-6 bg-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Bell className="h-5 w-5" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="font-medium">
                  Email notifications for schedule changes
                </Label>
              </div>
              <Switch
                checked={generalSettings.emailNotifications}
                onCheckedChange={(checked) =>
                  setGeneralSettings({
                    ...generalSettings,
                    emailNotifications: checked,
                  })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="font-medium">Conflict detection alerts</Label>
              </div>
              <Switch
                checked={generalSettings.conflictAlerts}
                onCheckedChange={(checked) =>
                  setGeneralSettings({
                    ...generalSettings,
                    conflictAlerts: checked,
                  })
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Data Management */}
        <Card className="mb-6 bg-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Database className="h-5 w-5" />
              Data Management
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <button
              onClick={handleImportStudents}
              className="flex w-full items-center justify-between rounded-lg border p-4 text-left hover:bg-gray-50"
            >
              <div className="flex items-center gap-3">
                <Upload className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="font-medium">Import Student Data</p>
                  <p className="text-sm text-gray-500">Upload CSV or Excel file</p>
                </div>
              </div>
            </button>

            <button
              onClick={handleImportRooms}
              className="flex w-full items-center justify-between rounded-lg border p-4 text-left hover:bg-gray-50"
            >
              <div className="flex items-center gap-3">
                <Upload className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="font-medium">Import Room Data</p>
                  <p className="text-sm text-gray-500">Upload CSV or Excel file</p>
                </div>
              </div>
            </button>

            <button
              onClick={handleClearData}
              className="flex w-full items-center justify-between rounded-lg border border-red-200 bg-red-50 p-4 text-left hover:bg-red-100"
            >
              <div className="flex items-center gap-3">
                <Trash2 className="h-5 w-5 text-red-500" />
                <div>
                  <p className="font-medium text-red-700">Clear All Data</p>
                  <p className="text-sm text-red-600">This action cannot be undone</p>
                </div>
              </div>
            </button>
          </CardContent>
        </Card>

        {/* Save Button */}
        <Button onClick={handleSaveSettings} className="w-full">
          <Save className="mr-2 h-4 w-4" />
          Save Settings
        </Button>
      </div>
    </div>
  );
}
