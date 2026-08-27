import { createSlice } from '@reduxjs/toolkit';
import { clearSession, getSession, setSession as persistSession } from '../utils/auth';

const stored = getSession();

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    accessToken: stored.access_token || null,
    refreshToken: stored.refresh_token || null,
    user: stored.user || null,
  },
  reducers: {
    setTokens(state, action) {
      const accessToken = action.payload?.access_token || state.accessToken;
      const refreshToken = action.payload?.refresh_token || state.refreshToken;
      state.accessToken = accessToken || null;
      state.refreshToken = refreshToken || null;
      persistSession({ access_token: state.accessToken, refresh_token: state.refreshToken, user: state.user });
    },
    setUser(state, action) {
      state.user = action.payload || null;
      persistSession({ access_token: state.accessToken, refresh_token: state.refreshToken, user: state.user });
    },
    clearAuth(state) {
      state.accessToken = null;
      state.refreshToken = null;
      state.user = null;
      clearSession();
    },
  },
});

export const { setTokens, setUser, clearAuth } = authSlice.actions;
export default authSlice.reducer;
