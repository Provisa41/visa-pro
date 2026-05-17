import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface AuthUser {
  id: string;
  telegramId: string;
  username?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  photoUrl?: string | null;
}

interface AuthState {
  token: string | null;
  user: AuthUser | null;
  onboardingDone: boolean;
}

const token = localStorage.getItem('visa_pro_token');
const onboardingDone = localStorage.getItem('visa_pro_onboarding') === '1';

const initialState: AuthState = {
  token,
  user: null,
  onboardingDone,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials(
      state,
      action: PayloadAction<{ token: string; user: AuthUser }>
    ) {
      state.token = action.payload.token;
      state.user = action.payload.user;
      localStorage.setItem('visa_pro_token', action.payload.token);
    },
    setUser(state, action: PayloadAction<AuthUser>) {
      state.user = action.payload;
    },
    completeOnboarding(state) {
      state.onboardingDone = true;
      localStorage.setItem('visa_pro_onboarding', '1');
    },
    logout(state) {
      state.token = null;
      state.user = null;
      localStorage.removeItem('visa_pro_token');
    },
  },
});

export const { setCredentials, setUser, completeOnboarding, logout } =
  authSlice.actions;
export default authSlice.reducer;
