import {
  Exam,
  Room,
  Student,
  Invigilator,
  Timeslot,
  ActivityLogEntry,
  Constraint,
  SchedulerSettings,
  GeneralSettings,
} from "./types";

// ========================================
// DEMO EXAMS (7 exams with overlapping enrollments)
// ========================================

export const demoExams: Exam[] = [
  {
    id: "exam-1",
    code: "CS401",
    name: "Database Systems",
    duration: 3,
    enrolledStudents: ["st-1", "st-3", "st-5", "st-7"], // 85 students total in real scenario
  },
  {
    id: "exam-2",
    code: "CS302",
    name: "Operating Systems",
    duration: 2.5,
    enrolledStudents: ["st-1", "st-4", "st-5", "st-8"], // 92 students
  },
  {
    id: "exam-3",
    code: "MA201",
    name: "Discrete Mathematics",
    duration: 2,
    enrolledStudents: ["st-1", "st-2", "st-6"], // 78 students
  },
  {
    id: "exam-4",
    code: "CS205",
    name: "Data Structures",
    duration: 3,
    enrolledStudents: ["st-2", "st-3", "st-5", "st-8"], // 110 students
  },
  {
    id: "exam-5",
    code: "EE301",
    name: "Digital Electronics",
    duration: 2,
    enrolledStudents: ["st-2", "st-4", "st-7"], // 64 students
  },
  {
    id: "exam-6",
    code: "CS501",
    name: "Artificial Intelligence",
    duration: 3,
    enrolledStudents: ["st-3", "st-6", "st-7"], // 57 students
  },
];

// For display purposes - scaled numbers
export const examStudentCounts: Record<string, number> = {
  "exam-1": 85,
  "exam-2": 92,
  "exam-3": 78,
  "exam-4": 110,
  "exam-5": 64,
  "exam-6": 57,
};

// ========================================
// DEMO ROOMS (6 rooms with varying capacities)
// ========================================

export const demoRooms: Room[] = [
  {
    id: "room-1",
    name: "Hall A",
    capacity: 120,
    building: "Main Building",
    availability: "Available",
  },
  {
    id: "room-2",
    name: "Hall B",
    capacity: 100,
    building: "Main Building",
    availability: "Available",
  },
  {
    id: "room-3",
    name: "Lab 201",
    capacity: 40,
    building: "Engineering Block",
    availability: "Available",
  },
  {
    id: "room-4",
    name: "Auditorium",
    capacity: 250,
    building: "Central Block",
    availability: "Available",
  },
  {
    id: "room-5",
    name: "Room 305",
    capacity: 60,
    building: "Science Block",
    availability: "In Use",
  },
  {
    id: "room-6",
    name: "Lab 102",
    capacity: 35,
    building: "Computer Center",
    availability: "Available",
  },
];

// ========================================
// DEMO STUDENTS (8 students with overlapping exam registrations)
// ========================================

export const demoStudents: Student[] = [
  {
    id: "st-1",
    studentId: "ST2024001",
    name: "Ahmed Hassan",
    registeredExams: ["exam-1", "exam-2", "exam-3"], // CS401, CS302, MA201
  },
  {
    id: "st-2",
    studentId: "ST2024002",
    name: "Fatima Ali",
    registeredExams: ["exam-4", "exam-5", "exam-3"], // CS205, EE301, MA201
  },
  {
    id: "st-3",
    studentId: "ST2024003",
    name: "Omar Ibrahim",
    registeredExams: ["exam-1", "exam-4", "exam-6"], // CS401, CS205, CS501
  },
  {
    id: "st-4",
    studentId: "ST2024004",
    name: "Layla Mohammed",
    registeredExams: ["exam-2", "exam-5"], // CS302, EE301
  },
  {
    id: "st-5",
    studentId: "ST2024005",
    name: "Khaled Youssef",
    registeredExams: ["exam-1", "exam-2", "exam-4"], // CS401, CS302, CS205
  },
  {
    id: "st-6",
    studentId: "ST2024006",
    name: "Maryam Nasser",
    registeredExams: ["exam-3", "exam-6"], // MA201, CS501
  },
  {
    id: "st-7",
    studentId: "ST2024007",
    name: "Abdullah Salem",
    registeredExams: ["exam-1", "exam-5", "exam-6"], // CS401, EE301, CS501
  },
  {
    id: "st-8",
    studentId: "ST2024008",
    name: "Sara Khalil",
    registeredExams: ["exam-4", "exam-2"], // CS205, CS302
  },
];

