import { Prisma } from '@prisma/client';
import { createSlice, isPending } from '@reduxjs/toolkit';

import { Student } from '@/types/schema.types';

type StudentState = {
  students: Student[];
  populateStudents: Student[];
  batches: number[];
  studentSelected: Student;
  loading: boolean;
};

const initialState: StudentState = {
  students: [],
  populateStudents: [],
  batches: [],
  studentSelected: {
    id: 0,
    firstName: '',
    lastName: '',
    email: '',
    studentId: '',
    status: '',
    batch: 0,
  },
  loading: true,
};

export const studentSlice = createSlice({
  name: 'students',
  initialState,
  reducers: {
    loadStudents: (state, action) => {
      state.students = action.payload;
      state.populateStudents = action.payload;
      state.loading = false;
    },
    selectedProfileData: (state, action) => {
      state.studentSelected = action.payload;
    },
    updateStudent: (state, action) => {
      state.populateStudents = state.students.map((student) => {
        if (student.id === action.payload.id) {
          return action.payload;
        }
        return student;
      });
    },
    updateStudentModal: (state, action) => {
      state.studentSelected = { ...state.studentSelected, ...action.payload };
    },
    updateStudentStatus: (state, action) => {
      state.populateStudents = state.students.map((student) => {
        if (student.id === action.payload.id) {
          return { ...student, status: action.payload.status };
        }
        return student;
      });
    },
    updateStudentsStatuses: (state, action) => {
      state.populateStudents = state.students.map((student) => {
        if (action.payload.includes(student.id)) {
          return { ...student, status: 'sent' };
        }
        return student;
      });
    },
    filterStudents: (state, { payload }) => {
      state.populateStudents = state.students.filter((student) => {
        return (
          student.firstName.toLowerCase().includes(payload.toLowerCase()) ||
          student.lastName.toLowerCase().includes(payload.toLowerCase()) ||
          student.email.toLowerCase().includes(payload.toLowerCase()) ||
          student.studentId.toLowerCase().includes(payload.toLowerCase())
        );
      });
    },
    deleteStudent: (state, action) => {
      state.populateStudents = state.students.filter((student) => student.id !== action.payload);
    },
    getBatches: (state) => {
      state.batches = [...new Set(state.students.map((student) => student.batch))].sort(
        (a, b) => b - a // sort in descending order
      );
    },
  },
});
