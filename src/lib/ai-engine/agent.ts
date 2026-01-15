/**
 * A3 - Intelligent Agent: NadiExam Scheduling Agent
 * 
 * This module implements the intelligent agent using the PEAS model:
 * 
 * Performance Measures (G1-G5):
 * - G1: Zero student timetable clashes
 * - G2: Fast planning (< 3 seconds)
 * - G3: Efficient room use (≤ 10% empty seats)
 * - G4: Fair invigilator load distribution
 * - G5: Clear audit trail for every decision
 * 
 * Environment:
 * - Exams with student enrollments
 * - Rooms with capacities
 * - Timeslots (some forbidden)
 * - Invigilators with availability and load limits
 * 
 * Actuators:
 * - ScheduleExam(exam, room, timeslot, invigilator)
 * - RejectInvalidAssignment()
 * - UpdateInvigilatorWorkload()
 * - GenerateTimetable()
 * 
 * Sensors:
 * - Data input (exams, rooms, students, invigilators)
 * - Constraint violation signals
 * - Current partial schedule state
 */

import {
  Exam,
  Room,
  Timeslot,
  Invigilator,
  ScheduleResult,
  SchedulerSettings,
  InvigilatorRosterEntry,
  LockConstraints,
} from "../types";
import { search, SearchResult } from "./search";
import { examStudentCounts } from "../demo-data";

// ========================================
// Agent Configuration
// ========================================

export interface AgentConfig {
  exams: Exam[];
  rooms: Room[];
  timeslots: Timeslot[];
  invigilators: Invigilator[];
  settings: SchedulerSettings;
  lockConstraints?: LockConstraints;
}

// ========================================
// Performance Metrics Calculator
// ========================================

function calculateMetrics(
  searchResult: SearchResult,
  rooms: Room[]
): {
  averageRoomUtilization: number;
  invigilatorLoadVariance: number;
} {
  const { assignments } = searchResult;
  
  // Calculate average room utilization (G3)
  let totalUtilization = 0;
  for (const assignment of assignments) {
    const room = rooms.find((r) => r.id === assignment.roomId);
    if (room) {
      const utilization = assignment.enrolledCount / room.capacity;
      totalUtilization += utilization;
    }
  }
  const averageRoomUtilization =
    assignments.length > 0 ? totalUtilization / assignments.length : 0;
  
  // Calculate invigilator load variance (G4)
  const invigilatorLoads: Map<string, number> = new Map();
  for (const assignment of assignments) {
    const current = invigilatorLoads.get(assignment.invigilatorId) || 0;
    invigilatorLoads.set(assignment.invigilatorId, current + 1);
  }
  
  const loads = Array.from(invigilatorLoads.values());
  if (loads.length > 0) {
    const mean = loads.reduce((a, b) => a + b, 0) / loads.length;
    const variance =
      loads.reduce((acc, load) => acc + Math.pow(load - mean, 2), 0) /
      loads.length;
    return {
      averageRoomUtilization: Math.round(averageRoomUtilization * 100),
      invigilatorLoadVariance: Math.round(variance * 100) / 100,
    };
  }
  
  return {
    averageRoomUtilization: Math.round(averageRoomUtilization * 100),
    invigilatorLoadVariance: 0,
  };
}

// ========================================
// Generate Invigilator Roster
// ========================================

function generateInvigilatorRoster(
  searchResult: SearchResult,
  invigilators: Invigilator[]
): InvigilatorRosterEntry[] {
  const roster: InvigilatorRosterEntry[] = [];
  
  for (const invigilator of invigilators) {
    const assignments = searchResult.assignments.filter(
      (a) => a.invigilatorId === invigilator.id
    );
    
    roster.push({
      invigilatorId: invigilator.id,
      assignments: assignments.map((a) => ({
        examId: a.examId,
        timeslotId: a.timeslotId,
        roomId: a.roomId,
      })),
      total: assignments.length,
      maxPerDay: invigilator.maxLoad,
    });
  }
  
  return roster;
}

// ========================================
// Main Agent Function: Schedule Exams
// ========================================

