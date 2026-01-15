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
import { Room } from "@/lib/types";

export default function RoomsPage() {
  const { rooms, addRoom, updateRoom, deleteRoom, addActivity } = useAppStore();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    capacity: 50,
    building: "",
    availability: "Available" as Room["availability"],
  });

  const handleAddRoom = () => {
    const newRoom: Room = {
      id: `room-${Date.now()}`,
      name: formData.name,
      capacity: formData.capacity,
      building: formData.building,
      availability: formData.availability,
    };
    addRoom(newRoom);
    addActivity({
      type: "room",
      title: "Room added",
      description: `${formData.name} - ${formData.building}`,
    });
    setFormData({ name: "", capacity: 50, building: "", availability: "Available" });
    setIsAddDialogOpen(false);
  };

  const handleEditRoom = () => {
    if (editingRoom) {
      updateRoom(editingRoom, formData);
      addActivity({
        type: "room",
        title: "Room updated",
        description: `${formData.name} - ${formData.building}`,
      });
      setFormData({ name: "", capacity: 50, building: "", availability: "Available" });
      setEditingRoom(null);
      setIsEditDialogOpen(false);
    }
  };

  const handleDeleteRoom = (id: string) => {
    const room = rooms.find((r) => r.id === id);
    if (room && confirm(`Are you sure you want to delete ${room.name}?`)) {
      deleteRoom(id);
      addActivity({
        type: "room",
        title: "Room deleted",
        description: `${room.name} - ${room.building}`,
      });
    }
  };

  const openEditDialog = (roomId: string) => {
    const room = rooms.find((r) => r.id === roomId);
    if (room) {
      setFormData({
        name: room.name,
        capacity: room.capacity,
        building: room.building,
        availability: room.availability,
      });
      setEditingRoom(roomId);
      setIsEditDialogOpen(true);
    }
  };

  const getAvailabilityBadge = (availability: Room["availability"]) => {
    switch (availability) {
      case "Available":
        return <Badge variant="success">Available</Badge>;
      case "In Use":
        return <Badge variant="warning">In Use</Badge>;
      case "Maintenance":
        return <Badge variant="destructive">Maintenance</Badge>;
    }
  };

  return (
    <div className="min-h-screen">
      <Header title="Rooms" />

      <div className="p-6">
        {/* Add Button */}
        <div className="mb-6 flex justify-end">
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Room
          </Button>
        </div>

        {/* Rooms Table */}
        <Card className="bg-white">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ROOM NAME</TableHead>
                  <TableHead>CAPACITY</TableHead>
                  <TableHead>BUILDING</TableHead>
                  <TableHead>AVAILABILITY</TableHead>
                  <TableHead className="text-right">ACTIONS</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rooms.map((room) => (
                  <TableRow key={room.id}>
                    <TableCell className="font-medium">{room.name}</TableCell>
                    <TableCell>{room.capacity}</TableCell>
                    <TableCell>{room.building}</TableCell>
                    <TableCell>{getAvailabilityBadge(room.availability)}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEditDialog(room.id)}
                      >
                        <Pencil className="h-4 w-4 text-gray-500" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteRoom(room.id)}
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

      {/* Add Room Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Room</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Room Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="e.g., Hall A"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="capacity">Capacity</Label>
              <Input
                id="capacity"
                type="number"
                min={10}
                value={formData.capacity}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    capacity: parseInt(e.target.value),
                  })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="building">Building</Label>
              <Input
                id="building"
                value={formData.building}
                onChange={(e) =>
                  setFormData({ ...formData, building: e.target.value })
                }
                placeholder="e.g., Main Building"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="availability">Availability</Label>
              <Select
                value={formData.availability}
                onValueChange={(value: Room["availability"]) =>
                  setFormData({ ...formData, availability: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Available">Available</SelectItem>
                  <SelectItem value="In Use">In Use</SelectItem>
                  <SelectItem value="Maintenance">Maintenance</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddRoom}>Add Room</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Room Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Room</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">Room Name</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-capacity">Capacity</Label>
              <Input
                id="edit-capacity"
                type="number"
                min={10}
                value={formData.capacity}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    capacity: parseInt(e.target.value),
                  })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-building">Building</Label>
              <Input
                id="edit-building"
                value={formData.building}
                onChange={(e) =>
                  setFormData({ ...formData, building: e.target.value })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-availability">Availability</Label>
              <Select
                value={formData.availability}
                onValueChange={(value: Room["availability"]) =>
                  setFormData({ ...formData, availability: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Available">Available</SelectItem>
                  <SelectItem value="In Use">In Use</SelectItem>
                  <SelectItem value="Maintenance">Maintenance</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleEditRoom}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
