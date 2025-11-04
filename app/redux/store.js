import { configureStore } from "@reduxjs/toolkit";
import auth from "./slices/auth";
import chat from "./slices/chat";
import notification from "./slices/notification";

import { authAPI } from "./services/authApi";
import { userAPI } from "./services/userApi";
import { languageAPI } from "./services/languageAPI";
import { setupListeners } from "@reduxjs/toolkit/query";
import { JobAPI } from "./services/jobAPI";
import { JobServicesAPI } from "./services/jobServicesAPI";
import { JobTypesAPI } from "./services/jobTypesAPI";
import { PaymentDetailsAPI } from "./services/paymentDetailsAPI";
// import { JobPostAPI } from "./services/jobPostAPI";
// import { JobGetProposalsAPI } from "./services/jobGetProposalsAPI";
import { chatAPI } from "./services/chatAPI";
import { walletAPI } from "./services/walletAPI";
import { billingAPI } from "./services/billingAPI";
import { PaymentAPI } from "./services/PaymentAPI";
import { NotificationAPI } from "./services/notificationAPI";
import { DashboardAPI } from "./services/dashboardAPI";
import { contactAPI } from "./services/contactAPI";
import { courseApi } from "./services/courseApi";
import { enrollmentApi } from "./services/enrollmentApi";

export const store = configureStore({
  reducer: {
    auth,
    chat,
    notification,

    [authAPI.reducerPath]: authAPI.reducer,
    [userAPI.reducerPath]: userAPI.reducer,
    [languageAPI.reducerPath]: languageAPI.reducer,
    [JobAPI.reducerPath]: JobAPI.reducer,
    [JobServicesAPI.reducerPath]: JobServicesAPI.reducer,
    [JobTypesAPI.reducerPath]: JobTypesAPI.reducer,
    // [JobPostAPI.reducerPath]: JobPostAPI.reducer,
    // [JobGetProposalsAPI.reducerPath]: JobGetProposalsAPI.reducer,
    [chatAPI.reducerPath]: chatAPI.reducer,
    [PaymentDetailsAPI.reducerPath]: PaymentDetailsAPI.reducer,
    [walletAPI.reducerPath]: walletAPI.reducer,
    [billingAPI.reducerPath]: billingAPI.reducer,
    [PaymentAPI.reducerPath]: PaymentAPI.reducer,
    [NotificationAPI.reducerPath]: NotificationAPI.reducer,
    [DashboardAPI.reducerPath]: DashboardAPI.reducer,
    [contactAPI.reducerPath]: contactAPI.reducer,
    [courseApi.reducerPath]: courseApi.reducer,
    [enrollmentApi.reducerPath]: enrollmentApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authAPI.middleware,
      userAPI.middleware,
      languageAPI.middleware,
      JobAPI.middleware,
      JobServicesAPI.middleware,
      JobTypesAPI.middleware,
      PaymentDetailsAPI.middleware,
      chatAPI.middleware,
      walletAPI.middleware,
      billingAPI.middleware,
      PaymentAPI.middleware,
      NotificationAPI.middleware,
      DashboardAPI.middleware,
      contactAPI.middleware,
      courseApi.middleware,
      enrollmentApi.middleware
    ),
});
setupListeners(store.dispatch);
