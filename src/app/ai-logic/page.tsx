"use client";

import { Header } from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAppStore } from "@/lib/store";
import {
  Brain,
  GitBranch,
  Target,
  Eye,
  Wrench,
  Radio,
  BookOpen,
  CheckCircle,
  XCircle,
  ArrowRight,
  Layers,
  Search,
  Shield,
} from "lucide-react";

export default function AILogicPage() {
  const { scheduleResult } = useAppStore();

  return (
    <div className="min-h-screen">
      <Header title="AI Logic" />

      <div className="p-6">
        {/* Introduction */}
        <Card className="mb-6 bg-gradient-to-r from-[hsl(0_35%_30%)] to-[hsl(0_35%_30%)/0.8] text-white">
          <CardContent className="py-8">
            <div className="flex items-center gap-3 mb-4">
              <Brain className="h-10 w-10" />
              <h1 className="text-2xl font-bold">
                NadiExam: AI-Based Clash-Free Exam Scheduling
              </h1>
            </div>
            <p className="text-lg opacity-90 max-w-3xl">
              This system implements classical AI techniques including knowledge
              representation, state-space search, and intelligent agent design to
              automatically generate conflict-free exam timetables.
            </p>
            <div className="mt-4 flex gap-3">
              <Badge variant="outline" className="border-white/50 text-white">
                Classical AI
              </Badge>
              <Badge variant="outline" className="border-white/50 text-white">
                Constraint Satisfaction
              </Badge>
              <Badge variant="outline" className="border-white/50 text-white">
                Backtracking Search
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Main Content Tabs */}
        <Tabs defaultValue="a1" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="a1">A1: Constraints</TabsTrigger>
            <TabsTrigger value="a2">A2: Search</TabsTrigger>
            <TabsTrigger value="a3">A3: Agent</TabsTrigger>
            <TabsTrigger value="goals">Goals</TabsTrigger>
            <TabsTrigger value="trace">Audit Trail</TabsTrigger>
          </TabsList>

          {/* A1: Knowledge Representation */}
          <TabsContent value="a1">
            <Card className="bg-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-[hsl(0_35%_30%)]" />
                  A1 - Knowledge Representation: Constraint System
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-gray-600">
                  Scheduling rules are modeled as <strong>NEGATIVE CONSTRAINTS</strong>.
                  When a constraint is violated, the system triggers a{" "}
                  <code className="rounded bg-gray-100 px-1 py-0.5">Contradiction()</code>{" "}
                  signal and prunes that branch of the search space.
                </p>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {/* ROOM_CAPACITY */}
                  <div className="rounded-lg border p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Shield className="h-5 w-5 text-red-500" />
                      <h3 className="font-semibold">ROOM_CAPACITY</h3>
                      <Badge variant="destructive" className="text-xs">HARD</Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      Room capacity must be greater than or equal to enrolled students
                    </p>
                    <code className="block rounded bg-gray-100 p-2 text-xs">
                      room.capacity &ge; exam.studentCount
                    </code>
                  </div>

                  {/* DOUBLE_BOOKING */}
                  <div className="rounded-lg border p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Shield className="h-5 w-5 text-red-500" />
                      <h3 className="font-semibold">DOUBLE_BOOKING</h3>
                      <Badge variant="destructive" className="text-xs">HARD</Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      A room cannot host two exams at the same timeslot
                    </p>
                    <code className="block rounded bg-gray-100 p-2 text-xs">
                      &not;&exist;(e1, e2): room(e1) = room(e2) &and; time(e1) = time(e2)
                    </code>
                  </div>

                  {/* STUDENT_CLASH */}
                  <div className="rounded-lg border p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Shield className="h-5 w-5 text-red-500" />
                      <h3 className="font-semibold">STUDENT_CLASH</h3>
                      <Badge variant="destructive" className="text-xs">HARD</Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      Students cannot have overlapping exams
                    </p>
                    <code className="block rounded bg-gray-100 p-2 text-xs">
                      &forall;s: |exams(s) &cap; timeslot(t)| &le; 1
                    </code>
                  </div>

                  {/* FORBIDDEN_SLOT */}
                  <div className="rounded-lg border p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Shield className="h-5 w-5 text-orange-500" />
                      <h3 className="font-semibold">FORBIDDEN_SLOT</h3>
                      <Badge variant="warning" className="text-xs">HARD</Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      Exams cannot be scheduled in forbidden periods
                    </p>
                    <code className="block rounded bg-gray-100 p-2 text-xs">
                      &not;timeslot.isForbidden
                    </code>
                  </div>

                  {/* INVIGILATOR_LOAD */}
                  <div className="rounded-lg border p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Shield className="h-5 w-5 text-red-500" />
                      <h3 className="font-semibold">INVIGILATOR_LOAD</h3>
                      <Badge variant="destructive" className="text-xs">HARD</Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      Invigilators cannot exceed daily assignment limit
                    </p>
                    <code className="block rounded bg-gray-100 p-2 text-xs">
                      inv.currentLoad &lt; inv.maxLoad
                    </code>
                  </div>
                </div>

                <div className="rounded-lg bg-blue-50 p-4">
                  <h4 className="font-semibold text-blue-800 mb-2">
                    Contradiction Detection Process
                  </h4>
                  <div className="flex items-center gap-2 text-sm text-blue-700">
                    <span className="rounded bg-blue-200 px-2 py-1">Try Assignment</span>
                    <ArrowRight className="h-4 w-4" />
                    <span className="rounded bg-blue-200 px-2 py-1">Check All Constraints</span>
                    <ArrowRight className="h-4 w-4" />
                    <span className="rounded bg-blue-200 px-2 py-1">Accept or Contradiction()</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* A2: State Space Search */}
          <TabsContent value="a2">
            <Card className="bg-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="h-5 w-5 text-[hsl(0_35%_30%)]" />
                  A2 - State Space Search: Backtracking DFS with Heuristics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-gray-600">
                  The scheduling problem is formulated as a search problem with the
                  following components:
                </p>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-lg border p-4">
                    <h3 className="font-semibold mb-2 flex items-center gap-2">
                      <Layers className="h-4 w-4" />
                      State Definition
                    </h3>
                    <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                      <li><strong>State:</strong> Partial timetable (list of assignments)</li>
                      <li><strong>Initial State:</strong> Empty timetable []</li>
                      <li><strong>Goal State:</strong> All exams scheduled, no Contradiction()</li>
                    </ul>
                  </div>

                  <div className="rounded-lg border p-4">
                    <h3 className="font-semibold mb-2 flex items-center gap-2">
                      <GitBranch className="h-4 w-4" />
                      Actions
                    </h3>
                    <code className="block rounded bg-gray-100 p-2 text-xs mb-2">
                      ScheduleExam(exam, room, timeslot, invigilator)
                    </code>
                    <p className="text-sm text-gray-600">
                      Assigns an exam to a specific room, timeslot, and invigilator
                    </p>
                  </div>
                </div>

                <div className="rounded-lg bg-purple-50 p-4">
                  <h4 className="font-semibold text-purple-800 mb-3">
                    Heuristics for Efficient Search
                  </h4>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <h5 className="font-medium text-purple-700 mb-1">
                        Most Constrained Variable (MCV)
                      </h5>
                      <p className="text-sm text-purple-600">
                        Schedule exams with fewer valid options first. This includes
                        exams with more students (harder to fit) and more conflicts
                        with other exams.
                      </p>
                    </div>
                    <div>
                      <h5 className="font-medium text-purple-700 mb-1">
                        Least Constraining Value (LCV)
                      </h5>
                      <p className="text-sm text-purple-600">
                        Try assignments that leave the most options open for
                        remaining exams. Prioritize rooms with best capacity match
                        and invigilators with lower current load.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border p-4">
                  <h4 className="font-semibold mb-3">Search Algorithm: Backtracking DFS</h4>
                  <pre className="rounded bg-gray-900 text-gray-100 p-4 text-xs overflow-x-auto">
{`function backtrack(examIndex, assignments):
    if examIndex >= totalExams:
        return SUCCESS  // Goal state reached
    
    exam = sortedExams[examIndex]  // MCV ordering
    candidates = generateCandidates(exam)  // LCV ordering
    
    for candidate in candidates:
        if not causesContradiction(candidate, assignments):
            assignments.add(candidate)
            result = backtrack(examIndex + 1, assignments)
            if result == SUCCESS:
                return SUCCESS
            assignments.remove(candidate)  // Backtrack
    
    return FAILURE  // No valid assignment found`}
                  </pre>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* A3: Intelligent Agent */}
          <TabsContent value="a3">
            <Card className="bg-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-[hsl(0_35%_30%)]" />
                  A3 - Intelligent Agent: PEAS Model
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-gray-600">
                  The NadiExam system is modeled as a <strong>Goal-Based Agent</strong>{" "}
                  using the PEAS framework:
                </p>

                <div className="grid gap-4 md:grid-cols-2">
                  {/* Performance */}
                  <div className="rounded-lg border-2 border-green-200 bg-green-50 p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Target className="h-5 w-5 text-green-600" />
                      <h3 className="font-semibold text-green-800">Performance Measures</h3>
                    </div>
                    <ul className="space-y-2 text-sm text-green-700">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4" />
                        G1: Zero student timetable clashes
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4" />
                        G2: Fast planning (&lt;3 seconds)
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4" />
                        G3: Efficient room use (&le;10% empty)
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4" />
                        G4: Fair invigilator distribution
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4" />
                        G5: Clear audit trail
                      </li>
                    </ul>
                  </div>

                  {/* Environment */}
                  <div className="rounded-lg border-2 border-blue-200 bg-blue-50 p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Eye className="h-5 w-5 text-blue-600" />
                      <h3 className="font-semibold text-blue-800">Environment</h3>
                    </div>
                    <ul className="space-y-2 text-sm text-blue-700">
                      <li>Exams with student enrollments</li>
                      <li>Rooms with capacities</li>
                      <li>Timeslots (some forbidden)</li>
                      <li>Invigilators with load limits</li>
                      <li>Institutional policies</li>
                    </ul>
                  </div>

                  {/* Actuators */}
                  <div className="rounded-lg border-2 border-orange-200 bg-orange-50 p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Wrench className="h-5 w-5 text-orange-600" />
                      <h3 className="font-semibold text-orange-800">Actuators</h3>
                    </div>
                    <ul className="space-y-2 text-sm text-orange-700">
                      <li>ScheduleExam(exam, room, time, inv)</li>
                      <li>RejectInvalidAssignment()</li>
                      <li>UpdateInvigilatorWorkload()</li>
                      <li>GenerateTimetable()</li>
                      <li>ExportReports()</li>
                    </ul>
                  </div>

                  {/* Sensors */}
                  <div className="rounded-lg border-2 border-purple-200 bg-purple-50 p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Radio className="h-5 w-5 text-purple-600" />
                      <h3 className="font-semibold text-purple-800">Sensors</h3>
                    </div>
                    <ul className="space-y-2 text-sm text-purple-700">
                      <li>Data input (CSV/demo data)</li>
                      <li>Constraint violation signals</li>
                      <li>Current partial schedule state</li>
                      <li>Invigilator availability status</li>
                      <li>Room availability status</li>
                    </ul>
                  </div>
                </div>

                <div className="rounded-lg bg-gray-100 p-4">
                  <h4 className="font-semibold mb-2">Agent Type Classification</h4>
                  <div className="grid gap-2 md:grid-cols-4 text-sm">
                    <div className="rounded bg-white p-2 text-center">
                      <p className="font-medium">Observable</p>
                      <p className="text-gray-600">Fully</p>
                    </div>
                    <div className="rounded bg-white p-2 text-center">
                      <p className="font-medium">Deterministic</p>
                      <p className="text-gray-600">Yes</p>
                    </div>
                    <div className="rounded bg-white p-2 text-center">
                      <p className="font-medium">Episodic</p>
                      <p className="text-gray-600">Yes</p>
                    </div>
                    <div className="rounded bg-white p-2 text-center">
                      <p className="font-medium">Static</p>
                      <p className="text-gray-600">Yes</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Goals */}
          <TabsContent value="goals">
            <Card className="bg-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-[hsl(0_35%_30%)]" />
                  Project Goals (G1-G5)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  {
                    id: "G1",
                    title: "Zero Clashes",
                    type: "HARD CONSTRAINT",
                    description: "No student has overlapping exams. No room is double-booked.",
                    implementation: "Enforced via STUDENT_CLASH and DOUBLE_BOOKING constraints",
                    color: "red",
                  },
                  {
                    id: "G2",
                    title: "Fast Planning",
                    type: "PERFORMANCE",
                    description: "Generate feasible schedule in under 3 seconds on demo dataset.",
                    implementation: "Achieved via MCV/LCV heuristics and early pruning",
                    color: "blue",
                  },
                  {
                    id: "G3",
                    title: "Efficient Room Use",
                    type: "OPTIMIZATION",
                    description: "Keep average empty seats ≤ 10%.",
                    implementation: "LCV heuristic prefers rooms with best capacity match",
                    color: "green",
                  },
                  {
                    id: "G4",
                    title: "Fair Invigilator Load",
                    type: "OPTIMIZATION",
                    description: "No invigilator exceeds daily limit. Balanced distribution.",
                    implementation: "INVIGILATOR_LOAD constraint + load-aware scoring",
                    color: "purple",
                  },
                  {
                    id: "G5",
                    title: "Clear Audit",
                    type: "EXPLAINABILITY",
                    description: "Every assignment includes human-readable explanation.",
                    implementation: "Trace logging captures all decisions and reasoning",
                    color: "orange",
                  },
                ].map((goal) => (
                  <div key={goal.id} className="rounded-lg border p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className={`rounded bg-${goal.color}-100 px-2 py-1 text-sm font-bold text-${goal.color}-700`}>
                          {goal.id}
                        </span>
                        <h3 className="font-semibold">{goal.title}</h3>
                      </div>
                      <Badge variant="outline">{goal.type}</Badge>
                    </div>
                    <p className="text-gray-600 mb-2">{goal.description}</p>
                    <p className="text-sm text-gray-500">
                      <strong>Implementation:</strong> {goal.implementation}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Audit Trail */}
          <TabsContent value="trace">
            <Card className="bg-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GitBranch className="h-5 w-5 text-[hsl(0_35%_30%)]" />
                  Audit Trail (G5 - Explainability)
                </CardTitle>
              </CardHeader>
              <CardContent>
                {scheduleResult?.trace && scheduleResult.trace.length > 0 ? (
                  <ScrollArea className="h-[500px]">
                    <div className="space-y-2">
                      {scheduleResult.trace.slice(0, 50).map((entry, index) => (
                        <div
                          key={index}
                          className={`rounded-lg border p-3 ${
                            entry.action === "ACCEPT"
                              ? "border-green-200 bg-green-50"
                              : entry.action === "REJECT"
                              ? "border-red-200 bg-red-50"
                              : entry.action === "BACKTRACK"
                              ? "border-orange-200 bg-orange-50"
                              : entry.action === "DONE"
                              ? "border-blue-200 bg-blue-50"
                              : "border-gray-200 bg-gray-50"
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs text-gray-500">Step {entry.step}</span>
                            <Badge
                              variant={
                                entry.action === "ACCEPT"
                                  ? "success"
                                  : entry.action === "REJECT"
                                  ? "destructive"
                                  : "secondary"
                              }
                            >
                              {entry.action}
                            </Badge>
                          </div>
                          <p className="text-sm font-medium">{entry.note}</p>
                          {entry.checks && (
                            <div className="mt-2 space-y-1">
                              {entry.checks.map((check, i) => (
                                <div
                                  key={i}
                                  className="flex items-center gap-2 text-xs"
                                >
                                  {check.ok ? (
                                    <CheckCircle className="h-3 w-3 text-green-600" />
                                  ) : (
                                    <XCircle className="h-3 w-3 text-red-600" />
                                  )}
                                  <span className="text-gray-600">
                                    {check.constraint}: {check.detail}
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                    <GitBranch className="h-12 w-12 mb-4 opacity-50" />
                    <p>No trace data available.</p>
                    <p className="text-sm">Run the scheduler to generate an audit trail.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
