// ========================================
// Core Data Types for NadiExam
// ========================================

export interface Exam {
  id: string;
  code: string;
  name: string;
  duration: number; // in hours
  enrolledStudents: string[]; // student IDs
}

export interface Room {
  id: string;
  name: string;
  capacity: number;
  building: string;
  availability: "Available" | "In Use" | "Maintenance";
}

export interface Student {
  id: string;
  studentId: string;
  name: string;
  registeredExams: string[]; // exam IDs
}

export interface Invigilator {
  id: string;
  name: string;
  availability: "Available" | "Limited" | "Unavailable";
  dailyLoad: number; // current daily assignments
  maxLoad: number; // maximum assignments per day
}

export interface Timeslot {
  id: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:MM
  endTime: string; // HH:MM
  label: string; // e.g., "Morning", "Afternoon"
  isForbidden: boolean;
}

// ========================================
// Settings & Configuration
// ========================================

export interface SchedulerSettings {
  avoidForbiddenTimeslots: boolean;
  balanceInvigilatorLoad: boolean;
  minimizeRoomWastage: boolean;
}

export interface GeneralSettings {
  academicYear: string;
  semester: string;
  institutionName: string;
  emailNotifications: boolean;
  conflictAlerts: boolean;
}

// ========================================
// Constraint Types (A1 - Knowledge Representation)
// ========================================

export type ConstraintType =
  | "ROOM_CAPACITY"
  | "DOUBLE_BOOKING"
  | "STUDENT_CLASH"
  | "FORBIDDEN_SLOT"
  | "INVIGILATOR_LOAD";

export interface Constraint {
  type: ConstraintType;
  name: string;
  description: string;
  isHard: boolean; // Hard constraints must never be violated
}

export interface ConstraintViolation {
  constraint: ConstraintType;
  message: string;
  examId: string;
  details: Record<string, unknown>;
}

// ========================================
// Schedule Assignment
// ========================================

export interface ScheduleAssignment {
  examId: string;
  roomId: string;
  timeslotId: string;
  invigilatorId: string;
  enrolledCount: number;
  reason: string; // Explanation for G5
}

// ========================================
// Scheduling Engine Output (Contract)
// ========================================

export interface InvigilatorRosterEntry {
  invigilatorId: string;
  assignments: Array<{
    examId: string;
    timeslotId: string;
    roomId: string;
  }>;
  total: number;
  maxPerDay: number;
}

export interface ConflictRecord {
  step: number;
  examId: string;
  attempted: {
    roomId: string;
    timeslotId: string;
    invigilatorId: string;
  };
  constraint: ConstraintType;
  message: string;
}

export type TraceAction = "TRY" | "ACCEPT" | "REJECT" | "BACKTRACK" | "DONE";

export interface TraceEntry {
  step: number;
  action: TraceAction;
  examId: string;
  candidate?: {
    roomId: string;
    timeslotId: string;
    invigilatorId: string;
  };
  checks?: Array<{
    constraint: string;
    ok: boolean;
    detail: string;
  }>;
  note?: string;
}

export interface ScheduleResult {
  success: boolean;
  timetable: ScheduleAssignment[];
  invigilatorRoster: InvigilatorRosterEntry[];
  conflicts: ConflictRecord[];
  trace: TraceEntry[];
  metrics: {
    totalTime: number;
    statesExplored: number;
    backtracks: number;
    averageRoomUtilization: number;
    invigilatorLoadVariance: number;
  };
}

// ========================================
// Timetable State
// ========================================

export type TimetableStatus = "Draft" | "Approved" | "Published";

export interface TimetableVersion {
  version: string;
  status: TimetableStatus;
  publishedAt?: string;
  publishedBy?: string;
  assignments: ScheduleAssignment[];
}

// ========================================
// Activity Log
// ========================================

export interface ActivityLogEntry {
  id: string;
  type: "upload" | "scheduler" | "room" | "exam" | "invigilator" | "publish";
  title: string;
  description: string;
  timestamp: string;
}

// ========================================
// Guided Scheduling Constraints (Lock)
// ========================================

export interface LockConstraints {
  roomId?: string;
  date?: string;
  timeslotId?: string;
  invigilatorId?: string;
  priorityExamIds?: string[];
}
