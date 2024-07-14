import {createSlice} from '@reduxjs/toolkit';

export const updateSlice = createSlice({
  name: 'update',
  initialState: {status: false},
  reducers: {
    update: state => {
      state.status = !state.status;
    },
  },
});

// Action creators are generated for each case reducer function
export const {update} = updateSlice.actions;

export default updateSlice.reducer;
