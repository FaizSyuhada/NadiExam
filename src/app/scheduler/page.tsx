"use client";

import { useState, useCallback } from "react";
import { format } from "date-fns";
import { Header } from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useAppStore } from "@/lib/store";
import { scheduleExams } from "@/lib/ai-engine";
import {
  Play,
  Building2,
  Calendar as CalendarIcon,
  Clock,
  FileText,
  CheckCircle,
  XCircle,
  Loader2,
  Sparkles,
  Target,
  Zap,
  AlertTriangle,
  Brain,
  ArrowRight,
  Settings2,
  Lock,
  User,
  RotateCcw,
  Layers,
  Shield,
  X,
  Check,
  CalendarDays,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function SchedulerPage() {
  const {
    exams,
    rooms,
    timeslots,
    invigilators,
    schedulerSettings,
    setSchedulerSettings,
    setScheduleResult,
    setTimetableVersion,
    scheduleResult,
    isScheduling,
    setIsScheduling,
    schedulingProgress,
    setSchedulingProgress,
    schedulingMode,
    setSchedulingMode,
    lockConstraints,
    setLockConstraints,
    addActivity,
  } = useAppStore();

  const [status, setStatus] = useState<"ready" | "running" | "success" | "error">("ready");
  const [datePickerOpen, setDatePickerOpen] = useState(false);

  const handleGenerateTimetable = useCallback(async () => {
    setIsScheduling(true);
    setStatus("running");
    setSchedulingProgress(0);

    try {
      const result = await scheduleExams(
        {
          exams,
          rooms,
          timeslots,
          invigilators,
          settings: schedulerSettings,
          lockConstraints: schedulingMode === "guided" ? lockConstraints : undefined,
        },
        (step, total) => {
          setSchedulingProgress(Math.round((step / total) * 100));
        }
      );

      setScheduleResult(result);

      if (result.success) {
        setStatus("success");
        setTimetableVersion({
          version: "1.0",
          status: "Draft",
          assignments: result.timetable,
        });
        addActivity({
          type: "scheduler",
          title: "Scheduler last run",
          description: `Timetable generation completed successfully (${result.metrics.totalTime}ms)`,
        });
      } else {
        setStatus("error");
      }
    } catch (error) {
      console.error("Scheduling error:", error);
      setStatus("error");
    } finally {
      setIsScheduling(false);
      setSchedulingProgress(100);
    }
  }, [
    exams,
    rooms,
    timeslots,
    invigilators,
    schedulerSettings,
    schedulingMode,
    lockConstraints,
    setIsScheduling,
    setScheduleResult,
    setTimetableVersion,
    setSchedulingProgress,
    addActivity,
  ]);

  // Multi-select toggle helpers
  const toggleRoom = (roomId: string) => {
    const current = lockConstraints.roomIds || [];
    const updated = current.includes(roomId)
      ? current.filter((id) => id !== roomId)
      : [...current, roomId];
    setLockConstraints({ ...lockConstraints, roomIds: updated.length ? updated : undefined });
  };

  const toggleTimeslot = (timeslotId: string) => {
    const current = lockConstraints.timeslotIds || [];
    const updated = current.includes(timeslotId)
      ? current.filter((id) => id !== timeslotId)
      : [...current, timeslotId];
    setLockConstraints({ ...lockConstraints, timeslotIds: updated.length ? updated : undefined });
  };

  const toggleInvigilator = (invigilatorId: string) => {
    const current = lockConstraints.invigilatorIds || [];
    const updated = current.includes(invigilatorId)
      ? current.filter((id) => id !== invigilatorId)
      : [...current, invigilatorId];
    setLockConstraints({ ...lockConstraints, invigilatorIds: updated.length ? updated : undefined });
  };

  const togglePriorityExam = (examId: string) => {
    const current = lockConstraints.priorityExamIds || [];
    const updated = current.includes(examId)
      ? current.filter((id) => id !== examId)
      : [...current, examId];
    setLockConstraints({ ...lockConstraints, priorityExamIds: updated.length ? updated : undefined });
  };

  const toggleDate = (date: Date | undefined) => {
    if (!date) return;
    const dateStr = format(date, "yyyy-MM-dd");
    const current = lockConstraints.dates || [];
    const updated = current.includes(dateStr)
      ? current.filter((d) => d !== dateStr)
      : [...current, dateStr];
    setLockConstraints({ ...lockConstraints, dates: updated.length ? updated : undefined });
  };

  const removeDate = (dateStr: string) => {
    const current = lockConstraints.dates || [];
    const updated = current.filter((d) => d !== dateStr);
    setLockConstraints({ ...lockConstraints, dates: updated.length ? updated : undefined });
  };

  const getStatusDisplay = () => {
    switch (status) {
      case "ready":
        return (
          <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200">
              <Sparkles className="h-5 w-5 text-gray-500" />
            </div>
            <div>
              <p className="font-medium text-gray-700">Ready to Generate</p>
              <p className="text-sm text-gray-500">Configure settings and click generate</p>
            </div>
          </div>
        );
      case "running":
        return (
          <div className="flex items-center gap-3 rounded-lg bg-blue-50 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-200">
              <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-blue-700">Generating Schedule...</p>
              <p className="text-sm text-blue-500">Running AI scheduling algorithm</p>
              <Progress value={schedulingProgress} className="mt-2 h-2" />
            </div>
          </div>
        );
      case "success":
        return (
          <div className="flex items-center gap-3 rounded-lg bg-green-50 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-200">
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="font-medium text-green-700">Schedule Generated Successfully</p>
              <p className="text-sm text-green-500">
                Completed in {scheduleResult?.metrics.totalTime}ms with {scheduleResult?.timetable.length} assignments
              </p>
            </div>
          </div>
        );
      case "error":
        return (
          <div className="flex items-center gap-3 rounded-lg bg-red-50 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-200">
              <XCircle className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <p className="font-medium text-red-700">Failed to Generate Schedule</p>
              <p className="text-sm text-red-500">No valid solution found with current constraints</p>
            </div>
          </div>
        );
    }
  };

  const availableRooms = rooms.filter((r) => r.availability === "Available");
  const availableInvigilators = invigilators.filter((i) => i.availability !== "Unavailable");
  const availableTimeslots = timeslots.filter((t) => !t.isForbidden);

  // Check if any constraints are active
  const hasActiveConstraints =
    (lockConstraints.roomIds?.length || 0) > 0 ||
    (lockConstraints.dates?.length || 0) > 0 ||
    (lockConstraints.timeslotIds?.length || 0) > 0 ||
    (lockConstraints.invigilatorIds?.length || 0) > 0 ||
    (lockConstraints.priorityExamIds?.length || 0) > 0;

  // Convert date strings to Date objects for calendar
  const selectedDates = (lockConstraints.dates || []).map((d) => new Date(d));

  return (
    <div className="min-h-screen">
      <Header title="Scheduler" />

      <div className="p-6">
        {/* Header Stats */}
        <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
          <Card className="bg-white">
            <CardContent className="flex items-center gap-3 py-4">
              <div className="rounded-lg bg-blue-100 p-2">
                <FileText className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{exams.length}</p>
                <p className="text-xs text-gray-500">Exams to Schedule</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white">
            <CardContent className="flex items-center gap-3 py-4">
              <div className="rounded-lg bg-green-100 p-2">
                <Building2 className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{availableRooms.length}</p>
                <p className="text-xs text-gray-500">Available Rooms</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white">
            <CardContent className="flex items-center gap-3 py-4">
              <div className="rounded-lg bg-purple-100 p-2">
                <Clock className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{availableTimeslots.length}</p>
                <p className="text-xs text-gray-500">Available Slots</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white">
            <CardContent className="flex items-center gap-3 py-4">
              <div className="rounded-lg bg-orange-100 p-2">
                <Target className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{availableInvigilators.length}</p>
                <p className="text-xs text-gray-500">Invigilators Ready</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Mode Tabs */}
        <Tabs
          value={schedulingMode}
          onValueChange={(v) => setSchedulingMode(v as "automatic" | "guided")}
          className="mb-6"
        >
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="automatic" className="gap-2">
              <Zap className="h-4 w-4" />
              Automatic Scheduling
            </TabsTrigger>
            <TabsTrigger value="guided" className="gap-2">
              <Lock className="h-4 w-4" />
              Guided Scheduling
            </TabsTrigger>
          </TabsList>

          <TabsContent value="automatic" className="mt-6">
            <Card className="bg-gradient-to-br from-blue-50 to-white border-blue-100">
              <CardContent className="py-4">
                <div className="flex items-start gap-3">
                  <div className="rounded-lg bg-blue-100 p-2">
                    <Brain className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-blue-900">Fully Automatic Mode</h3>
                    <p className="mt-1 text-sm text-blue-700">
                      The AI engine will automatically find the optimal schedule using backtracking search 
                      with MCV (Most Constrained Variable) and LCV (Least Constraining Value) heuristics.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="guided" className="mt-6 space-y-6">
            {/* Guided Mode Info Banner */}
            <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-white">
              <CardContent className="py-4">
                <div className="flex items-start gap-3">
                  <div className="rounded-lg bg-purple-100 p-2">
                    <Shield className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-purple-900">Guided Scheduling Mode</h3>
                    <p className="mt-1 text-sm text-purple-700">
                      Lock multiple constraints to guide the AI. Select multiple rooms, dates, timeslots, 
                      invigilators, or priority exams. The scheduler will respect your preferences.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Active Constraints Summary */}
            {hasActiveConstraints && (
              <Card className="border-amber-200 bg-amber-50">
                <CardContent className="py-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Lock className="h-4 w-4 text-amber-600" />
                      <span className="text-sm font-medium text-amber-800">Active:</span>
                      <div className="flex flex-wrap gap-1">
                        {lockConstraints.roomIds?.map((id) => (
                          <Badge key={id} variant="outline" className="border-amber-300 bg-white text-amber-700 gap-1">
                            <Building2 className="h-3 w-3" />
                            {rooms.find((r) => r.id === id)?.name}
                            <button onClick={() => toggleRoom(id)} className="ml-1 hover:text-amber-900">
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        ))}
                        {lockConstraints.dates?.map((date) => (
                          <Badge key={date} variant="outline" className="border-amber-300 bg-white text-amber-700 gap-1">
                            <CalendarIcon className="h-3 w-3" />
                            {format(new Date(date), "MMM d")}
                            <button onClick={() => removeDate(date)} className="ml-1 hover:text-amber-900">
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        ))}
                        {lockConstraints.timeslotIds?.map((id) => (
                          <Badge key={id} variant="outline" className="border-amber-300 bg-white text-amber-700 gap-1">
                            <Clock className="h-3 w-3" />
                            {timeslots.find((t) => t.id === id)?.label}
                            <button onClick={() => toggleTimeslot(id)} className="ml-1 hover:text-amber-900">
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        ))}
                        {lockConstraints.invigilatorIds?.map((id) => (
                          <Badge key={id} variant="outline" className="border-amber-300 bg-white text-amber-700 gap-1">
                            <User className="h-3 w-3" />
                            {invigilators.find((i) => i.id === id)?.name}
                            <button onClick={() => toggleInvigilator(id)} className="ml-1 hover:text-amber-900">
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        ))}
                        {lockConstraints.priorityExamIds?.map((id) => (
                          <Badge key={id} variant="outline" className="border-blue-300 bg-white text-blue-700 gap-1">
                            <Layers className="h-3 w-3" />
                            {exams.find((e) => e.id === id)?.code}
                            <button onClick={() => togglePriorityExam(id)} className="ml-1 hover:text-blue-900">
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-amber-600 hover:text-amber-700 hover:bg-amber-100 shrink-0"
                      onClick={() => setLockConstraints({})}
                    >
                      <RotateCcw className="mr-1 h-3 w-3" />
                      Clear
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Constraint Selection Grid */}
            <div className="grid gap-4 md:grid-cols-2">
              {/* Lock Rooms Card */}
              <Card className={cn("transition-all", lockConstraints.roomIds?.length ? "ring-2 ring-green-500 bg-green-50/30" : "bg-white hover:shadow-md")}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={cn("rounded-lg p-2", lockConstraints.roomIds?.length ? "bg-green-100" : "bg-gray-100")}>
                        <Building2 className={cn("h-4 w-4", lockConstraints.roomIds?.length ? "text-green-600" : "text-gray-500")} />
                      </div>
                      <div>
                        <CardTitle className="text-sm font-medium">Lock Rooms</CardTitle>
                        <p className="text-xs text-gray-500">Select allowed venues</p>
                      </div>
                    </div>
                    {lockConstraints.roomIds?.length ? (
                      <Badge className="bg-green-100 text-green-700">{lockConstraints.roomIds.length} selected</Badge>
                    ) : null}
                  </div>
                </CardHeader>
                <CardContent className="pt-2">
                  <ScrollArea className="h-[140px] rounded-md border p-2">
                    <div className="space-y-1">
                      {availableRooms.map((room) => {
                        const isSelected = lockConstraints.roomIds?.includes(room.id);
                        return (
                          <button
                            key={room.id}
                            onClick={() => toggleRoom(room.id)}
                            className={cn(
                              "flex w-full items-center justify-between rounded-md px-2 py-1.5 text-sm transition-colors",
                              isSelected ? "bg-green-100 text-green-800" : "hover:bg-gray-100"
                            )}
                          >
                            <div className="flex items-center gap-2">
                              {isSelected ? (
                                <Check className="h-4 w-4 text-green-600" />
                              ) : (
                                <div className="h-4 w-4 rounded border border-gray-300" />
                              )}
                              <span className="font-medium">{room.name}</span>
                            </div>
                            <Badge variant="outline" className="text-xs">{room.capacity} seats</Badge>
                          </button>
                        );
                      })}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>

              {/* Lock Timeslots Card */}
              <Card className={cn("transition-all", lockConstraints.timeslotIds?.length ? "ring-2 ring-green-500 bg-green-50/30" : "bg-white hover:shadow-md")}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={cn("rounded-lg p-2", lockConstraints.timeslotIds?.length ? "bg-green-100" : "bg-gray-100")}>
                        <Clock className={cn("h-4 w-4", lockConstraints.timeslotIds?.length ? "text-green-600" : "text-gray-500")} />
                      </div>
                      <div>
                        <CardTitle className="text-sm font-medium">Lock Timeslots</CardTitle>
                        <p className="text-xs text-gray-500">Select allowed times</p>
                      </div>
                    </div>
                    {lockConstraints.timeslotIds?.length ? (
                      <Badge className="bg-green-100 text-green-700">{lockConstraints.timeslotIds.length} selected</Badge>
                    ) : null}
                  </div>
                </CardHeader>
                <CardContent className="pt-2">
                  <ScrollArea className="h-[140px] rounded-md border p-2">
                    <div className="space-y-1">
                      {availableTimeslots.map((ts) => {
                        const isSelected = lockConstraints.timeslotIds?.includes(ts.id);
                        return (
                          <button
                            key={ts.id}
                            onClick={() => toggleTimeslot(ts.id)}
                            className={cn(
                              "flex w-full items-center justify-between rounded-md px-2 py-1.5 text-sm transition-colors",
                              isSelected ? "bg-green-100 text-green-800" : "hover:bg-gray-100"
                            )}
                          >
                            <div className="flex items-center gap-2">
                              {isSelected ? (
                                <Check className="h-4 w-4 text-green-600" />
                              ) : (
                                <div className="h-4 w-4 rounded border border-gray-300" />
                              )}
                              <span className="font-medium">{ts.date}</span>
                            </div>
                            <Badge variant="outline" className="text-xs">{ts.label} ({ts.startTime})</Badge>
                          </button>
                        );
                      })}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>

              {/* Lock Dates Card with Calendar */}
              <Card className={cn("transition-all", lockConstraints.dates?.length ? "ring-2 ring-green-500 bg-green-50/30" : "bg-white hover:shadow-md")}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={cn("rounded-lg p-2", lockConstraints.dates?.length ? "bg-green-100" : "bg-gray-100")}>
                        <CalendarDays className={cn("h-4 w-4", lockConstraints.dates?.length ? "text-green-600" : "text-gray-500")} />
                      </div>
                      <div>
                        <CardTitle className="text-sm font-medium">Lock Dates</CardTitle>
                        <p className="text-xs text-gray-500">Select allowed days</p>
                      </div>
                    </div>
                    {lockConstraints.dates?.length ? (
                      <Badge className="bg-green-100 text-green-700">{lockConstraints.dates.length} selected</Badge>
                    ) : null}
                  </div>
                </CardHeader>
                <CardContent className="pt-2">
                  <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !lockConstraints.dates?.length && "text-gray-500",
                          lockConstraints.dates?.length && "border-green-300"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {lockConstraints.dates?.length ? (
                          <span>{lockConstraints.dates.length} date(s) selected</span>
                        ) : (
                          <span>Click to select dates...</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="multiple"
                        selected={selectedDates}
                        onSelect={(dates) => {
                          const dateStrs = dates?.map((d) => format(d, "yyyy-MM-dd")) || [];
                          setLockConstraints({
                            ...lockConstraints,
                            dates: dateStrs.length ? dateStrs : undefined,
                          });
                        }}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  {lockConstraints.dates?.length ? (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {lockConstraints.dates.map((date) => (
                        <Badge key={date} variant="secondary" className="gap-1">
                          {format(new Date(date), "MMM d, yyyy")}
                          <button onClick={() => removeDate(date)} className="hover:text-red-600">
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  ) : null}
                </CardContent>
              </Card>

              {/* Priority Exams Card */}
              <Card className={cn("transition-all", lockConstraints.priorityExamIds?.length ? "ring-2 ring-blue-500 bg-blue-50/30" : "bg-white hover:shadow-md")}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={cn("rounded-lg p-2", lockConstraints.priorityExamIds?.length ? "bg-blue-100" : "bg-gray-100")}>
                        <Layers className={cn("h-4 w-4", lockConstraints.priorityExamIds?.length ? "text-blue-600" : "text-gray-500")} />
                      </div>
                      <div>
                        <CardTitle className="text-sm font-medium">Priority Exams</CardTitle>
                        <p className="text-xs text-gray-500">Schedule these first</p>
                      </div>
                    </div>
                    {lockConstraints.priorityExamIds?.length ? (
                      <Badge className="bg-blue-100 text-blue-700">{lockConstraints.priorityExamIds.length} selected</Badge>
                    ) : null}
                  </div>
                </CardHeader>
                <CardContent className="pt-2">
                  <ScrollArea className="h-[140px] rounded-md border p-2">
                    <div className="space-y-1">
                      {exams.map((exam) => {
                        const isSelected = lockConstraints.priorityExamIds?.includes(exam.id);
                        return (
                          <button
                            key={exam.id}
                            onClick={() => togglePriorityExam(exam.id)}
                            className={cn(
                              "flex w-full items-center justify-between rounded-md px-2 py-1.5 text-sm transition-colors",
                              isSelected ? "bg-blue-100 text-blue-800" : "hover:bg-gray-100"
                            )}
                          >
                            <div className="flex items-center gap-2">
                              {isSelected ? (
                                <Check className="h-4 w-4 text-blue-600" />
                              ) : (
                                <div className="h-4 w-4 rounded border border-gray-300" />
                              )}
                              <span className="font-medium">{exam.code}</span>
                            </div>
                            <span className="text-xs text-gray-500 truncate max-w-[100px]">{exam.name}</span>
                          </button>
                        );
                      })}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>

              {/* Lock Invigilators Card */}
              <Card className={cn("transition-all md:col-span-2", lockConstraints.invigilatorIds?.length ? "ring-2 ring-green-500 bg-green-50/30" : "bg-white hover:shadow-md")}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={cn("rounded-lg p-2", lockConstraints.invigilatorIds?.length ? "bg-green-100" : "bg-gray-100")}>
                        <User className={cn("h-4 w-4", lockConstraints.invigilatorIds?.length ? "text-green-600" : "text-gray-500")} />
                      </div>
                      <div>
                        <CardTitle className="text-sm font-medium">Lock Invigilators</CardTitle>
                        <p className="text-xs text-gray-500">Select allowed supervisors</p>
                      </div>
                    </div>
                    {lockConstraints.invigilatorIds?.length ? (
                      <Badge className="bg-green-100 text-green-700">{lockConstraints.invigilatorIds.length} selected</Badge>
                    ) : null}
                  </div>
                </CardHeader>
                <CardContent className="pt-2">
                  <div className="grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-4">
                    {availableInvigilators.map((inv) => {
                      const isSelected = lockConstraints.invigilatorIds?.includes(inv.id);
                      return (
                        <button
                          key={inv.id}
                          onClick={() => toggleInvigilator(inv.id)}
                          className={cn(
                            "flex items-center gap-2 rounded-lg border p-3 text-sm transition-all",
                            isSelected
                              ? "border-green-300 bg-green-50 text-green-800"
                              : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                          )}
                        >
                          {isSelected ? (
                            <Check className="h-4 w-4 text-green-600 shrink-0" />
                          ) : (
                            <div className="h-4 w-4 rounded border border-gray-300 shrink-0" />
                          )}
                          <div className="text-left min-w-0">
                            <p className="font-medium truncate">{inv.name}</p>
                            <p className="text-xs text-gray-500">Max {inv.maxLoad}/day</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Scheduler Settings */}
        <Card className="mb-6 bg-white">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Settings2 className="h-4 w-4 text-[hsl(0_35%_30%)]" />
              Scheduler Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-gray-50">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-red-100 p-2">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                </div>
                <div>
                  <Label className="font-medium">Avoid Forbidden Timeslots</Label>
                  <p className="text-sm text-gray-500">
                    Respect blocked time periods for exams
                  </p>
                </div>
              </div>
              <Switch
                checked={schedulerSettings.avoidForbiddenTimeslots}
                onCheckedChange={(checked) =>
                  setSchedulerSettings({
                    ...schedulerSettings,
                    avoidForbiddenTimeslots: checked,
                  })
                }
              />
            </div>

            <div className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-gray-50">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-purple-100 p-2">
                  <Target className="h-4 w-4 text-purple-600" />
                </div>
                <div>
                  <Label className="font-medium">Balance Invigilator Load</Label>
                  <p className="text-sm text-gray-500">
                    Distribute invigilation duties evenly (G4)
                  </p>
                </div>
              </div>
              <Switch
                checked={schedulerSettings.balanceInvigilatorLoad}
                onCheckedChange={(checked) =>
                  setSchedulerSettings({
                    ...schedulerSettings,
                    balanceInvigilatorLoad: checked,
                  })
                }
              />
            </div>

            <div className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-gray-50">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-green-100 p-2">
                  <Building2 className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <Label className="font-medium">Minimize Room Wastage</Label>
                  <p className="text-sm text-gray-500">
                    Optimize room capacity utilization (G3)
                  </p>
                </div>
              </div>
              <Switch
                checked={schedulerSettings.minimizeRoomWastage}
                onCheckedChange={(checked) =>
                  setSchedulerSettings({
                    ...schedulerSettings,
                    minimizeRoomWastage: checked,
                  })
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Generate Button */}
        <Button
          onClick={handleGenerateTimetable}
          disabled={isScheduling}
          className="mb-6 w-full bg-gradient-to-r from-[hsl(0_35%_30%)] to-[hsl(0_35%_40%)] py-6 text-lg shadow-lg transition-all hover:shadow-xl"
        >
          {isScheduling ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Generating Schedule...
            </>
          ) : (
            <>
              <Play className="mr-2 h-5 w-5" />
              Generate Timetable
            </>
          )}
        </Button>

        {/* Status */}
        <Card className="mb-6 bg-white">
          <CardContent className="py-4">{getStatusDisplay()}</CardContent>
        </Card>

        {/* Results */}
        {scheduleResult && status === "success" && (
          <Card className="bg-white">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <CheckCircle className="h-4 w-4 text-green-600" />
                Generation Results
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-xl bg-gradient-to-br from-green-50 to-green-100 p-4">
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle className="h-4 w-4" />
                    <span className="text-sm font-medium">Exams Scheduled</span>
                  </div>
                  <p className="mt-2 text-3xl font-bold text-green-800">
                    {scheduleResult.timetable.length}
                  </p>
                </div>
                <div className="rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 p-4">
                  <div className="flex items-center gap-2 text-blue-600">
                    <Zap className="h-4 w-4" />
                    <span className="text-sm font-medium">Generation Time</span>
                  </div>
                  <p className="mt-2 text-3xl font-bold text-blue-800">
                    {scheduleResult.metrics.totalTime}
                    <span className="text-lg font-normal">ms</span>
                  </p>
                </div>
                <div className="rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 p-4">
                  <div className="flex items-center gap-2 text-purple-600">
                    <Brain className="h-4 w-4" />
                    <span className="text-sm font-medium">States Explored</span>
                  </div>
                  <p className="mt-2 text-3xl font-bold text-purple-800">
                    {scheduleResult.metrics.statesExplored}
                  </p>
                </div>
                <div className="rounded-xl bg-gradient-to-br from-orange-50 to-orange-100 p-4">
                  <div className="flex items-center gap-2 text-orange-600">
                    <Building2 className="h-4 w-4" />
                    <span className="text-sm font-medium">Room Utilization</span>
                  </div>
                  <p className="mt-2 text-3xl font-bold text-orange-800">
                    {scheduleResult.metrics.averageRoomUtilization}
                    <span className="text-lg font-normal">%</span>
                  </p>
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <Button asChild className="flex-1">
                  <Link href="/timetable">
                    View Timetable
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" className="flex-1">
                  <Link href="/ai-logic">
                    <Brain className="mr-2 h-4 w-4" />
                    View AI Reasoning
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
