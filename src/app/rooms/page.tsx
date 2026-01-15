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
import { Plus, Pencil, Trash2, Search, Building2, Filter } from "lucide-react";
import { Room } from "@/lib/types";

export default function RoomsPage() {
  const { rooms, addRoom, updateRoom, deleteRoom, addActivity } = useAppStore();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterAvailability, setFilterAvailability] = useState<string>("all");
  const [formData, setFormData] = useState({
    name: "",
    capacity: 50,
    building: "",
    availability: "Available" as Room["availability"],
  });

  // Filter rooms based on search query and availability filter
  const filteredRooms = rooms.filter((room) => {
    const matchesSearch =
      room.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      room.building.toLowerCase().includes(searchQuery.toLowerCase()) ||
      room.capacity.toString().includes(searchQuery);
    const matchesAvailability =
      filterAvailability === "all" || room.availability === filterAvailability;
    return matchesSearch && matchesAvailability;
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
        {/* Stats Cards */}
        <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
          <Card className="bg-white">
            <CardContent className="py-4">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-blue-100 p-2">
                  <Building2 className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{rooms.length}</p>
                  <p className="text-xs text-gray-500">Total Rooms</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white">
            <CardContent className="py-4">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-green-100 p-2">
                  <Building2 className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {rooms.filter((r) => r.availability === "Available").length}
                  </p>
                  <p className="text-xs text-gray-500">Available</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white">
            <CardContent className="py-4">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-amber-100 p-2">
                  <Building2 className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {rooms.filter((r) => r.availability === "In Use").length}
                  </p>
                  <p className="text-xs text-gray-500">In Use</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white">
            <CardContent className="py-4">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-red-100 p-2">
                  <Building2 className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {rooms.filter((r) => r.availability === "Maintenance").length}
                  </p>
                  <p className="text-xs text-gray-500">Maintenance</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter Bar */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-1 items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search by room name, building, or capacity..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <Select value={filterAvailability} onValueChange={setFilterAvailability}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Available">Available</SelectItem>
                  <SelectItem value="In Use">In Use</SelectItem>
                  <SelectItem value="Maintenance">Maintenance</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Room
          </Button>
        </div>

        {/* Rooms Table */}
        <Card className="bg-white">
          <CardContent className="p-0">
            {filteredRooms.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Building2 className="h-12 w-12 text-gray-300 mb-4" />
                <p className="text-gray-500 font-medium">No rooms found</p>
                <p className="text-gray-400 text-sm">
                  {searchQuery || filterAvailability !== "all"
                    ? "Try adjusting your search or filter"
                    : "Add a room to get started"}
                </p>
              </div>
            ) : (
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
                {filteredRooms.map((room) => (
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
            )}
          </CardContent>
        </Card>

        {/* Results count */}
        {(searchQuery || filterAvailability !== "all") && filteredRooms.length > 0 && (
          <p className="mt-4 text-sm text-gray-500">
            Showing {filteredRooms.length} of {rooms.length} rooms
          </p>
        )}
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
