"use client";

import { useState } from "react";
import { Header } from "@/components/layout/header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Label } from "@/components/ui/label";
import { useAppStore } from "@/lib/store";
import { examStudentCounts } from "@/lib/demo-data";
import { Search, Plus, Pencil, Trash2 } from "lucide-react";

export default function ExamsPage() {
  const { exams, addExam, updateExam, deleteExam, addActivity } = useAppStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingExam, setEditingExam] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    duration: 2,
  });

  const filteredExams = exams.filter(
    (exam) =>
      exam.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exam.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddExam = () => {
    const newExam = {
      id: `exam-${Date.now()}`,
      code: formData.code,
      name: formData.name,
      duration: formData.duration,
      enrolledStudents: [],
    };
    addExam(newExam);
    addActivity({
      type: "exam",
      title: "Exam added",
      description: `${formData.code} - ${formData.name}`,
    });
    setFormData({ code: "", name: "", duration: 2 });
    setIsAddDialogOpen(false);
  };

  const handleEditExam = () => {
    if (editingExam) {
      updateExam(editingExam, {
        code: formData.code,
        name: formData.name,
        duration: formData.duration,
      });
      addActivity({
        type: "exam",
        title: "Exam updated",
        description: `${formData.code} - ${formData.name}`,
      });
      setFormData({ code: "", name: "", duration: 2 });
      setEditingExam(null);
      setIsEditDialogOpen(false);
    }
  };

  const handleDeleteExam = (id: string) => {
    const exam = exams.find((e) => e.id === id);
    if (exam && confirm(`Are you sure you want to delete ${exam.code}?`)) {
      deleteExam(id);
      addActivity({
        type: "exam",
        title: "Exam deleted",
        description: `${exam.code} - ${exam.name}`,
      });
    }
  };

  const openEditDialog = (examId: string) => {
    const exam = exams.find((e) => e.id === examId);
    if (exam) {
      setFormData({
        code: exam.code,
        name: exam.name,
        duration: exam.duration,
      });
      setEditingExam(examId);
      setIsEditDialogOpen(true);
    }
  };

  return (
    <div className="min-h-screen">
      <Header title="Exams" />

      <div className="p-6">
        {/* Search and Add */}
        <div className="mb-6 flex items-center justify-between">
          <div className="relative w-80">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search exams..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Exam
          </Button>
        </div>

        {/* Exams Table */}
        <Card className="bg-white">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[150px]">EXAM CODE</TableHead>
                  <TableHead>COURSE NAME</TableHead>
                  <TableHead>NUMBER OF STUDENTS</TableHead>
                  <TableHead>DURATION</TableHead>
                  <TableHead className="text-right">ACTIONS</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredExams.map((exam) => (
                  <TableRow key={exam.id}>
                    <TableCell className="font-medium">{exam.code}</TableCell>
                    <TableCell>{exam.name}</TableCell>
                    <TableCell>
                      {examStudentCounts[exam.id] || exam.enrolledStudents.length}
                    </TableCell>
                    <TableCell>{exam.duration} hours</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEditDialog(exam.id)}
                      >
                        <Pencil className="h-4 w-4 text-gray-500" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteExam(exam.id)}
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

      {/* Add Exam Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Exam</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="code">Exam Code</Label>
              <Input
                id="code"
                value={formData.code}
                onChange={(e) =>
                  setFormData({ ...formData, code: e.target.value })
                }
                placeholder="e.g., CS401"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="name">Course Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="e.g., Database Systems"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="duration">Duration (hours)</Label>
              <Input
                id="duration"
                type="number"
                min={1}
                max={5}
                step={0.5}
                value={formData.duration}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    duration: parseFloat(e.target.value),
                  })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddExam}>Add Exam</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Exam Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Exam</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-code">Exam Code</Label>
              <Input
                id="edit-code"
                value={formData.code}
                onChange={(e) =>
                  setFormData({ ...formData, code: e.target.value })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-name">Course Name</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-duration">Duration (hours)</Label>
              <Input
                id="edit-duration"
                type="number"
                min={1}
                max={5}
                step={0.5}
                value={formData.duration}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    duration: parseFloat(e.target.value),
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
            <Button onClick={handleEditExam}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
