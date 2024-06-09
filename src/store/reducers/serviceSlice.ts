import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isDocApprovalCardOpen: false,
    docId: null
};

export const serviceSlice = createSlice({
    name: 'serviceSlice', // Имя среза должно быть 'name', а не 'reducerPath'
    initialState,
    reducers: {
        setApprovalCardState: (state, action) => {
            state.isDocApprovalCardOpen = action.payload.isOpen;
            state.docId = action.payload.docId;
        }
    }
});

export const { setApprovalCardState } = serviceSlice.actions;
