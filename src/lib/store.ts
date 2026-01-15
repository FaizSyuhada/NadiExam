"use client";

import { create } from "zustand";
import {
  Exam,
  Room,
  Student,
  Invigilator,
  Timeslot,
  ScheduleResult,
  SchedulerSettings,
  GeneralSettings,
  TimetableVersion,
  ActivityLogEntry,
  LockConstraints,
} from "./types";
import {
  demoExams,
  demoRooms,
  demoStudents,
  demoInvigilators,
  demoTimeslots,
  demoActivityLog,
  defaultSchedulerSettings,
  defaultGeneralSettings,
  examStudentCounts,
} from "./demo-data";

interface AppState {
  // Data
  exams: Exam[];
  rooms: Room[];
  students: Student[];
  invigilators: Invigilator[];
  timeslots: Timeslot[];
  activityLog: ActivityLogEntry[];
  
  // Settings
  schedulerSettings: SchedulerSettings;
  generalSettings: GeneralSettings;
  
  // Scheduling
  scheduleResult: ScheduleResult | null;
  isScheduling: boolean;
  schedulingProgress: number;
  timetableVersion: TimetableVersion | null;
  lockConstraints: LockConstraints;
  
  // UI State
  schedulingMode: "automatic" | "guided";
  
  // Actions
  setExams: (exams: Exam[]) => void;
  addExam: (exam: Exam) => void;
  updateExam: (id: string, exam: Partial<Exam>) => void;
  deleteExam: (id: string) => void;
  
  setRooms: (rooms: Room[]) => void;
  addRoom: (room: Room) => void;
  updateRoom: (id: string, room: Partial<Room>) => void;
  deleteRoom: (id: string) => void;
  
  setInvigilators: (invigilators: Invigilator[]) => void;
  addInvigilator: (invigilator: Invigilator) => void;
  updateInvigilator: (id: string, invigilator: Partial<Invigilator>) => void;
  deleteInvigilator: (id: string) => void;
  
  setSchedulerSettings: (settings: SchedulerSettings) => void;
  setGeneralSettings: (settings: GeneralSettings) => void;
  
  setScheduleResult: (result: ScheduleResult | null) => void;
  setIsScheduling: (isScheduling: boolean) => void;
  setSchedulingProgress: (progress: number) => void;
  
  setTimetableVersion: (version: TimetableVersion | null) => void;
  approveTimetable: () => void;
  publishTimetable: () => void;
  clearTimetable: () => void;
  
  setLockConstraints: (constraints: LockConstraints) => void;
  setSchedulingMode: (mode: "automatic" | "guided") => void;
  
  addActivity: (activity: Omit<ActivityLogEntry, "id" | "timestamp">) => void;
  
  // Utility
  getExamStudentCount: (examId: string) => number;
  resetToDemo: () => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  // Initialize with demo data
  exams: demoExams,
  rooms: demoRooms,
  students: demoStudents,
  invigilators: demoInvigilators,
  timeslots: demoTimeslots,
  activityLog: demoActivityLog,
  
  schedulerSettings: defaultSchedulerSettings,
  generalSettings: defaultGeneralSettings,
  
  scheduleResult: null,
  isScheduling: false,
  schedulingProgress: 0,
  timetableVersion: null,
  lockConstraints: {},
  
  schedulingMode: "automatic",
  
  // Exam actions
  setExams: (exams) => set({ exams }),
  addExam: (exam) => set((state) => ({ exams: [...state.exams, exam] })),
  updateExam: (id, examUpdate) =>
    set((state) => ({
      exams: state.exams.map((e) => (e.id === id ? { ...e, ...examUpdate } : e)),
    })),
  deleteExam: (id) =>
    set((state) => ({ exams: state.exams.filter((e) => e.id !== id) })),
  
  // Room actions
  setRooms: (rooms) => set({ rooms }),
  addRoom: (room) => set((state) => ({ rooms: [...state.rooms, room] })),
  updateRoom: (id, roomUpdate) =>
    set((state) => ({
      rooms: state.rooms.map((r) => (r.id === id ? { ...r, ...roomUpdate } : r)),
    })),
  deleteRoom: (id) =>
    set((state) => ({ rooms: state.rooms.filter((r) => r.id !== id) })),
  
  // Invigilator actions
  setInvigilators: (invigilators) => set({ invigilators }),
  addInvigilator: (invigilator) =>
    set((state) => ({ invigilators: [...state.invigilators, invigilator] })),
  updateInvigilator: (id, invigilatorUpdate) =>
    set((state) => ({
      invigilators: state.invigilators.map((i) =>
        i.id === id ? { ...i, ...invigilatorUpdate } : i
      ),
    })),
  deleteInvigilator: (id) =>
    set((state) => ({
      invigilators: state.invigilators.filter((i) => i.id !== id),
    })),
  
  // Settings actions
  setSchedulerSettings: (settings) => set({ schedulerSettings: settings }),
  setGeneralSettings: (settings) => set({ generalSettings: settings }),
  
  // Scheduling actions
  setScheduleResult: (result) => set({ scheduleResult: result }),
  setIsScheduling: (isScheduling) => set({ isScheduling }),
  setSchedulingProgress: (progress) => set({ schedulingProgress: progress }),
  
  // Timetable actions
  setTimetableVersion: (version) => set({ timetableVersion: version }),
  approveTimetable: () =>
    set((state) => ({
      timetableVersion: state.timetableVersion
        ? { ...state.timetableVersion, status: "Approved" }
        : null,
    })),
  publishTimetable: () =>
    set((state) => ({
      timetableVersion: state.timetableVersion
        ? {
            ...state.timetableVersion,
            status: "Published",
            publishedAt: new Date().toISOString(),
            publishedBy: "Admin User",
          }
        : null,
    })),
  clearTimetable: () =>
    set({
      scheduleResult: null,
      timetableVersion: null,
      schedulingProgress: 0,
    }),
  
  setLockConstraints: (constraints) => set({ lockConstraints: constraints }),
  setSchedulingMode: (mode) => set({ schedulingMode: mode }),
  
  // Activity log
  addActivity: (activity) =>
    set((state) => ({
      activityLog: [
        {
          ...activity,
          id: `act-${Date.now()}`,
          timestamp: new Date().toISOString(),
        },
        ...state.activityLog,
      ],
    })),
  
  // Utility
  getExamStudentCount: (examId) => {
    return examStudentCounts[examId] || get().exams.find((e) => e.id === examId)?.enrolledStudents.length || 0;
  },
  
  resetToDemo: () =>
    set({
      exams: demoExams,
      rooms: demoRooms,
      students: demoStudents,
      invigilators: demoInvigilators,
      timeslots: demoTimeslots,
      activityLog: demoActivityLog,
      schedulerSettings: defaultSchedulerSettings,
      generalSettings: defaultGeneralSettings,
      scheduleResult: null,
      isScheduling: false,
      schedulingProgress: 0,
      timetableVersion: null,
      lockConstraints: {},
    }),
}));
