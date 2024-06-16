import { configureStore } from '@reduxjs/toolkit';
import { baseApi } from './api/baseApi/baseApi';
import { serviceSlice } from './reducers/serviceSlice';

export const store = configureStore({
  reducer: {
    [serviceSlice.reducerPath]: serviceSlice.reducer,
    [baseApi.reducerPath]: baseApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }).concat(
      baseApi.middleware
    ),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
