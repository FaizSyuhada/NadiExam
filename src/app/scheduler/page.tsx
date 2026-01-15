"use client";

import { useState, useCallback } from "react";
import { Header } from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useAppStore } from "@/lib/store";
import { scheduleExams } from "@/lib/ai-engine";
import {
  Play,
  Building2,
  Calendar,
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
} from "lucide-react";
import Link from "next/link";

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

          <TabsContent value="guided" className="mt-6">
            <Card className="bg-white">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Lock className="h-4 w-4 text-[hsl(0_35%_30%)]" />
                  Lock Constraints
                </CardTitle>
                <p className="text-sm text-gray-500">
                  Optionally lock specific resources to guide the scheduling
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2 text-sm">
                      <Building2 className="h-4 w-4 text-gray-400" />
                      Lock Room
                    </Label>
                    <Select
                      value={lockConstraints.roomId || "none"}
                      onValueChange={(v) =>
                        setLockConstraints({
                          ...lockConstraints,
                          roomId: v === "none" ? undefined : v,
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select room" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Any room</SelectItem>
                        {availableRooms.map((room) => (
                          <SelectItem key={room.id} value={room.id}>
                            {room.name} ({room.capacity} seats)
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      Lock Date
                    </Label>
                    <Input
                      type="date"
                      value={lockConstraints.date || ""}
                      onChange={(e) =>
                        setLockConstraints({
                          ...lockConstraints,
                          date: e.target.value || undefined,
                        })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-gray-400" />
                      Lock Timeslot
                    </Label>
                    <Select
                      value={lockConstraints.timeslotId || "none"}
                      onValueChange={(v) =>
                        setLockConstraints({
                          ...lockConstraints,
                          timeslotId: v === "none" ? undefined : v,
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select timeslot" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Any timeslot</SelectItem>
                        {availableTimeslots.map((ts) => (
                          <SelectItem key={ts.id} value={ts.id}>
                            {ts.date} - {ts.label} ({ts.startTime})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="flex items-center gap-2 text-sm">
                      <FileText className="h-4 w-4 text-gray-400" />
                      Prioritize Exam
                    </Label>
                    <Select
                      value={lockConstraints.priorityExamIds?.[0] || "none"}
                      onValueChange={(v) =>
                        setLockConstraints({
                          ...lockConstraints,
                          priorityExamIds: v === "none" ? undefined : [v],
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select exam" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">No priority</SelectItem>
                        {exams.map((exam) => (
                          <SelectItem key={exam.id} value={exam.id}>
                            {exam.code} - {exam.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
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
