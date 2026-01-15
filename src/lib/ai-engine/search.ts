/**
 * A2 - State Space Search: Exam Scheduling Search Engine
 * 
 * This module implements the search algorithm for finding a valid exam schedule.
 * 
 * State Space Model:
 * - State: Partial timetable (list of exam assignments)
 * - Initial State: Empty timetable
 * - Actions: ScheduleExam(exam, room, timeslot, invigilator)
 * - Goal State: All exams scheduled AND no Contradiction()
 * 
 * Search Strategy:
 * - Backtracking / DFS with constraint propagation
 * - Heuristics: Most Constrained Variable (MCV) - schedule exams with fewer options first
 * - Early pruning: Skip invalid candidates immediately
 */

import {
  Exam,
  Room,
  Timeslot,
  Invigilator,
  ScheduleAssignment,
  TraceEntry,
  ConflictRecord,
  SchedulerSettings,
} from "../types";
import {
  validateAssignment,
  CandidateAssignment,
} from "./constraints";
import { examStudentCounts } from "../demo-data";

// ========================================
// Search State
// ========================================

export interface SearchState {
  assignments: ScheduleAssignment[];
  remainingExams: Exam[];
  step: number;
}

// ========================================
// Heuristics for Variable Ordering (A2)
// ========================================

/**
 * Most Constrained Variable (MCV) Heuristic
 * Prioritize exams with:
 * 1. More students (harder to find suitable room)
 * 2. More conflicts with other exams (harder to schedule)
 * 3. Longer duration
 */
export function sortExamsByConstrainedness(
  exams: Exam[],
  rooms: Room[],
  timeslots: Timeslot[],
  assignments: ScheduleAssignment[]
): Exam[] {
  return [...exams].sort((a, b) => {
    const countA = examStudentCounts[a.id] || a.enrolledStudents.length;
    const countB = examStudentCounts[b.id] || b.enrolledStudents.length;
    
    // Rooms that can fit exam A
    const fittingRoomsA = rooms.filter((r) => r.capacity >= countA).length;
    const fittingRoomsB = rooms.filter((r) => r.capacity >= countB).length;
    
    // Fewer fitting rooms = more constrained
    if (fittingRoomsA !== fittingRoomsB) {
      return fittingRoomsA - fittingRoomsB;
    }
    
    // More students = more constrained
    return countB - countA;
  });
}

/**
 * Value Ordering Heuristic: Least Constraining Value
 * Order candidate assignments to try the ones that leave more options open
 */
export function sortCandidatesByScore(
  candidates: CandidateAssignment[],
  settings: SchedulerSettings
): CandidateAssignment[] {
  return [...candidates].sort((a, b) => {
    let scoreA = 0;
    let scoreB = 0;
    
    // G3: Minimize Room Wastage - prefer rooms with less empty seats
    if (settings.minimizeRoomWastage) {
      const wasteA = a.room.capacity - a.studentCount;
      const wasteB = b.room.capacity - b.studentCount;
      scoreA += wasteA * 2; // Lower waste = lower score = better
      scoreB += wasteB * 2;
    }
    
    // G4: Balance Invigilator Load - prefer invigilators with fewer current assignments
    if (settings.balanceInvigilatorLoad) {
      scoreA += a.invigilator.dailyLoad * 10;
      scoreB += b.invigilator.dailyLoad * 10;
    }
    
    // Prefer earlier timeslots (natural ordering)
    // This creates a more predictable schedule
    scoreA += parseInt(a.timeslot.id.split("-")[1]) || 0;
    scoreB += parseInt(b.timeslot.id.split("-")[1]) || 0;
    
    return scoreA - scoreB;
  });
}

// ========================================
// Candidate Generation
// ========================================

export function generateCandidates(
  exam: Exam,
  rooms: Room[],
  timeslots: Timeslot[],
  invigilators: Invigilator[],
  currentAssignments: ScheduleAssignment[],
  settings: SchedulerSettings
): CandidateAssignment[] {
  const candidates: CandidateAssignment[] = [];
  const studentCount = examStudentCounts[exam.id] || exam.enrolledStudents.length;
  
  // Filter available rooms (with capacity)
  const availableRooms = rooms.filter(
    (r) => r.availability === "Available" && r.capacity >= studentCount
  );
  
  // Filter available timeslots
  const availableTimeslots = settings.avoidForbiddenTimeslots
    ? timeslots.filter((t) => !t.isForbidden)
    : timeslots;
  
  // Filter available invigilators
  const availableInvigilators = invigilators.filter(
    (i) => i.availability !== "Unavailable"
  );
  
  // Generate all combinations
  for (const room of availableRooms) {
    for (const timeslot of availableTimeslots) {
      for (const invigilator of availableInvigilators) {
        candidates.push({
          exam,
          room,
          timeslot,
          invigilator,
          studentCount,
        });
      }
    }
  }
  
  // Sort by heuristic score
  return sortCandidatesByScore(candidates, settings);
}

// ========================================
// Search Algorithm (DFS with Backtracking)
// ========================================

export interface SearchResult {
  success: boolean;
  assignments: ScheduleAssignment[];
  trace: TraceEntry[];
  conflicts: ConflictRecord[];
  stats: {
    statesExplored: number;
    backtracks: number;
    startTime: number;
    endTime: number;
  };
}

