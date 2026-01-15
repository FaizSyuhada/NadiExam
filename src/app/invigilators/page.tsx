"use client";

import { useState } from "react";
import { Header } from "@/components/layout/header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useAppStore } from "@/lib/store";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Invigilator } from "@/lib/types";

export default function InvigilatorsPage() {
  const { invigilators, addInvigilator, updateInvigilator, deleteInvigilator, addActivity } =
    useAppStore();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingInvigilator, setEditingInvigilator] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    availability: "Available" as Invigilator["availability"],
    maxLoad: 3,
  });

  const handleAddInvigilator = () => {
    const newInvigilator: Invigilator = {
      id: `inv-${Date.now()}`,
      name: formData.name,
      availability: formData.availability,
      dailyLoad: 0,
      maxLoad: formData.maxLoad,
    };
    addInvigilator(newInvigilator);
    addActivity({
      type: "invigilator",
      title: "Invigilator added",
      description: formData.name,
    });
    setFormData({ name: "", availability: "Available", maxLoad: 3 });
    setIsAddDialogOpen(false);
  };

  const handleEditInvigilator = () => {
    if (editingInvigilator) {
      updateInvigilator(editingInvigilator, {
        name: formData.name,
        availability: formData.availability,
        maxLoad: formData.maxLoad,
      });
      addActivity({
        type: "invigilator",
        title: "Invigilator updated",
        description: formData.name,
      });
      setFormData({ name: "", availability: "Available", maxLoad: 3 });
      setEditingInvigilator(null);
      setIsEditDialogOpen(false);
    }
  };

  const handleDeleteInvigilator = (id: string) => {
    const invigilator = invigilators.find((i) => i.id === id);
    if (invigilator && confirm(`Are you sure you want to delete ${invigilator.name}?`)) {
      deleteInvigilator(id);
      addActivity({
        type: "invigilator",
        title: "Invigilator deleted",
        description: invigilator.name,
      });
    }
  };

  const openEditDialog = (invigilatorId: string) => {
    const invigilator = invigilators.find((i) => i.id === invigilatorId);
    if (invigilator) {
      setFormData({
        name: invigilator.name,
        availability: invigilator.availability,
        maxLoad: invigilator.maxLoad,
      });
      setEditingInvigilator(invigilatorId);
      setIsEditDialogOpen(true);
    }
  };

  const getAvailabilityBadge = (availability: Invigilator["availability"]) => {
    switch (availability) {
      case "Available":
        return <Badge variant="success">Available</Badge>;
      case "Limited":
        return <Badge variant="warning">Limited</Badge>;
      case "Unavailable":
        return <Badge variant="destructive">Unavailable</Badge>;
    }
  };

  return (
    <div className="min-h-screen">
      <Header title="Invigilators" />

      <div className="p-6">
        {/* Add Button */}
        <div className="mb-6 flex justify-end">
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Invigilator
          </Button>
        </div>

        {/* Invigilators Table */}
        <Card className="bg-white">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>NAME</TableHead>
                  <TableHead>AVAILABILITY</TableHead>
                  <TableHead>DAILY LOAD</TableHead>
                  <TableHead>MAX LOAD</TableHead>
                  <TableHead className="text-right">ACTIONS</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invigilators.map((invigilator) => (
                  <TableRow key={invigilator.id}>
                    <TableCell className="font-medium">
                      {invigilator.name}
                    </TableCell>
                    <TableCell>
                      {getAvailabilityBadge(invigilator.availability)}
                    </TableCell>
                    <TableCell>{invigilator.dailyLoad}</TableCell>
                    <TableCell>{invigilator.maxLoad}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEditDialog(invigilator.id)}
                      >
                        <Pencil className="h-4 w-4 text-gray-500" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteInvigilator(invigilator.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Add Invigilator Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Invigilator</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="e.g., Dr. Sarah Ahmed"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="availability">Availability</Label>
              <Select
                value={formData.availability}
                onValueChange={(value: Invigilator["availability"]) =>
                  setFormData({ ...formData, availability: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Available">Available</SelectItem>
                  <SelectItem value="Limited">Limited</SelectItem>
                  <SelectItem value="Unavailable">Unavailable</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="maxLoad">Max Load (exams per day)</Label>
              <Input
                id="maxLoad"
                type="number"
                min={1}
                max={5}
                value={formData.maxLoad}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    maxLoad: parseInt(e.target.value),
                  })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddInvigilator}>Add Invigilator</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Invigilator Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Invigilator</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">Name</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-availability">Availability</Label>
              <Select
                value={formData.availability}
                onValueChange={(value: Invigilator["availability"]) =>
                  setFormData({ ...formData, availability: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Available">Available</SelectItem>
                  <SelectItem value="Limited">Limited</SelectItem>
                  <SelectItem value="Unavailable">Unavailable</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-maxLoad">Max Load (exams per day)</Label>
              <Input
                id="edit-maxLoad"
                type="number"
                min={1}
                max={5}
                value={formData.maxLoad}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    maxLoad: parseInt(e.target.value),
                  })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleEditInvigilator}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
