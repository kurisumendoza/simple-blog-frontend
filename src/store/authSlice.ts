import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  authId: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action) => {
      if (!action.payload) {
        state.user = null;
        state.authId = null;
        return;
      }

      const { user, authId } = action.payload;

      state.user = user;
      state.authId = authId;
    },
  },
});

export const { setUser } = authSlice.actions;
export default authSlice.reducer;
