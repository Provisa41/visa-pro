import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface AppState {
  selectedCountry: string;
  selectedVisaType: string;
}

const initialState: AppState = {
  selectedCountry: 'de',
  selectedVisaType: 'tourist',
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setCountry(state, action: PayloadAction<string>) {
      state.selectedCountry = action.payload;
    },
    setVisaType(state, action: PayloadAction<string>) {
      state.selectedVisaType = action.payload;
    },
  },
});

export const { setCountry, setVisaType } = appSlice.actions;
export default appSlice.reducer;
