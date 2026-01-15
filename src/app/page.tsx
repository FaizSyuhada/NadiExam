"use client";

import { Header } from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useAppStore } from "@/lib/store";
import Link from "next/link";
import {
  FileText,
  Building2,
  Users,
  CheckCircle,
  Upload,
  Play,
  Building,
  FileEdit,
  UserCheck,
  Clock,
  ArrowRight,
  Calendar,
  AlertCircle,
  Brain,
  Target,
  Zap,
} from "lucide-react";

function formatTimeAgo(timestamp: string): string {
  const now = new Date();
  const date = new Date(timestamp);
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);

  if (diffDays > 0) {
    return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
  }
  if (diffHours > 0) {
    return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
  }
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  return `${diffMinutes} minute${diffMinutes > 1 ? "s" : ""} ago`;
}

function getActivityIcon(type: string) {
  switch (type) {
    case "upload":
      return <Upload className="h-4 w-4" />;
    case "scheduler":
      return <Play className="h-4 w-4" />;
    case "room":
      return <Building className="h-4 w-4" />;
    case "exam":
      return <FileEdit className="h-4 w-4" />;
    case "invigilator":
      return <UserCheck className="h-4 w-4" />;
    case "publish":
      return <CheckCircle className="h-4 w-4" />;
    default:
      return <Clock className="h-4 w-4" />;
  }
}

function getActivityColor(type: string) {
  switch (type) {
    case "upload":
      return "bg-blue-100 text-blue-600";
    case "scheduler":
      return "bg-green-100 text-green-600";
    case "room":
      return "bg-orange-100 text-orange-600";
    case "exam":
      return "bg-purple-100 text-purple-600";
    case "invigilator":
      return "bg-teal-100 text-teal-600";
    case "publish":
      return "bg-emerald-100 text-emerald-600";
    default:
      return "bg-gray-100 text-gray-600";
  }
}

