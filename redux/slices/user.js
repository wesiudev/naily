import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
  user: {
    uid: "",
    name: "",
    email: "",

    photoURL: "",
    description: "",
    logo: "",
    bannerUrl: "",
    dailyClients: 0,

    portfolioImages: [],
    seek: false,
    emailVerified: false,
    configured: false,
    payments: [],
    profileComments: [],
    services: [],
    location: { lng: 21.0122287, lat: 52.2296756, address: "" },
    password: "",

    phoneNumber: "",
    active: false,
    premiumActive: false,
    subscription: undefined,
    subscriptionId: undefined,
    customerId: undefined,
    userSlugUrl: "",
    metadata: {
      seoTitle: "",
      seoDescription: "",
      seoKeywords: "",
    },
    settings: {
      emailNotifications: false,
      autoReminders: false,
      pushNotifications: false,
      darkMode: false,
      twoFactorEnabled: false,
      publicProfile: true,
      fontFamily: "inter",
    },
  },
};

export const user = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
  },
});

export const { setUser } = user?.actions;

export default user?.reducer;
