# NadiExam - AI-Based Clash-Free Exam Scheduling

An intelligent exam scheduling system that uses **classical AI techniques** to automatically generate conflict-free examination timetables.

## Project Overview

NadiExam is an academic project demonstrating the application of classical AI concepts:
- **Knowledge Representation** - Constraint modeling with contradiction detection
- **State Space Search** - Backtracking DFS with heuristics (MCV/LCV)
- **Intelligent Agents** - Goal-based agent using the PEAS model

**No machine learning or LLM APIs are used.** This is a pure classical AI implementation.

## Goals (G1-G5)

| Goal | Description | Type |
|------|-------------|------|
| G1 | Zero student timetable clashes | Hard Constraint |
| G2 | Fast planning (<3 seconds) | Performance |
| G3 | Efficient room use (≤10% empty seats) | Optimization |
| G4 | Fair invigilator load distribution | Optimization |
| G5 | Clear audit trail for decisions | Explainability |

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **State Management**: Zustand
- **Validation**: Zod + React Hook Form

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd nadiexam

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Dashboard
│   ├── exams/             # Exam management
│   ├── rooms/             # Room management
│   ├── students/          # Student listing
│   ├── invigilators/      # Invigilator management
│   ├── scheduler/         # AI scheduling interface
│   ├── timetable/         # Generated timetable view
│   ├── reports/           # Validation & export
│   ├── settings/          # System settings
│   ├── ai-logic/          # AI explanation for lecturers
│   └── about/             # Project information
├── components/
│   ├── layout/            # Sidebar, Header
│   └── ui/                # shadcn/ui components
└── lib/
    ├── ai-engine/         # Core AI implementation
    │   ├── constraints.ts # A1: Knowledge Representation
    │   ├── search.ts      # A2: State Space Search
    │   └── agent.ts       # A3: Intelligent Agent (PEAS)
    ├── types.ts           # TypeScript type definitions
    ├── demo-data.ts       # Demo dataset
    └── store.ts           # Zustand state management
```

## AI Architecture

### A1 - Knowledge Representation (Constraints)

Scheduling rules are modeled as **negative constraints**:

| Constraint | Type | Description |
|------------|------|-------------|
| ROOM_CAPACITY | Hard | Room capacity ≥ enrolled students |
| DOUBLE_BOOKING | Hard | No two exams in same room at same time |
| STUDENT_CLASH | Hard | No student has overlapping exams |
| FORBIDDEN_SLOT | Hard | Respect blocked time periods |
| INVIGILATOR_LOAD | Hard | Invigilator cannot exceed daily limit |

### A2 - State Space Search

- **Algorithm**: Backtracking DFS
- **Variable Ordering**: Most Constrained Variable (MCV)
- **Value Ordering**: Least Constraining Value (LCV)
- **Pruning**: Early constraint checking

### A3 - Intelligent Agent (PEAS)

| Component | Description |
|-----------|-------------|
| **P**erformance | G1-G5 goals |
| **E**nvironment | Exams, rooms, timeslots, invigilators |
| **A**ctuators | Schedule exam, reject invalid, update workload |
| **S**ensors | Data input, constraint signals, schedule state |

## Demo Data

The system includes built-in demo data:
- 6 exams with overlapping student enrollments
- 6 rooms with varying capacities
- 8 students with registered exams
- 6 invigilators with load limits
- 10 timeslots (some forbidden)

## Usage

1. **Dashboard**: View system overview and recent activity
2. **Exams/Rooms/Invigilators**: Manage scheduling resources
3. **Scheduler**: Configure and run the AI scheduling engine
4. **Timetable**: View, approve, and publish the generated schedule
5. **Reports**: Validate and export scheduling reports
6. **AI Logic**: Understand the AI reasoning (for presentation)

## Features

- Automatic conflict-free scheduling
- Step-by-step constraint validation
- Real-time audit trail
- Guided scheduling mode with lock constraints
- Export timetables to CSV
- Comprehensive conflict detection
- Invigilator workload balancing
- Room utilization optimization

## Course Information

- **Course**: Artificial Intelligence
- **Project Type**: Classical AI Implementation
- **Focus Areas**: Knowledge Representation, Search Algorithms, Intelligent Agents

## License

This project is created for academic purposes.

---

**NadiExam** - Demonstrating Classical AI for Real-World Scheduling Problems