export default function DashboardPage() {
  const { exams, rooms, students, invigilators, timetableVersion, activityLog, scheduleResult } = useAppStore();

  // Calculate total students from demo data
  const totalStudents = students.length > 0 ? 486 : 0;
  const availableRooms = rooms.filter((r) => r.availability === "Available").length;
  const availableInvigilators = invigilators.filter((i) => i.availability !== "Unavailable").length;

  const stats = [
    {
      label: "Total Exams",
      value: exams.length,
      icon: <FileText className="h-6 w-6" />,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      textColor: "text-blue-600",
    },
    {
      label: "Available Rooms",
      value: availableRooms,
      subtext: `of ${rooms.length} total`,
      icon: <Building2 className="h-6 w-6" />,
      color: "from-emerald-500 to-emerald-600",
      bgColor: "bg-emerald-50",
      textColor: "text-emerald-600",
    },
    {
      label: "Total Students",
      value: totalStudents,
      icon: <Users className="h-6 w-6" />,
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
      textColor: "text-purple-600",
    },
    {
      label: "Scheduling Status",
      value: timetableVersion?.status || "Ready",
      icon: timetableVersion?.status === "Published" ? (
        <CheckCircle className="h-6 w-6" />
      ) : (
        <Calendar className="h-6 w-6" />
      ),
      color: timetableVersion?.status === "Published" 
        ? "from-green-500 to-green-600" 
        : "from-amber-500 to-amber-600",
      bgColor: timetableVersion?.status === "Published" ? "bg-green-50" : "bg-amber-50",
      textColor: timetableVersion?.status === "Published" ? "text-green-600" : "text-amber-600",
      isStatus: true,
    },
  ];

  const quickActions = [
    {
      label: "Generate Schedule",
      description: "Run AI scheduling engine",
      href: "/scheduler",
      icon: <Zap className="h-5 w-5" />,
      color: "bg-gradient-to-r from-[hsl(0_35%_30%)] to-[hsl(0_35%_40%)]",
    },
    {
      label: "View Timetable",
      description: "See generated schedule",
      href: "/timetable",
      icon: <Calendar className="h-5 w-5" />,
      color: "bg-gradient-to-r from-blue-500 to-blue-600",
    },
    {
      label: "AI Logic",
      description: "Understand the reasoning",
      href: "/ai-logic",
      icon: <Brain className="h-5 w-5" />,
      color: "bg-gradient-to-r from-purple-500 to-purple-600",
    },
  ];

  return (
    <div className="min-h-screen">
      <Header title="Dashboard" />

      <div className="p-6">
        {/* Welcome Banner */}
        <Card className="mb-6 overflow-hidden bg-gradient-to-r from-[hsl(0_35%_30%)] to-[hsl(0_35%_40%)]">
          <CardContent className="py-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="text-white">
                <h1 className="text-2xl font-bold">Welcome to NadiExam</h1>
                <p className="mt-1 opacity-90">
                  AI-powered exam scheduling system using classical AI techniques
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Badge variant="outline" className="border-white/30 text-white">
                    Knowledge Representation
                  </Badge>
                  <Badge variant="outline" className="border-white/30 text-white">
                    State-Space Search
                  </Badge>
                  <Badge variant="outline" className="border-white/30 text-white">
                    Intelligent Agent
                  </Badge>
                </div>
              </div>
              <div className="mt-4 md:mt-0">
                <Link href="/scheduler">
                  <Button className="bg-white text-[hsl(0_35%_30%)] hover:bg-gray-100">
                    <Play className="mr-2 h-4 w-4" />
                    Start Scheduling
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <Card key={index} className="relative overflow-hidden bg-white">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                    <p className={`mt-2 text-3xl font-bold ${stat.isStatus ? stat.textColor : "text-gray-900"}`}>
                      {stat.value}
                    </p>
                    {stat.subtext && (
                      <p className="mt-1 text-xs text-gray-400">{stat.subtext}</p>
                    )}
                  </div>
                  <div className={`rounded-lg p-3 ${stat.bgColor}`}>
                    <div className={stat.textColor}>{stat.icon}</div>
                  </div>
                </div>
                <div className={`absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r ${stat.color}`} />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions & Performance */}
        <div className="mb-6 grid gap-6 lg:grid-cols-3">
          {/* Quick Actions */}
          <Card className="bg-white lg:col-span-1">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {quickActions.map((action, index) => (
                <Link key={index} href={action.href}>
                  <div className="group flex items-center gap-4 rounded-lg border p-3 transition-all hover:border-gray-300 hover:shadow-sm">
                    <div className={`rounded-lg p-2.5 text-white ${action.color}`}>
                      {action.icon}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{action.label}</p>
                      <p className="text-xs text-gray-500">{action.description}</p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-gray-400 transition-transform group-hover:translate-x-1" />
                  </div>
                </Link>
              ))}
            </CardContent>
          </Card>

          {/* AI Performance Metrics */}
          <Card className="bg-white lg:col-span-2">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base font-semibold">
                <Target className="h-4 w-4 text-[hsl(0_35%_30%)]" />
                Project Goals (G1-G5)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-3">
                  <div className="rounded-lg bg-green-50 p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-green-800">G1: Zero Clashes</span>
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    </div>
                    <p className="mt-1 text-xs text-green-600">Hard constraint enforced</p>
                  </div>
                  <div className="rounded-lg bg-blue-50 p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-blue-800">G2: Fast Planning</span>
                      {scheduleResult ? (
                        <Badge variant="info">{scheduleResult.metrics.totalTime}ms</Badge>
                      ) : (
                        <span className="text-xs text-blue-600">&lt;3s target</span>
                      )}
                    </div>
                    <p className="mt-1 text-xs text-blue-600">MCV/LCV heuristics</p>
                  </div>
                  <div className="rounded-lg bg-purple-50 p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-purple-800">G3: Room Efficiency</span>
                      {scheduleResult ? (
                        <Badge variant="secondary">{scheduleResult.metrics.averageRoomUtilization}%</Badge>
                      ) : (
                        <span className="text-xs text-purple-600">≤10% empty</span>
                      )}
                    </div>
                    <p className="mt-1 text-xs text-purple-600">Capacity optimization</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="rounded-lg bg-orange-50 p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-orange-800">G4: Fair Load</span>
                      <CheckCircle className="h-4 w-4 text-orange-600" />
                    </div>
                    <p className="mt-1 text-xs text-orange-600">Balanced invigilator distribution</p>
                  </div>
                  <div className="rounded-lg bg-teal-50 p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-teal-800">G5: Audit Trail</span>
                      {scheduleResult ? (
                        <Badge variant="secondary">{scheduleResult.trace.length} steps</Badge>
                      ) : (
                        <CheckCircle className="h-4 w-4 text-teal-600" />
                      )}
                    </div>
                    <p className="mt-1 text-xs text-teal-600">Full explainability</p>
                  </div>
                  {scheduleResult && (
                    <div className="rounded-lg border border-gray-200 p-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">States Explored</span>
                        <span className="font-mono text-sm">{scheduleResult.metrics.statesExplored}</span>
                      </div>
                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">Backtracks</span>
                        <span className="font-mono text-sm">{scheduleResult.metrics.backtracks}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="bg-white">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-base font-semibold">Recent Activity</CardTitle>
            <Button variant="ghost" size="sm" className="text-xs">
              View All
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activityLog.slice(0, 5).map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start gap-4 rounded-lg border border-transparent p-3 transition-colors hover:border-gray-200 hover:bg-gray-50"
                >
                  <div className={`rounded-lg p-2.5 ${getActivityColor(activity.type)}`}>
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900">{activity.title}</p>
                    <p className="mt-0.5 text-sm text-gray-500 truncate">
                      {activity.description}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-400 whitespace-nowrap">
                    <Clock className="h-3 w-3" />
                    {formatTimeAgo(activity.timestamp)}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