// ========================================
// DEMO INVIGILATORS (6 invigilators with load limits)
// ========================================

export const demoInvigilators: Invigilator[] = [
  {
    id: "inv-1",
    name: "Dr. Sarah Ahmed",
    availability: "Available",
    dailyLoad: 0,
    maxLoad: 3,
  },
  {
    id: "inv-2",
    name: "Prof. Mohammed Ali",
    availability: "Available",
    dailyLoad: 0,
    maxLoad: 2,
  },
  {
    id: "inv-3",
    name: "Dr. Nadia Ibrahim",
    availability: "Limited",
    dailyLoad: 0,
    maxLoad: 3,
  },
  {
    id: "inv-4",
    name: "Dr. Khaled Hassan",
    availability: "Available",
    dailyLoad: 0,
    maxLoad: 3,
  },
  {
    id: "inv-5",
    name: "Prof. Layla Youssef",
    availability: "Available",
    dailyLoad: 0,
    maxLoad: 4,
  },
  {
    id: "inv-6",
    name: "Dr. Omar Nasser",
    availability: "Unavailable",
    dailyLoad: 0,
    maxLoad: 2,
  },
];

// ========================================
// DEMO TIMESLOTS (Exam period: May 15-20, 2024)
// ========================================

export const demoTimeslots: Timeslot[] = [
  // Day 1: May 15
  {
    id: "ts-1",
    date: "2024-05-15",
    startTime: "09:00",
    endTime: "12:00",
    label: "Morning",
    isForbidden: false,
  },
  {
    id: "ts-2",
    date: "2024-05-15",
    startTime: "14:00",
    endTime: "17:00",
    label: "Afternoon",
    isForbidden: false,
  },
  // Day 2: May 16
  {
    id: "ts-3",
    date: "2024-05-16",
    startTime: "09:00",
    endTime: "12:00",
    label: "Morning",
    isForbidden: false,
  },
  {
    id: "ts-4",
    date: "2024-05-16",
    startTime: "14:00",
    endTime: "17:00",
    label: "Afternoon",
    isForbidden: false,
  },
  // Day 3: May 17
  {
    id: "ts-5",
    date: "2024-05-17",
    startTime: "09:00",
    endTime: "12:00",
    label: "Morning",
    isForbidden: false,
  },
  {
    id: "ts-6",
    date: "2024-05-17",
    startTime: "14:00",
    endTime: "17:00",
    label: "Afternoon",
    isForbidden: true, // Forbidden slot - University event
  },
  // Day 4: May 18 (Weekend - Limited)
  {
    id: "ts-7",
    date: "2024-05-18",
    startTime: "09:00",
    endTime: "12:00",
    label: "Morning",
    isForbidden: true, // Forbidden - Weekend
  },
  // Day 5: May 19 (Weekend)
  {
    id: "ts-8",
    date: "2024-05-19",
    startTime: "09:00",
    endTime: "12:00",
    label: "Morning",
    isForbidden: true, // Forbidden - Weekend
  },
  // Day 6: May 20
  {
    id: "ts-9",
    date: "2024-05-20",
    startTime: "09:00",
    endTime: "12:00",
    label: "Morning",
    isForbidden: false,
  },
  {
    id: "ts-10",
    date: "2024-05-20",
    startTime: "14:00",
    endTime: "17:00",
    label: "Afternoon",
    isForbidden: false,
  },
];

// ========================================
// CONSTRAINT DEFINITIONS (A1 - Knowledge Representation)
// ========================================

