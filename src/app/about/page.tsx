"use client";

import { Header } from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Brain,
  Target,
  Users,
  BookOpen,
  Code,
  Layers,
  CheckCircle,
} from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <Header title="About" />

      <div className="mx-auto max-w-4xl p-6">
        {/* Project Title */}
        <Card className="mb-6 bg-gradient-to-r from-[hsl(0_35%_30%)] to-[hsl(0_35%_30%)/0.8] text-white">
          <CardContent className="py-8 text-center">
            <Brain className="mx-auto mb-4 h-16 w-16" />
            <h1 className="text-3xl font-bold mb-2">NadiExam</h1>
            <p className="text-xl opacity-90">
              AI-Based Clash-Free Exam Scheduling System
            </p>
            <div className="mt-4 flex justify-center gap-2">
              <Badge variant="outline" className="border-white/50 text-white">
                Artificial Intelligence Course Project
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Project Overview */}
        <Card className="mb-6 bg-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-[hsl(0_35%_30%)]" />
              Project Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-600">
              NadiExam is an intelligent exam scheduling system that uses classical AI
              techniques to automatically generate conflict-free examination timetables.
              The system ensures no student has overlapping exams while optimizing room
              utilization and balancing invigilator workloads.
            </p>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-lg bg-blue-50 p-4 text-center">
                <h3 className="font-semibold text-blue-800">Approach</h3>
                <p className="text-sm text-blue-600">Classical AI</p>
              </div>
              <div className="rounded-lg bg-green-50 p-4 text-center">
                <h3 className="font-semibold text-green-800">Method</h3>
                <p className="text-sm text-green-600">Constraint Satisfaction</p>
              </div>
              <div className="rounded-lg bg-purple-50 p-4 text-center">
                <h3 className="font-semibold text-purple-800">Algorithm</h3>
                <p className="text-sm text-purple-600">Backtracking Search</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* AI Techniques Used */}
        <Card className="mb-6 bg-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Layers className="h-5 w-5 text-[hsl(0_35%_30%)]" />
              AI Techniques Implemented
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="rounded-lg border p-4">
                <h3 className="font-semibold mb-2">
                  A1: Knowledge Representation
                </h3>
                <p className="text-sm text-gray-600">
                  Scheduling constraints modeled as negative constraints with
                  contradiction detection. Includes room capacity, double booking,
                  student clash, forbidden timeslot, and invigilator load constraints.
                </p>
              </div>
              <div className="rounded-lg border p-4">
                <h3 className="font-semibold mb-2">A2: State Space Search</h3>
                <p className="text-sm text-gray-600">
                  Backtracking DFS algorithm with MCV (Most Constrained Variable)
                  and LCV (Least Constraining Value) heuristics for efficient
                  search space exploration.
                </p>
              </div>
              <div className="rounded-lg border p-4">
                <h3 className="font-semibold mb-2">A3: Intelligent Agent</h3>
                <p className="text-sm text-gray-600">
                  Goal-based agent design using the PEAS model (Performance,
                  Environment, Actuators, Sensors) for systematic decision making.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Features */}
        <Card className="mb-6 bg-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-[hsl(0_35%_30%)]" />
              Key Features
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="grid gap-3 md:grid-cols-2">
              {[
                "Zero student exam clashes (G1)",
                "Fast schedule generation <3s (G2)",
                "Optimized room utilization (G3)",
                "Balanced invigilator load (G4)",
                "Full audit trail for decisions (G5)",
                "Automatic conflict detection",
                "Guided scheduling mode",
                "Export timetables to CSV",
                "Real-time constraint validation",
                "Interactive step-by-step demo",
              ].map((feature, index) => (
                <li key={index} className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">{feature}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Tech Stack */}
        <Card className="mb-6 bg-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code className="h-5 w-5 text-[hsl(0_35%_30%)]" />
              Technology Stack
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {[
                "Next.js 14",
                "TypeScript",
                "Tailwind CSS",
                "shadcn/ui",
                "Zustand",
                "Lucide Icons",
                "React Hook Form",
                "Zod",
              ].map((tech) => (
                <Badge key={tech} variant="outline">
                  {tech}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Course Information */}
        <Card className="bg-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-[hsl(0_35%_30%)]" />
              Course Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-sm text-gray-500">Course</p>
                <p className="font-medium">Artificial Intelligence</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Project Type</p>
                <p className="font-medium">Classical AI Implementation</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Focus Areas</p>
                <p className="font-medium">
                  Knowledge Rep., Search, Intelligent Agents
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Approach</p>
                <p className="font-medium">No ML/LLM - Pure Classical AI</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
