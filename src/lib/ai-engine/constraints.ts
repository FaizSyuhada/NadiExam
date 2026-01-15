/**
 * A1 - Knowledge Representation: Constraint System
 * 
 * This module implements the constraint checking logic for exam scheduling.
 * Each constraint is modeled as a NEGATIVE CONSTRAINT (Contradiction detection).
 * 
 * Constraints:
 * - ROOM_CAPACITY: Enrolled students must not exceed room capacity
 * - DOUBLE_BOOKING: A room cannot host multiple exams at same timeslot
 * - STUDENT_CLASH: Students cannot have overlapping exams
 * - FORBIDDEN_SLOT: Exams cannot be scheduled in forbidden timeslots
 * - INVIGILATOR_LOAD: Invigilators cannot exceed their daily limit
 */

import {
  Exam,
  Room,
  Timeslot,
  Invigilator,
  ScheduleAssignment,
  ConstraintViolation,
  ConstraintType,
} from "../types";
import { getCommonStudents } from "../demo-data";

// ========================================
// Constraint Checking Interface
// ========================================

export interface ConstraintCheckResult {
  ok: boolean;
  constraint: ConstraintType;
  detail: string;
}

// ========================================
// Individual Constraint Checkers
// ========================================

/**
 * Check ROOM_CAPACITY constraint
 * Rule: Room capacity >= number of enrolled students
 */
export function checkRoomCapacity(
  exam: Exam,
  room: Room,
  studentCount: number
): ConstraintCheckResult {
  const ok = room.capacity >= studentCount;
  return {
    ok,
    constraint: "ROOM_CAPACITY",
    detail: ok
      ? `Room ${room.name} (capacity: ${room.capacity}) can accommodate ${studentCount} students`
      : `VIOLATION: Room ${room.name} has capacity ${room.capacity}, but exam has ${studentCount} students`,
  };
}

/**
 * Check DOUBLE_BOOKING constraint
 * Rule: No two exams can be in the same room at the same timeslot
 */
export function checkDoubleBooking(
  room: Room,
  timeslot: Timeslot,
  currentAssignments: ScheduleAssignment[]
): ConstraintCheckResult {
  const conflict = currentAssignments.find(
    (a) => a.roomId === room.id && a.timeslotId === timeslot.id
  );
  
  const ok = !conflict;
  return {
    ok,
    constraint: "DOUBLE_BOOKING",
    detail: ok
      ? `Room ${room.name} is available at ${timeslot.label} on ${timeslot.date}`
      : `VIOLATION: Room ${room.name} is already booked for exam ${conflict?.examId} at this time`,
  };
}

/**
 * Check STUDENT_CLASH constraint
 * Rule: No student should have two exams at the same timeslot
 */
export function checkStudentClash(
  exam: Exam,
  timeslot: Timeslot,
  currentAssignments: ScheduleAssignment[],
  exams: Exam[]
): ConstraintCheckResult {
  // Find all exams scheduled at the same timeslot
  const sameTimeAssignments = currentAssignments.filter(
    (a) => a.timeslotId === timeslot.id
  );
  
  // Check if any of those exams share students with the current exam
  for (const assignment of sameTimeAssignments) {
    const otherExam = exams.find((e) => e.id === assignment.examId);
    if (!otherExam) continue;
    
    const commonStudents = getCommonStudents(exam.id, otherExam.id);
    if (commonStudents.length > 0) {
      return {
        ok: false,
        constraint: "STUDENT_CLASH",
        detail: `VIOLATION: ${commonStudents.length} student(s) enrolled in both ${exam.code} and ${otherExam.code} (e.g., ${commonStudents[0].name})`,
      };
    }
  }
  
  return {
    ok: true,
    constraint: "STUDENT_CLASH",
    detail: `No student conflicts detected for ${exam.code} at ${timeslot.label} on ${timeslot.date}`,
  };
}

/**
 * Check FORBIDDEN_SLOT constraint
 * Rule: Exams cannot be scheduled in forbidden timeslots
 */
export function checkForbiddenSlot(
  timeslot: Timeslot
): ConstraintCheckResult {
  const ok = !timeslot.isForbidden;
  return {
    ok,
    constraint: "FORBIDDEN_SLOT",
    detail: ok
      ? `Timeslot ${timeslot.label} on ${timeslot.date} is available`
      : `VIOLATION: Timeslot ${timeslot.label} on ${timeslot.date} is marked as forbidden`,
  };
}

/**
 * Check INVIGILATOR_LOAD constraint
 * Rule: Invigilator's daily assignments cannot exceed their max load
 */
export function checkInvigilatorLoad(
  invigilator: Invigilator,
  timeslot: Timeslot,
  currentAssignments: ScheduleAssignment[]
): ConstraintCheckResult {
  // Count existing assignments for this invigilator on the same day
  const sameDay = currentAssignments.filter((a) => {
    // We need to check if timeslot is on the same day
    // For simplicity, we'll count all assignments by this invigilator
    return a.invigilatorId === invigilator.id;
  });
  
  // Also check if invigilator is available
  if (invigilator.availability === "Unavailable") {
    return {
      ok: false,
      constraint: "INVIGILATOR_LOAD",
      detail: `VIOLATION: ${invigilator.name} is marked as unavailable`,
    };
  }
  
  const currentLoad = sameDay.length;
  const ok = currentLoad < invigilator.maxLoad;
  
  return {
    ok,
    constraint: "INVIGILATOR_LOAD",
    detail: ok
      ? `${invigilator.name} has ${currentLoad}/${invigilator.maxLoad} assignments (can take more)`
      : `VIOLATION: ${invigilator.name} has reached max load of ${invigilator.maxLoad} assignments`,
  };
}