export const constraintDefinitions: Constraint[] = [
  {
    type: "ROOM_CAPACITY",
    name: "Room Capacity",
    description: "The number of enrolled students must not exceed room capacity",
    isHard: true,
  },
  {
    type: "DOUBLE_BOOKING",
    name: "Room Double Booking",
    description: "A room cannot host two exams at the same timeslot",
    isHard: true,
  },
  {
    type: "STUDENT_CLASH",
    name: "Student Clash",
    description: "A student cannot have two exams scheduled at the same time",
    isHard: true,
  },
  {
    type: "FORBIDDEN_SLOT",
    name: "Forbidden Timeslot",
    description: "Exams cannot be scheduled during forbidden time periods",
    isHard: true,
  },
  {
    type: "INVIGILATOR_LOAD",
    name: "Invigilator Load Limit",
    description: "An invigilator cannot exceed their maximum daily assignments",
    isHard: true,
  },
];

// ========================================
// DEFAULT SETTINGS
// ========================================

export const defaultSchedulerSettings: SchedulerSettings = {
  avoidForbiddenTimeslots: true,
  balanceInvigilatorLoad: true,
  minimizeRoomWastage: true,
};

export const defaultGeneralSettings: GeneralSettings = {
  academicYear: "2023-2024",
  semester: "Fall",
  institutionName: "University of Technology",
  emailNotifications: true,
  conflictAlerts: true,
};

// ========================================
// DEMO ACTIVITY LOG
// ========================================

export const demoActivityLog: ActivityLogEntry[] = [
  {
    id: "act-1",
    type: "upload",
    title: "Data uploaded",
    description: "Student enrollment data imported",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
  },
  {
    id: "act-2",
    type: "scheduler",
    title: "Scheduler last run",
    description: "Timetable generation completed successfully",
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5 hours ago
  },
  {
    id: "act-3",
    type: "room",
    title: "Room data updated",
    description: "Capacity changes for Building A",
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
  },
  {
    id: "act-4",
    type: "exam",
    title: "Exam added",
    description: "CS401 - Database Systems",
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
  },
  {
    id: "act-5",
    type: "invigilator",
    title: "Invigilator assigned",
    description: "Dr. Sarah Ahmed assigned to 3 exams",
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
  },
];

// ========================================
// HELPER FUNCTIONS
// ========================================

export function getExamById(id: string): Exam | undefined {
  return demoExams.find((e) => e.id === id);
}

export function getRoomById(id: string): Room | undefined {
  return demoRooms.find((r) => r.id === id);
}

export function getStudentById(id: string): Student | undefined {
  return demoStudents.find((s) => s.id === id);
}

export function getInvigilatorById(id: string): Invigilator | undefined {
  return demoInvigilators.find((i) => i.id === id);
}

export function getTimeslotById(id: string): Timeslot | undefined {
  return demoTimeslots.find((t) => t.id === id);
}

export function formatTimeslot(timeslot: Timeslot): string {
  const date = new Date(timeslot.date);
  const options: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
    year: "numeric",
  };
  return `${date.toLocaleDateString("en-US", options)} - ${timeslot.label} (${timeslot.startTime})`;
}

export function getStudentsForExam(examId: string): Student[] {
  return demoStudents.filter((s) => s.registeredExams.includes(examId));
}

export function getExamsForStudent(studentId: string): Exam[] {
  const student = demoStudents.find((s) => s.id === studentId);
  if (!student) return [];
  return demoExams.filter((e) => student.registeredExams.includes(e.id));
}

// Get students who have both exams (for clash detection)
export function getCommonStudents(examId1: string, examId2: string): Student[] {
  return demoStudents.filter(
    (s) =>
      s.registeredExams.includes(examId1) && s.registeredExams.includes(examId2)
  );
}

// Check if two exams share students
export function examsShareStudents(examId1: string, examId2: string): boolean {
  return getCommonStudents(examId1, examId2).length > 0;
}
