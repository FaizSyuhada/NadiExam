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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAppStore } from "@/lib/store";
import { Search, Filter } from "lucide-react";

export default function StudentsPage() {
  const { students, exams } = useAppStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterExam, setFilterExam] = useState<string>("all");

  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.studentId.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter =
      filterExam === "all" || student.registeredExams.includes(filterExam);

    return matchesSearch && matchesFilter;
  });

  const getExamCode = (examId: string) => {
    const exam = exams.find((e) => e.id === examId);
    return exam?.code || examId;
  };

  return (
    <div className="min-h-screen">
      <Header title="Students" />

      <div className="p-6">
        {/* Search and Filter */}
        <div className="mb-6 flex items-center gap-4">
          <div className="relative w-80">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search students..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={filterExam} onValueChange={setFilterExam}>
            <SelectTrigger className="w-48">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Filter by exam" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Exams</SelectItem>
              {exams.map((exam) => (
                <SelectItem key={exam.id} value={exam.id}>
                  {exam.code}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Students Table */}
        <Card className="bg-white">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[150px]">STUDENT ID</TableHead>
                  <TableHead>NAME</TableHead>
                  <TableHead>REGISTERED EXAMS</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell className="font-medium">
                      {student.studentId}
                    </TableCell>
                    <TableCell>{student.name}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {student.registeredExams.map((examId) => (
                          <Badge
                            key={examId}
                            variant="secondary"
                            className="bg-[hsl(0_35%_30%)/0.1] text-[hsl(0_35%_30%)]"
                          >
                            {getExamCode(examId)}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