export function search(
  exams: Exam[],
  rooms: Room[],
  timeslots: Timeslot[],
  invigilators: Invigilator[],
  settings: SchedulerSettings,
  onProgress?: (step: number, total: number) => void
): SearchResult {
  const trace: TraceEntry[] = [];
  const conflicts: ConflictRecord[] = [];
  let step = 0;
  let backtracks = 0;
  const startTime = Date.now();
  
  // Sort exams by constrainedness (MCV heuristic)
  const sortedExams = sortExamsByConstrainedness(
    exams,
    rooms,
    timeslots,
    []
  );
  
  // Track invigilator loads for balancing
  const invigilatorLoads: Map<string, number> = new Map();
  invigilators.forEach((inv) => invigilatorLoads.set(inv.id, 0));
  
  function backtrack(
    examIndex: number,
    currentAssignments: ScheduleAssignment[]
  ): ScheduleAssignment[] | null {
    // Base case: all exams scheduled
    if (examIndex >= sortedExams.length) {
      trace.push({
        step: ++step,
        action: "DONE",
        examId: "ALL",
        note: `Successfully scheduled all ${sortedExams.length} exams`,
      });
      return currentAssignments;
    }
    
    const exam = sortedExams[examIndex];
    
    // Generate candidates with updated invigilator loads
    const invigilatorsWithLoads = invigilators.map((inv) => ({
      ...inv,
      dailyLoad: invigilatorLoads.get(inv.id) || 0,
    }));
    
    const candidates = generateCandidates(
      exam,
      rooms,
      timeslots,
      invigilatorsWithLoads,
      currentAssignments,
      settings
    );
    
    // Report progress
    if (onProgress) {
      onProgress(examIndex + 1, sortedExams.length);
    }
    
    for (const candidate of candidates) {
      step++;
      
      // Log TRY action
      trace.push({
        step,
        action: "TRY",
        examId: exam.id,
        candidate: {
          roomId: candidate.room.id,
          timeslotId: candidate.timeslot.id,
          invigilatorId: candidate.invigilator.id,
        },
        note: `Trying ${exam.code} in ${candidate.room.name} at ${candidate.timeslot.label}`,
      });
      
      // Validate the assignment
      const validation = validateAssignment(
        candidate,
        currentAssignments,
        exams,
        settings.avoidForbiddenTimeslots
      );
      
      trace.push({
        step,
        action: validation.isValid ? "ACCEPT" : "REJECT",
        examId: exam.id,
        candidate: {
          roomId: candidate.room.id,
          timeslotId: candidate.timeslot.id,
          invigilatorId: candidate.invigilator.id,
        },
        checks: validation.checks.map((c) => ({
          constraint: c.constraint,
          ok: c.ok,
          detail: c.detail,
        })),
        note: validation.isValid
          ? `Accepted: ${exam.code} assigned to ${candidate.room.name}`
          : `Rejected: ${validation.violations[0]?.message}`,
      });
      
      if (!validation.isValid) {
        // Log conflict
        conflicts.push({
          step,
          examId: exam.id,
          attempted: {
            roomId: candidate.room.id,
            timeslotId: candidate.timeslot.id,
            invigilatorId: candidate.invigilator.id,
          },
          constraint: validation.violations[0]?.constraint || "ROOM_CAPACITY",
          message: validation.violations[0]?.message || "Unknown violation",
        });
        continue; // Try next candidate
      }
      
      // Create assignment
      const assignment: ScheduleAssignment = {
        examId: exam.id,
        roomId: candidate.room.id,
        timeslotId: candidate.timeslot.id,
        invigilatorId: candidate.invigilator.id,
        enrolledCount: candidate.studentCount,
        reason: generateReason(candidate, settings),
      };
      
      // Update invigilator load
      invigilatorLoads.set(
        candidate.invigilator.id,
        (invigilatorLoads.get(candidate.invigilator.id) || 0) + 1
      );
      
      // Recurse to next exam
      const result = backtrack(
        examIndex + 1,
        [...currentAssignments, assignment]
      );
      
      if (result) {
        return result; // Solution found
      }
      
      // Backtrack
      backtracks++;
      invigilatorLoads.set(
        candidate.invigilator.id,
        (invigilatorLoads.get(candidate.invigilator.id) || 0) - 1
      );
      
      trace.push({
        step: ++step,
        action: "BACKTRACK",
        examId: exam.id,
        note: `Backtracking from ${exam.code}, trying next candidate`,
      });
    }
    
    return null; // No valid assignment found for this exam
  }
  
  // Start the search
  const result = backtrack(0, []);
  const endTime = Date.now();
  
  return {
    success: result !== null,
    assignments: result || [],
    trace,
    conflicts,
    stats: {
      statesExplored: step,
      backtracks,
      startTime,
      endTime,
    },
  };
}

// ========================================
// Reason Generation for G5 (Explainability)
// ========================================

function generateReason(
  candidate: CandidateAssignment,
  settings: SchedulerSettings
): string {
  const reasons: string[] = [];
  
  // Room selection reason
  const wastePercentage = Math.round(
    ((candidate.room.capacity - candidate.studentCount) / candidate.room.capacity) * 100
  );
  reasons.push(
    `Room ${candidate.room.name} selected: capacity ${candidate.room.capacity} for ${candidate.studentCount} students (${wastePercentage}% spare)`
  );
  
  // Timeslot reason
  reasons.push(
    `Timeslot ${candidate.timeslot.label} (${candidate.timeslot.date}): no student conflicts detected`
  );
  
  // Invigilator reason
  reasons.push(
    `${candidate.invigilator.name} assigned: ${candidate.invigilator.dailyLoad}/${candidate.invigilator.maxLoad} current load`
  );
  
  return reasons.join(". ");
}
