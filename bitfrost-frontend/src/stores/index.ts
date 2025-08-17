import { configureStore, type Middleware } from "@reduxjs/toolkit";
import rootReducer from "./rootReducer";

const crossSliceMiddleware: Middleware = () => (next) => (action: any) => {
  return next(action);
};

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(crossSliceMiddleware),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

export default store;
