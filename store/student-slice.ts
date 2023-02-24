import { createSlice, isPending, PayloadAction } from '@reduxjs/toolkit';

import {StoreState} from '.'
import { Student } from '@/types/schema.types';
import { fetchDataIfEmpty } from './thunk';

export interface StudentState {
  students: Student[];
  populateStudents: Student[];
  studentsByBatch: Student[];
  batches: number[];
  studentSelected: Student;
  loading: boolean;
};

const initialState: StudentState = {
  students: [],
  populateStudents: [],
  studentsByBatch: [],
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
    loadBatches: (state, action) => {
      state.batches = [...new Set(action.payload.map((student: Student) => student.batch))].sort().reverse() as number[];
    },
    loadStudentsByBatch: (state, action) => {
      state.studentsByBatch = state.students.filter((student) => student.batch === +action.payload)
    },
    selectedProfileData: (state, action) => {
      state.studentSelected = action.payload;
    },
    updateStudent: (state, action) => {
      state.studentsByBatch = state.studentsByBatch.map((student) => {
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
      state.studentsByBatch = state.students.map((student) => {
        if (student.id === action.payload.id) {
          return { ...student, status: action.payload.status };
        }
        return student;
      });
    },
    // filterStudents: (state, { payload }) => {
    //   state.populateStudents = state.students.filter((student) => {
    //     return (
    //       student.firstName.toLowerCase().includes(payload.toLowerCase()) ||
    //       student.lastName.toLowerCase().includes(payload.toLowerCase()) ||
    //       student.email.toLowerCase().includes(payload.toLowerCase()) ||
    //       student.studentId.toLowerCase().includes(payload.toLowerCase())
    //     );
    //   });
    // },
    deleteStudent: (state, action) => {
      state.studentsByBatch = state.studentsByBatch.filter((student) => student.id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchDataIfEmpty.fulfilled, (state, { payload }) => {
      state.students = payload;
    });
  },
});
