import { createSlice } from '@reduxjs/toolkit';

const today = new Date().toLocaleDateString('en-CA');

const defaultState = {
  students: [
    { id: 101, name: 'Aditi Sharma', rollNo: '101', emoji: '👩🏻' },
    { id: 102, name: 'Rohan Mehta', rollNo: '102', emoji: '👨🏻' },
    { id: 103, name: 'Simran Kaur', rollNo: '103', emoji: '👩🏻' },
    { id: 104, name: 'Kabir Anand', rollNo: '104', emoji: '👨🏻' }
  ],
  history: [],
  selectedDate: today,
  recordsByDate: {
    [today]: {
      '101': true,
      '102': true,
      '103': false,
      '104': true
    }
  }
};

// Load saved attendance from localStorage
const initialState = (() => {
  try {
    const savedData = localStorage.getItem('ae_attendance');

    return savedData
      ? { ...defaultState, ...JSON.parse(savedData) }
      : defaultState;
  } catch {
    return defaultState;
  }
})();

const attendanceSlice = createSlice({
  name: 'attendance',
  initialState,

  reducers: {

    setStudents: (state, action) => {
      state.students = action.payload;
    },

    addStudent: (state, action) => {
      state.students.push(action.payload);

      if (!state.recordsByDate[state.selectedDate]) {
        state.recordsByDate[state.selectedDate] = {};
      }

      state.recordsByDate[state.selectedDate][action.payload.rollNo] = false;
    },

    deleteStudent: (state, action) => {
      const student = state.students.find(
        student => student.id === action.payload
      );

      state.students = state.students.filter(
        student => student.id !== action.payload
      );

      if (student) {
        Object.values(state.recordsByDate).forEach(records => {
          delete records[student.rollNo];
        });
      }
    },

    setSelectedDate: (state, action) => {
      state.selectedDate = action.payload;
    },

    setAttendance: (state, action) => {
      const { date, rollNo, present } = action.payload;

      if (!state.recordsByDate[date]) {
        state.recordsByDate[date] = {};
      }

      state.history.push({
        date,
        records: { ...state.recordsByDate[date] }
      });

      state.recordsByDate[date][rollNo] = present;
    },

    markAllAttendance: (state, action) => {
      const { date, present } = action.payload;

      if (!state.recordsByDate[date]) {
        state.recordsByDate[date] = {};
      }

      state.history.push({
        date,
        records: { ...state.recordsByDate[date] }
      });

      state.students.forEach(student => {
        state.recordsByDate[date][student.rollNo] = present;
      });
    },

    undoAttendance: (state) => {
      if (state.history.length === 0) {
        return;
      }

      const lastChange = state.history.pop();

      state.recordsByDate[lastChange.date] = lastChange.records;
    }
  }
});

export const {
  undoAttendance,
  setAttendance,
  markAllAttendance,
  setStudents,
  addStudent,
  deleteStudent,
  setSelectedDate
} = attendanceSlice.actions;

export default attendanceSlice.reducer;