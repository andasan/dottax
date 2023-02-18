import { Prisma } from "@prisma/client";
import { createSlice, isPending } from "@reduxjs/toolkit";

type Student = Prisma.StudentGetPayload<{
  select: {
    id: true;
    name: true;
    email: true;
    studentId: true;
    status: true;
  };
}>;

type StudentState = {
  students: Student[];
  populateStudents: Student[];
  studentSelected: Student;
  loading: boolean;
};

const initialState: StudentState = {
  students: [],
  populateStudents: [],
  studentSelected: {
    id: 0,
    name: "",
    email: "",
    studentId: "",
    status: ""
  },
  loading: true
};

export const studentSlice = createSlice({
  name: "students",
  initialState,
  reducers: {
    loadStudents: (state, action) => {
      state.students = action.payload;
      state.populateStudents = action.payload;
      state.loading = false;
    },
    populateModal: (state, action) => {
      state.studentSelected = action.payload;
    },
    updateStudent: (state) => {
      state.populateStudents = state.students.map((student) => {
        if (student.id === state.studentSelected.id) {
          return state.studentSelected;
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
          return { ...student, status: "sent" };
        }
        return student;
      });
    },
    filterStudents: (state, { payload }) => {
      state.populateStudents = state.students.filter((student) => {
        return (
          student.name.toLowerCase().includes(payload.toLowerCase()) ||
          student.email.toLowerCase().includes(payload.toLowerCase()) ||
          student.studentId.toLowerCase().includes(payload.toLowerCase())
        );
      });
    }
  }
});
