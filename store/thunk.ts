import { createAsyncThunk } from '@reduxjs/toolkit';
import { StoreState } from '.';
import { StudentState } from './student-slice';

export const fetchDataIfEmpty = createAsyncThunk<StudentState, void, { state: StoreState }>(
  'data/fetchDataIfEmpty',
  async (_, { getState }) => {
    const state = getState();
    if (Object.keys(state.students).length > 0) {
      return state.students;
    }

    const response = await fetch('/api/data');
    const data = await response.json();
    return data;
  }
);