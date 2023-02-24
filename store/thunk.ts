import { Student } from '@/types/schema.types';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { StoreState } from '.';
import { StudentState } from './student-slice';

export const fetchDataIfEmpty = createAsyncThunk<Student[], number, { state: StoreState }>(
  'data/fetchDataIfEmpty',
  async (batch: number, { getState }) => {
    const state = getState();
    if (Object.keys(state.students.students).length > 0) {
      return state.students.students;
    }

    const response = await fetch(`/api/fetch-data?batch=${batch}`);
    const data = await response.json();
    return data;
  }
);