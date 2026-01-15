"use client";

import { useState, useMemo } from "react";
import { Header } from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useAppStore } from "@/lib/store";
import { validateSchedule } from "@/lib/ai-engine";
import { examStudentCounts } from "@/lib/demo-data";
import {
  AlertCircle,
  CheckCircle,
  Download,
  Send,
  Filter,
  Calendar,
  Check,
  CalendarDays,
  List,
  Clock,
  Users,
  Building2,
  User,
  ChevronLeft,
  ChevronRight,
  Info,
} from "lucide-react";

export default function TimetablePage() {
  const {
    scheduleResult,
    timetableVersion,
    exams,
    rooms,
    timeslots,
    invigilators,
    approveTimetable,
    publishTimetable,
    addActivity,
  } = useAppStore();

  const [isConflictDialogOpen, setIsConflictDialogOpen] = useState(false);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"calendar" | "list">("calendar");
  const [filterBy, setFilterBy] = useState<string>("all");
  const [validationResult, setValidationResult] = useState<{
    studentClashes: number;
    roomConflicts: number;
    capacityViolations: number;
    forbiddenSlotViolations: number;
    isValid: boolean;
  } | null>(null);

  const assignments = timetableVersion?.assignments || scheduleResult?.timetable || [];

  const getExam = (examId: string) => exams.find((e) => e.id === examId);
  const getRoom = (roomId: string) => rooms.find((r) => r.id === roomId);
  const getTimeslot = (timeslotId: string) => timeslots.find((t) => t.id === timeslotId);
  const getInvigilator = (invigilatorId: string) =>
    invigilators.find((i) => i.id === invigilatorId);

  // Group assignments by date and time for calendar view
  const calendarData = useMemo(() => {
    const grouped: Record<string, Record<string, typeof assignments>> = {};
    const uniqueDates = [...new Set(timeslots.map((t) => t.date))].sort();
    const uniqueTimes = [...new Set(timeslots.map((t) => t.startTime))].sort();

    uniqueDates.forEach((date) => {
      grouped[date] = {};
      uniqueTimes.forEach((time) => {
        grouped[date][time] = [];
      });
    });

    assignments.forEach((a) => {
      const ts = getTimeslot(a.timeslotId);
      if (ts && grouped[ts.date]) {
        if (!grouped[ts.date][ts.startTime]) {
          grouped[ts.date][ts.startTime] = [];
        }
        grouped[ts.date][ts.startTime].push(a);
      }
    });

    return { grouped, dates: uniqueDates, times: uniqueTimes };
  }, [assignments, timeslots]);

  const filteredAssignments = assignments.filter((a) => {
    if (filterBy === "all") return true;
    const ts = getTimeslot(a.timeslotId);
    return ts?.date === filterBy;
  });

  const uniqueDates = [...new Set(timeslots.map((t) => t.date))];

  const handleReviewConflicts = () => {
    const result = validateSchedule(
      assignments,
      exams,
      rooms,
      timeslots,
      invigilators
    );
    setValidationResult(result);
    setIsConflictDialogOpen(true);
  };

  const handleApprove = () => {
    approveTimetable();
    addActivity({
      type: "scheduler",
      title: "Timetable approved",
      description: "Draft timetable has been approved",
    });
  };

  const handlePublish = () => {
    publishTimetable();
    addActivity({
      type: "publish",
      title: "Timetable published",
      description: `Timetable v${timetableVersion?.version || "1.0"} is now live`,
    });
  };

  const handleExport = () => {
    const headers = ["Date", "Time", "Exam Code", "Course Name", "Room", "Invigilator", "Students"];
    const rows = filteredAssignments.map((a) => {
      const exam = getExam(a.examId);
      const room = getRoom(a.roomId);
      const ts = getTimeslot(a.timeslotId);
      const inv = getInvigilator(a.invigilatorId);
      return [
        ts?.date || "",
        ts?.startTime || "",
        exam?.code || "",
        exam?.name || "",
        room?.name || "",
        inv?.name || "",
        a.enrolledCount.toString(),
      ].join(",");
    });

    const csv = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "timetable.csv";
    link.click();
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatDateShort = (dateStr: string) => {
    const date = new Date(dateStr);
    return {
      day: date.toLocaleDateString("en-US", { weekday: "short" }),
      date: date.getDate(),
      month: date.toLocaleDateString("en-US", { month: "short" }),
    };
  };

  const getStatusBadge = () => {
    switch (timetableVersion?.status) {
      case "Draft":
        return (
          <div className="flex items-center gap-2 rounded-lg bg-amber-50 border border-amber-200 px-4 py-2">
            <AlertCircle className="h-5 w-5 text-amber-600" />
            <div>
              <p className="font-medium text-amber-800">Draft Timetable</p>
              <p className="text-xs text-amber-600">Review and approve before publishing</p>
            </div>
          </div>
        );
      case "Approved":
        return (
          <div className="flex items-center gap-2 rounded-lg bg-blue-50 border border-blue-200 px-4 py-2">
            <Check className="h-5 w-5 text-blue-600" />
            <div>
              <p className="font-medium text-blue-800">Approved</p>
              <p className="text-xs text-blue-600">Ready to publish</p>
            </div>
          </div>
        );
      case "Published":
        return (
          <div className="flex items-center gap-2 rounded-lg bg-green-50 border border-green-200 px-4 py-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <div>
              <p className="font-medium text-green-800">Published v{timetableVersion.version}</p>
              <p className="text-xs text-green-600">
                {timetableVersion.publishedAt &&
                  new Date(timetableVersion.publishedAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                  })}
              </p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const openDetailDialog = (examId: string) => {
    setSelectedAssignment(examId);
    setIsDetailDialogOpen(true);
  };

  const selectedAssignmentData = selectedAssignment
    ? assignments.find((a) => a.examId === selectedAssignment)
    : null;

  // Color palette for exams
  const examColors = [
    "bg-blue-100 border-blue-300 text-blue-800",
    "bg-green-100 border-green-300 text-green-800",
    "bg-purple-100 border-purple-300 text-purple-800",
    "bg-orange-100 border-orange-300 text-orange-800",
    "bg-pink-100 border-pink-300 text-pink-800",
    "bg-teal-100 border-teal-300 text-teal-800",
    "bg-indigo-100 border-indigo-300 text-indigo-800",
    "bg-amber-100 border-amber-300 text-amber-800",
  ];

  const getExamColor = (examId: string) => {
    const index = exams.findIndex((e) => e.id === examId);
    return examColors[index % examColors.length];
  };

  if (assignments.length === 0) {
    return (
      <div className="min-h-screen">
        <Header title="Timetable" />
        <div className="flex h-[60vh] items-center justify-center p-6">
          <Card className="max-w-md bg-white p-8 text-center">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gray-100">
              <Calendar className="h-10 w-10 text-gray-400" />
            </div>
            <h2 className="mb-2 text-xl font-semibold text-gray-700">
              No Timetable Generated
            </h2>
            <p className="mb-4 text-gray-500">
              Go to the Scheduler page to generate an exam timetable using the AI engine.
            </p>
            <Button asChild>
              <a href="/scheduler">Go to Scheduler</a>
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header title="Timetable" />

      <div className="p-6">
        {/* Status and Actions Header */}
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          {getStatusBadge()}
          <div className="flex flex-wrap items-center gap-2">
            {timetableVersion?.status === "Draft" && (
              <>
                <Button variant="outline" onClick={handleReviewConflicts}>
                  <AlertCircle className="mr-2 h-4 w-4" />
                  Review Conflicts
                </Button>
                <Button variant="outline" onClick={handleApprove}>
                  <Check className="mr-2 h-4 w-4" />
                  Approve
                </Button>
                <Button onClick={handlePublish}>
                  <Send className="mr-2 h-4 w-4" />
                  Publish Timetable
                </Button>
              </>
            )}
            <Button variant="outline" onClick={handleExport}>
              <Download className="mr-2 h-4 w-4" />
              Export CSV
            </Button>
          </div>
        </div>

        {/* View Toggle and Filters */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as "calendar" | "list")}>
            <TabsList>
              <TabsTrigger value="calendar" className="gap-2">
                <CalendarDays className="h-4 w-4" />
                Calendar View
              </TabsTrigger>
              <TabsTrigger value="list" className="gap-2">
                <List className="h-4 w-4" />
                List View
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex items-center gap-4">
            {/* Only show filter in list view */}
            {viewMode === "list" && (
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-gray-500" />
                <Select value={filterBy} onValueChange={setFilterBy}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Filter by date" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Days</SelectItem>
                    {uniqueDates.map((date) => (
                      <SelectItem key={date} value={date}>
                        {formatDate(date)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Calendar className="h-4 w-4" />
              <span>May 15 - 20, 2024</span>
            </div>
          </div>
        </div>

        {/* Calendar View */}
        {viewMode === "calendar" && (
          <Card className="mb-6 overflow-hidden bg-white">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <div className="min-w-[800px]">
                  {/* Calendar Header */}
                  <div className="grid grid-cols-[100px_repeat(auto-fill,minmax(150px,1fr))] border-b bg-gray-50">
                    <div className="p-4 font-medium text-gray-600">Time</div>
                    {calendarData.dates.map((date) => {
                      const dateInfo = formatDateShort(date);
                      return (
                        <div key={date} className="border-l p-4 text-center">
                          <p className="text-xs font-medium text-gray-500">{dateInfo.day}</p>
                          <p className="text-2xl font-bold text-gray-900">{dateInfo.date}</p>
                          <p className="text-xs text-gray-500">{dateInfo.month}</p>
                        </div>
                      );
                    })}
                  </div>

                  {/* Calendar Body */}
                  {calendarData.times.map((time) => (
                    <div
                      key={time}
                      className="grid grid-cols-[100px_repeat(auto-fill,minmax(150px,1fr))] border-b last:border-b-0"
                    >
                      <div className="flex items-center justify-center border-r bg-gray-50 p-4">
                        <div className="text-center">
                          <Clock className="mx-auto mb-1 h-4 w-4 text-gray-400" />
                          <p className="text-sm font-medium text-gray-700">{time}</p>
                          <p className="text-xs text-gray-500">
                            {time === "09:00" ? "Morning" : "Afternoon"}
                          </p>
                        </div>
                      </div>
                      {calendarData.dates.map((date) => {
                        const cellAssignments = calendarData.grouped[date]?.[time] || [];
                        const ts = timeslots.find((t) => t.date === date && t.startTime === time);
                        const isForbidden = ts?.isForbidden;

                        return (
                          <div
                            key={`${date}-${time}`}
                            className={`min-h-[120px] border-l p-2 ${
                              isForbidden ? "bg-gray-100" : "bg-white"
                            }`}
                          >
                            {isForbidden ? (
                              <div className="flex h-full items-center justify-center">
                                <span className="text-xs text-gray-400">Forbidden</span>
                              </div>
                            ) : cellAssignments.length > 0 ? (
                              <div className="space-y-2">
                                {cellAssignments.map((a) => {
                                  const exam = getExam(a.examId);
                                  const room = getRoom(a.roomId);
                                  const inv = getInvigilator(a.invigilatorId);
                                  return (
                                    <Tooltip key={a.examId}>
                                      <TooltipTrigger asChild>
                                        <button
                                          onClick={() => openDetailDialog(a.examId)}
                                          className={`w-full rounded-lg border-l-4 p-2 text-left transition-all hover:shadow-md ${getExamColor(
                                            a.examId
                                          )}`}
                                        >
                                          <p className="font-semibold text-sm truncate">
                                            {exam?.code}
                                          </p>
                                          <p className="text-xs truncate opacity-80">
                                            {room?.name}
                                          </p>
                                          <div className="mt-1 flex items-center gap-1 text-xs opacity-70">
                                            <Users className="h-3 w-3" />
                                            {a.enrolledCount}
                                          </div>
                                        </button>
                                      </TooltipTrigger>
                                      <TooltipContent side="right" className="max-w-xs">
                                        <div className="space-y-1">
                                          <p className="font-semibold">{exam?.code} - {exam?.name}</p>
                                          <p className="text-sm">Room: {room?.name}</p>
                                          <p className="text-sm">Invigilator: {inv?.name}</p>
                                          <p className="text-sm">Students: {a.enrolledCount}</p>
                                        </div>
                                      </TooltipContent>
                                    </Tooltip>
                                  );
                                })}
                              </div>
                            ) : (
                              <div className="flex h-full items-center justify-center">
                                <span className="text-xs text-gray-300">No exam</span>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* List View */}
        {viewMode === "list" && (
          <Card className="mb-6 bg-white">
            <CardContent className="p-0">
              {timetableVersion?.status === "Published" && (
                <div className="flex items-center justify-between border-b px-4 py-2 text-sm text-gray-500">
                  <span className="flex items-center gap-2">
                    <Info className="h-4 w-4" />
                    Read-only view
                  </span>
                  <span>Version {timetableVersion.version}</span>
                </div>
              )}
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="font-semibold">DATE</TableHead>
                    <TableHead className="font-semibold">TIME</TableHead>
                    <TableHead className="font-semibold">EXAM</TableHead>
                    <TableHead className="font-semibold">ROOM</TableHead>
                    <TableHead className="font-semibold">INVIGILATOR</TableHead>
                    <TableHead className="font-semibold text-right">STUDENTS</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAssignments.map((assignment, index) => {
                    const exam = getExam(assignment.examId);
                    const room = getRoom(assignment.roomId);
                    const ts = getTimeslot(assignment.timeslotId);
                    const inv = getInvigilator(assignment.invigilatorId);

                    return (
                      <TableRow
                        key={index}
                        className="cursor-pointer hover:bg-gray-50"
                        onClick={() => openDetailDialog(assignment.examId)}
                      >
                        <TableCell className="font-medium">
                          {ts ? formatDate(ts.date) : "-"}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="font-mono">
                            {ts?.startTime || "-"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className={`h-3 w-3 rounded-full ${getExamColor(assignment.examId).split(' ')[0]}`} />
                            <div>
                              <p className="font-medium">{exam?.code}</p>
                              <p className="text-xs text-gray-500">{exam?.name}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Building2 className="h-4 w-4 text-gray-400" />
                            {room?.name}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-gray-400" />
                            {inv?.name}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge variant="secondary">{assignment.enrolledCount}</Badge>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        {/* Summary Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="bg-gradient-to-br from-blue-50 to-white border-blue-100">
            <CardContent className="py-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-600">Total Sessions</p>
                  <p className="text-3xl font-bold text-blue-900">{assignments.length}</p>
                </div>
                <div className="rounded-full bg-blue-100 p-3">
                  <CalendarDays className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-green-50 to-white border-green-100">
            <CardContent className="py-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-600">Rooms Used</p>
                  <p className="text-3xl font-bold text-green-900">
                    {new Set(assignments.map((a) => a.roomId)).size}
                  </p>
                </div>
                <div className="rounded-full bg-green-100 p-3">
                  <Building2 className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-purple-50 to-white border-purple-100">
            <CardContent className="py-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-purple-600">Invigilators</p>
                  <p className="text-3xl font-bold text-purple-900">
                    {new Set(assignments.map((a) => a.invigilatorId)).size}
                  </p>
                </div>
                <div className="rounded-full bg-purple-100 p-3">
                  <User className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-orange-50 to-white border-orange-100">
            <CardContent className="py-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-orange-600">Days Spanned</p>
                  <p className="text-3xl font-bold text-orange-900">
                    {new Set(assignments.map((a) => getTimeslot(a.timeslotId)?.date)).size}
                  </p>
                </div>
                <div className="rounded-full bg-orange-100 p-3">
                  <Calendar className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Conflict Review Dialog */}
      <Dialog open={isConflictDialogOpen} onOpenChange={setIsConflictDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Conflict Review</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            {validationResult?.isValid ? (
              <div className="flex flex-col items-center py-8">
                <div className="mb-4 rounded-full bg-green-100 p-4">
                  <CheckCircle className="h-12 w-12 text-green-500" />
                </div>
                <h3 className="text-lg font-semibold text-green-800">No Conflicts Detected</h3>
                <p className="mt-2 text-center text-gray-500">
                  The timetable has been validated successfully. All constraints are satisfied.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {validationResult && validationResult.studentClashes > 0 && (
                  <div className="flex items-center gap-3 rounded-lg bg-red-50 p-4">
                    <AlertCircle className="h-5 w-5 text-red-500" />
                    <div>
                      <p className="font-medium text-red-800">Student Clashes</p>
                      <p className="text-sm text-red-600">{validationResult.studentClashes} conflicts found</p>
                    </div>
                  </div>
                )}
                {validationResult && validationResult.roomConflicts > 0 && (
                  <div className="flex items-center gap-3 rounded-lg bg-red-50 p-4">
                    <AlertCircle className="h-5 w-5 text-red-500" />
                    <div>
                      <p className="font-medium text-red-800">Room Conflicts</p>
                      <p className="text-sm text-red-600">{validationResult.roomConflicts} conflicts found</p>
                    </div>
                  </div>
                )}
                {validationResult && validationResult.capacityViolations > 0 && (
                  <div className="flex items-center gap-3 rounded-lg bg-orange-50 p-4">
                    <AlertCircle className="h-5 w-5 text-orange-500" />
                    <div>
                      <p className="font-medium text-orange-800">Capacity Violations</p>
                      <p className="text-sm text-orange-600">{validationResult.capacityViolations} violations found</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button onClick={() => setIsConflictDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Assignment Detail Dialog */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Exam Session Details</DialogTitle>
          </DialogHeader>
          {selectedAssignmentData && (
            <div className="py-4 space-y-4">
              {(() => {
                const exam = getExam(selectedAssignmentData.examId);
                const room = getRoom(selectedAssignmentData.roomId);
                const ts = getTimeslot(selectedAssignmentData.timeslotId);
                const inv = getInvigilator(selectedAssignmentData.invigilatorId);
                const utilization = room 
                  ? Math.round((selectedAssignmentData.enrolledCount / room.capacity) * 100)
                  : 0;

                return (
                  <>
                    <div className={`rounded-lg p-4 ${getExamColor(selectedAssignmentData.examId)}`}>
                      <h3 className="text-lg font-bold">{exam?.code}</h3>
                      <p className="opacity-80">{exam?.name}</p>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="rounded-lg border p-4">
                        <div className="flex items-center gap-2 text-gray-500 mb-1">
                          <Calendar className="h-4 w-4" />
                          <span className="text-sm">Date & Time</span>
                        </div>
                        <p className="font-medium">{ts && formatDate(ts.date)}</p>
                        <p className="text-sm text-gray-600">{ts?.startTime} - {ts?.label}</p>
                      </div>

                      <div className="rounded-lg border p-4">
                        <div className="flex items-center gap-2 text-gray-500 mb-1">
                          <Building2 className="h-4 w-4" />
                          <span className="text-sm">Room</span>
                        </div>
                        <p className="font-medium">{room?.name}</p>
                        <p className="text-sm text-gray-600">{room?.building}</p>
                      </div>

                      <div className="rounded-lg border p-4">
                        <div className="flex items-center gap-2 text-gray-500 mb-1">
                          <User className="h-4 w-4" />
                          <span className="text-sm">Invigilator</span>
                        </div>
                        <p className="font-medium">{inv?.name}</p>
                        <Badge variant="success" className="mt-1">Available</Badge>
                      </div>

                      <div className="rounded-lg border p-4">
                        <div className="flex items-center gap-2 text-gray-500 mb-1">
                          <Users className="h-4 w-4" />
                          <span className="text-sm">Enrollment</span>
                        </div>
                        <p className="font-medium">{selectedAssignmentData.enrolledCount} students</p>
                        <p className="text-sm text-gray-600">
                          {utilization}% room utilization
                        </p>
                      </div>
                    </div>

                    {selectedAssignmentData.reason && (
                      <div className="rounded-lg bg-blue-50 p-4">
                        <p className="text-sm font-medium text-blue-800 mb-1">AI Reasoning (G5)</p>
                        <p className="text-sm text-blue-700">{selectedAssignmentData.reason}</p>
                      </div>
                    )}
                  </>
                );
              })()}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDetailDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
