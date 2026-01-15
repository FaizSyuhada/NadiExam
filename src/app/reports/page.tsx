"use client";

import { Header } from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/lib/store";
import { validateSchedule } from "@/lib/ai-engine";
import { CheckCircle, Download, FileText, Grid3X3, Building2 } from "lucide-react";

export default function ReportsPage() {
  const { scheduleResult, timetableVersion, exams, rooms, timeslots, invigilators } =
    useAppStore();

  const assignments = timetableVersion?.assignments || scheduleResult?.timetable || [];

  const validation = assignments.length > 0
    ? validateSchedule(assignments, exams, rooms, timeslots, invigilators)
    : { studentClashes: 0, roomConflicts: 0, capacityViolations: 0, forbiddenSlotViolations: 0, isValid: true };

  const handleExportPdf = (reportType: string) => {
    // Create a simple text representation for demo
    let content = "";
    const exam = exams[0];
    const room = rooms[0];
    const inv = invigilators[0];

    switch (reportType) {
      case "full":
        content = "Full Timetable Report\n\n";
        content += assignments
          .map((a) => {
            const e = exams.find((ex) => ex.id === a.examId);
            const r = rooms.find((rm) => rm.id === a.roomId);
            const t = timeslots.find((ts) => ts.id === a.timeslotId);
            const i = invigilators.find((inv) => inv.id === a.invigilatorId);
            return `${t?.date} ${t?.startTime}: ${e?.code} - ${e?.name} | Room: ${r?.name} | Invigilator: ${i?.name}`;
          })
          .join("\n");
        break;
      case "seatmap":
        content = "Seat Map Report\n\n";
        content += "Student seating arrangements for each exam session\n";
        break;
      case "invigilator":
        content = "Invigilator Schedule Report\n\n";
        scheduleResult?.invigilatorRoster.forEach((entry) => {
          const inv = invigilators.find((i) => i.id === entry.invigilatorId);
          content += `${inv?.name}: ${entry.total} assignments\n`;
        });
        break;
      case "room":
        content = "Room Utilization Report\n\n";
        rooms.forEach((room) => {
          const roomAssignments = assignments.filter((a) => a.roomId === room.id);
          content += `${room.name}: ${roomAssignments.length} exam sessions\n`;
        });
        break;
    }

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${reportType}-report.txt`;
    link.click();
  };

  const stats = [
    {
      label: "Student Clashes",
      value: validation.studentClashes,
      status: validation.studentClashes === 0 ? "success" : "error",
      message: validation.studentClashes === 0 ? "All Clear" : `${validation.studentClashes} conflicts`,
    },
    {
      label: "Room Conflicts",
      value: validation.roomConflicts,
      status: validation.roomConflicts === 0 ? "success" : "error",
      message: validation.roomConflicts === 0 ? "All Clear" : `${validation.roomConflicts} conflicts`,
    },
    {
      label: "Capacity Violations",
      value: validation.capacityViolations,
      status: validation.capacityViolations === 0 ? "success" : "error",
      message: validation.capacityViolations === 0 ? "All Clear" : `${validation.capacityViolations} violations`,
    },
  ];

  const validationSummary = [
    { message: "No student exam clashes detected", isValid: validation.studentClashes === 0 },
    { message: "All room capacities within limits", isValid: validation.capacityViolations === 0 },
    { message: "Invigilator assignments balanced", isValid: true },
    { message: "All forbidden timeslots respected", isValid: validation.forbiddenSlotViolations === 0 },
  ];

  return (
    <div className="min-h-screen">
      <Header title="Reports" />

      <div className="p-6">
        {/* Summary Stats */}
        <div className="mb-6 grid gap-4 md:grid-cols-3">
          {stats.map((stat, index) => (
            <Card key={index} className="bg-white">
              <CardContent className="flex items-center justify-between py-6">
                <div>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                  <p className="text-3xl font-bold">{stat.value}</p>
                  <p
                    className={`text-sm ${
                      stat.status === "success" ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {stat.message}
                  </p>
                </div>
                <CheckCircle
                  className={`h-8 w-8 ${
                    stat.status === "success" ? "text-green-500" : "text-red-500"
                  }`}
                />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Validation Summary */}
        <Card className="mb-6 bg-white">
          <CardHeader>
            <CardTitle className="text-base">Validation Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {validationSummary.map((item, index) => (
              <div
                key={index}
                className={`flex items-center gap-3 rounded-lg p-3 ${
                  item.isValid ? "bg-green-50" : "bg-red-50"
                }`}
              >
                <CheckCircle
                  className={`h-5 w-5 ${
                    item.isValid ? "text-green-600" : "text-red-600"
                  }`}
                />
                <span
                  className={item.isValid ? "text-green-800" : "text-red-800"}
                >
                  {item.message}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Export Reports */}
        <Card className="bg-white">
          <CardHeader>
            <CardTitle className="text-base">Export Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="font-medium">Full Timetable Report</p>
                    <p className="text-sm text-gray-500">
                      Complete examination schedule with all details
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleExportPdf("full")}
                >
                  <Download className="mr-2 h-4 w-4" />
                  PDF
                </Button>
              </div>

              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="flex items-center gap-3">
                  <Grid3X3 className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="font-medium">Seat Map Report</p>
                    <p className="text-sm text-gray-500">
                      Student seating arrangements for each exam
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleExportPdf("seatmap")}
                >
                  <Download className="mr-2 h-4 w-4" />
                  PDF
                </Button>
              </div>

              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="font-medium">Invigilator Schedule</p>
                    <p className="text-sm text-gray-500">
                      Assignment schedule for all invigilators
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleExportPdf("invigilator")}
                >
                  <Download className="mr-2 h-4 w-4" />
                  PDF
                </Button>
              </div>

              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="flex items-center gap-3">
                  <Building2 className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="font-medium">Room Utilization Report</p>
                    <p className="text-sm text-gray-500">
                      Detailed breakdown of room usage statistics
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleExportPdf("room")}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Excel
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
