import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
  register: false,
  payments: false,
  multiStepCreator: false,
  promotionPopup: false,
  premiumGiftPopup: false,
  currentStep: 0,
};

export const cta = createSlice({
  name: "cta",
  initialState,
  reducers: {
    setRegisterOpen: (state, action) => {
      state.register = action.payload;
    },
    setPaymentsOpen: (state, action) => {
      state.payments = action.payload;
    },
    setMultiStepCreatorOpen: (state, action) => {
      state.multiStepCreator = action.payload;
    },
    setPromotionPopupOpen: (state, action) => {
      state.promotionPopup = action.payload;
    },
    setCurrentStep: (state, action) => {
      state.currentStep = action.payload;
    },
    setPremiumGiftPopupOpen: (state, action) => {
      state.premiumGiftPopup = action.payload;
    },
  },
});

export const { 
  setRegisterOpen, 
  setPaymentsOpen, 
  setMultiStepCreatorOpen, 
  setPromotionPopupOpen,
  setPremiumGiftPopupOpen,
  setCurrentStep 
} = cta?.actions;

export default cta?.reducer;
