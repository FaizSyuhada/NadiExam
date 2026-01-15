/**
 * NadiExam AI Engine
 * 
 * A Classical AI-based Exam Scheduling System
 * 
 * Architecture:
 * - A1: Knowledge Representation (constraints.ts) - Constraint modeling and contradiction detection
 * - A2: State Space Search (search.ts) - Backtracking DFS with heuristics
 * - A3: Intelligent Agent (agent.ts) - PEAS model implementation
 * 
 * Goals:
 * - G1: Zero student timetable clashes (HARD CONSTRAINT)
 * - G2: Fast planning under 3 seconds
 * - G3: Efficient room use (≤10% empty seats)
 * - G4: Fair invigilator load distribution
 * - G5: Clear audit trail for explainability
 */

export * from "./constraints";
export * from "./search";
export * from "./agent";