/**
 * Check if invigilator is already assigned at the same timeslot
 */
export function checkInvigilatorDoubleBooking(
  invigilator: Invigilator,
  timeslot: Timeslot,
  currentAssignments: ScheduleAssignment[]
): ConstraintCheckResult {
  const conflict = currentAssignments.find(
    (a) => a.invigilatorId === invigilator.id && a.timeslotId === timeslot.id
  );
  
  const ok = !conflict;
  return {
    ok,
    constraint: "INVIGILATOR_LOAD",
    detail: ok
      ? `${invigilator.name} is available at ${timeslot.label} on ${timeslot.date}`
      : `VIOLATION: ${invigilator.name} is already assigned to another exam at this time`,
  };
}

// ========================================
// Combined Constraint Checker
// ========================================

export interface CandidateAssignment {
  exam: Exam;
  room: Room;
  timeslot: Timeslot;
  invigilator: Invigilator;
  studentCount: number;
}

export interface ValidationResult {
  isValid: boolean;
  checks: ConstraintCheckResult[];
  violations: ConstraintViolation[];
}

/**
 * Validate a candidate assignment against all constraints
 * Returns true if all constraints are satisfied (no Contradiction)
 */
export function validateAssignment(
  candidate: CandidateAssignment,
  currentAssignments: ScheduleAssignment[],
  exams: Exam[],
  checkForbidden: boolean = true
): ValidationResult {
  const checks: ConstraintCheckResult[] = [];
  const violations: ConstraintViolation[] = [];
  
  // 1. Check ROOM_CAPACITY
  const capacityCheck = checkRoomCapacity(
    candidate.exam,
    candidate.room,
    candidate.studentCount
  );
  checks.push(capacityCheck);
  if (!capacityCheck.ok) {
    violations.push({
      constraint: "ROOM_CAPACITY",
      message: capacityCheck.detail,
      examId: candidate.exam.id,
      details: {
        roomCapacity: candidate.room.capacity,
        studentCount: candidate.studentCount,
      },
    });
  }
  
  // 2. Check DOUBLE_BOOKING
  const bookingCheck = checkDoubleBooking(
    candidate.room,
    candidate.timeslot,
    currentAssignments
  );
  checks.push(bookingCheck);
  if (!bookingCheck.ok) {
    violations.push({
      constraint: "DOUBLE_BOOKING",
      message: bookingCheck.detail,
      examId: candidate.exam.id,
      details: {
        roomId: candidate.room.id,
        timeslotId: candidate.timeslot.id,
      },
    });
  }
  
  // 3. Check STUDENT_CLASH
  const clashCheck = checkStudentClash(
    candidate.exam,
    candidate.timeslot,
    currentAssignments,
    exams
  );
  checks.push(clashCheck);
  if (!clashCheck.ok) {
    violations.push({
      constraint: "STUDENT_CLASH",
      message: clashCheck.detail,
      examId: candidate.exam.id,
      details: {
        timeslotId: candidate.timeslot.id,
      },
    });
  }
  
  // 4. Check FORBIDDEN_SLOT (if enabled)
  if (checkForbidden) {
    const forbiddenCheck = checkForbiddenSlot(candidate.timeslot);
    checks.push(forbiddenCheck);
    if (!forbiddenCheck.ok) {
      violations.push({
        constraint: "FORBIDDEN_SLOT",
        message: forbiddenCheck.detail,
        examId: candidate.exam.id,
        details: {
          timeslotId: candidate.timeslot.id,
        },
      });
    }
  }
  
  // 5. Check INVIGILATOR_LOAD
  const loadCheck = checkInvigilatorLoad(
    candidate.invigilator,
    candidate.timeslot,
    currentAssignments
  );
  checks.push(loadCheck);
  if (!loadCheck.ok) {
    violations.push({
      constraint: "INVIGILATOR_LOAD",
      message: loadCheck.detail,
      examId: candidate.exam.id,
      details: {
        invigilatorId: candidate.invigilator.id,
        currentLoad: currentAssignments.filter(
          (a) => a.invigilatorId === candidate.invigilator.id
        ).length,
        maxLoad: candidate.invigilator.maxLoad,
      },
    });
  }
  
  // 6. Check INVIGILATOR_DOUBLE_BOOKING
  const invBookingCheck = checkInvigilatorDoubleBooking(
    candidate.invigilator,
    candidate.timeslot,
    currentAssignments
  );
  checks.push(invBookingCheck);
  if (!invBookingCheck.ok) {
    violations.push({
      constraint: "INVIGILATOR_LOAD",
      message: invBookingCheck.detail,
      examId: candidate.exam.id,
      details: {
        invigilatorId: candidate.invigilator.id,
        timeslotId: candidate.timeslot.id,
      },
    });
  }
  
  return {
    isValid: violations.length === 0,
    checks,
    violations,
  };
}

/**
 * Contradiction detection - returns true if assignment causes a contradiction
 * This is the core of A1 Knowledge Representation
 */
export function causesContradiction(
  candidate: CandidateAssignment,
  currentAssignments: ScheduleAssignment[],
  exams: Exam[],
  checkForbidden: boolean = true
): boolean {
  const result = validateAssignment(candidate, currentAssignments, exams, checkForbidden);
  return !result.isValid;
}
