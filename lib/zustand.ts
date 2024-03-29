import { create } from 'zustand'

import { Student } from '@/types/component.types';

export interface StudentStore {
    selectedStudent: Student;
    students: Student[];
    batches: number[];
    loading: boolean;
    setSelectedStudent: (student: Student) => void;
    updateStudent: (student: Student) => void;
    fetchStudents: () => void;
    setStudents: (students: Student[]) => void;
    updateStudentState: (student: Student) => void;
    removeStudent: (id: number) => void;
    fetchBatches: () => void;
    removeBatch: (batch: number) => void;
}

export const useStudentStore = create<StudentStore>((set, get) => ({
    selectedStudent: {} as Student,
    students: [],
    batches: [],
    loading: false,
    setSelectedStudent: (student: Student) => {
        set({ selectedStudent: student })
    },
    updateStudent: (student: Student) => {
        const students = get().students.map(s => s.id === student.id ? student : s)
        set({ students })
    },
    fetchStudents: async () => {
        set({ loading: true })
        const res = await fetch(`/api/fetch-data`)
        set({ students: await res.json(), loading: false })
    },
    setStudents: (students) => {
        set({ loading: true })
        set({ students, loading: false })
    },
    updateStudentState: (student: Student) => {
        const students = get().students.map(s => s.id === student.id ? student : s)
        set({ students })
    },
    removeStudent: (id: number) => {
        const students = get().students.filter(s => s.id !== id)
        set({ students })
    },
    fetchBatches: async () => {
        const res = await fetch(`/api/fetch-batches`)
        set({ batches: await res.json() })
    },
    removeBatch: (batch: number) => {
        set({ batches: get().batches.filter(b => b !== batch) })
    },
}))