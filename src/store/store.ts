import { configureStore, combineReducers} from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";
import refreshSlice from "@/store/slice/refreshSlice.ts";
import popupSlice from "@/store/slice/popupSlice.ts";
import mentionSlice from "@/store/slice/mentionSlice.ts";
import {createTaskDialogSlice} from "@/store/slice/createTaskDailogSlice.ts";
import {createTaskCommentSlice} from "@/store/slice/createTaskCommentSlice.ts";
import {taskInfoSlice} from "@/store/slice/TaskInfoSlice.ts";


const rootPersistConfig = {
    key: 'root',
    storage: storage,
    whitelist: [
        // channelSlice.name,
        // postSlice.name,
        // dmSlice.name,
        // chatSlice.name
    ]
}

const rootReducer = combineReducers({
    [refreshSlice.name]: refreshSlice.reducer,
    [createTaskCommentSlice.name]: createTaskCommentSlice.reducer,
    [taskInfoSlice.name]: taskInfoSlice.reducer,
    [popupSlice.name]: popupSlice.reducer,
    [mentionSlice.name]: mentionSlice.reducer,
    [createTaskDialogSlice.name]: createTaskDialogSlice.reducer

});

const persistedReducer = persistReducer(rootPersistConfig, rootReducer);

const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false
        })
})

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof rootReducer>

export default store;