export async function scheduleExams(
  config: AgentConfig,
  onProgress?: (step: number, total: number) => void
): Promise<ScheduleResult> {
  const { exams, rooms, timeslots, invigilators, settings, lockConstraints } =
    config;
  
  // Filter exams based on lock constraints (for guided scheduling)
  let examsToSchedule = [...exams];
  let timeslotsToUse = [...timeslots];
  let roomsToUse = [...rooms];
  
  if (lockConstraints) {
    // Apply lock constraints
    if (lockConstraints.priorityExamIds && lockConstraints.priorityExamIds.length > 0) {
      // Put priority exams first
      const priorityExams = examsToSchedule.filter((e) =>
        lockConstraints.priorityExamIds!.includes(e.id)
      );
      const otherExams = examsToSchedule.filter(
        (e) => !lockConstraints.priorityExamIds!.includes(e.id)
      );
      examsToSchedule = [...priorityExams, ...otherExams];
    }
    
    if (lockConstraints.roomIds && lockConstraints.roomIds.length > 0) {
      // Only use the specified rooms
      roomsToUse = rooms.filter((r) => lockConstraints.roomIds!.includes(r.id));
    }
    
    if (lockConstraints.timeslotIds && lockConstraints.timeslotIds.length > 0) {
      // Only use the specified timeslots
      timeslotsToUse = timeslots.filter((t) =>
        lockConstraints.timeslotIds!.includes(t.id)
      );
    }
    
    if (lockConstraints.dates && lockConstraints.dates.length > 0) {
      // Only use timeslots on the specified dates
      timeslotsToUse = timeslots.filter((t) =>
        lockConstraints.dates!.includes(t.date)
      );
    }
    
    // Note: invigilatorIds constraint would need to be handled in search.ts
    // for more fine-grained control
  }
  
  // Simulate async for progress updates
  await new Promise((resolve) => setTimeout(resolve, 100));
  
  // Run the search algorithm
  const searchResult = search(
    examsToSchedule,
    roomsToUse.length > 0 ? roomsToUse : rooms,
    timeslotsToUse.length > 0 ? timeslotsToUse : timeslots,
    invigilators,
    settings,
    onProgress
  );
  
  // Calculate performance metrics
  const metrics = calculateMetrics(searchResult, rooms);
  
  // Generate invigilator roster
  const invigilatorRoster = generateInvigilatorRoster(searchResult, invigilators);
  
  // Build final result
  const result: ScheduleResult = {
    success: searchResult.success,
    timetable: searchResult.assignments,
    invigilatorRoster,
    conflicts: searchResult.conflicts,
    trace: searchResult.trace,
    metrics: {
      totalTime: searchResult.stats.endTime - searchResult.stats.startTime,
      statesExplored: searchResult.stats.statesExplored,
      backtracks: searchResult.stats.backtracks,
      averageRoomUtilization: metrics.averageRoomUtilization,
      invigilatorLoadVariance: metrics.invigilatorLoadVariance,
    },
  };
  
  return result;
}

// ========================================
// Validation Function (for conflict review)
// ========================================

export function validateSchedule(
  assignments: {
    examId: string;
    roomId: string;
    timeslotId: string;
    invigilatorId: string;
  }[],
  exams: Exam[],
  rooms: Room[],
  timeslots: Timeslot[],
  invigilators: Invigilator[]
): {
  studentClashes: number;
  roomConflicts: number;
  capacityViolations: number;
  forbiddenSlotViolations: number;
  isValid: boolean;
} {
  let studentClashes = 0;
  let roomConflicts = 0;
  let capacityViolations = 0;
  let forbiddenSlotViolations = 0;
  
  // Check room double booking
  const roomTimeslotMap = new Map<string, string[]>();
  for (const a of assignments) {
    const key = `${a.roomId}-${a.timeslotId}`;
    const existing = roomTimeslotMap.get(key) || [];
    if (existing.length > 0) {
      roomConflicts++;
    }
    roomTimeslotMap.set(key, [...existing, a.examId]);
  }
  
  // Check capacity
  for (const a of assignments) {
    const exam = exams.find((e) => e.id === a.examId);
    const room = rooms.find((r) => r.id === a.roomId);
    if (exam && room) {
      const studentCount = examStudentCounts[exam.id] || exam.enrolledStudents.length;
      if (studentCount > room.capacity) {
        capacityViolations++;
      }
    }
  }
  
  // Check forbidden slots
  for (const a of assignments) {
    const timeslot = timeslots.find((t) => t.id === a.timeslotId);
    if (timeslot?.isForbidden) {
      forbiddenSlotViolations++;
    }
  }
  
  // Check student clashes
  const timeslotExamsMap = new Map<string, string[]>();
  for (const a of assignments) {
    const existing = timeslotExamsMap.get(a.timeslotId) || [];
    timeslotExamsMap.set(a.timeslotId, [...existing, a.examId]);
  }
  
  for (const [, examIds] of timeslotExamsMap) {
    if (examIds.length > 1) {
      // Check if any pair of exams share students
      for (let i = 0; i < examIds.length; i++) {
        for (let j = i + 1; j < examIds.length; j++) {
          const exam1 = exams.find((e) => e.id === examIds[i]);
          const exam2 = exams.find((e) => e.id === examIds[j]);
          if (exam1 && exam2) {
            const shared = exam1.enrolledStudents.filter((s) =>
              exam2.enrolledStudents.includes(s)
            );
            if (shared.length > 0) {
              studentClashes++;
            }
          }
        }
      }
    }
  }
  
  return {
    studentClashes,
    roomConflicts,
    capacityViolations,
    forbiddenSlotViolations,
    isValid:
      studentClashes === 0 &&
      roomConflicts === 0 &&
      capacityViolations === 0,
  };
}
