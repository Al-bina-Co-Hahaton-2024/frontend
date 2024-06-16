import { createSlice } from '@reduxjs/toolkit';

const initialState: any = {
  isDocApprovalCardOpen: false,
  docId: null,
  reqId: null,

  isGraphApprovalCardOpen: false,
  typeGraph: null,
  docGraphId: null,
  reqGraphId: null,

  weekReport: null,
};

export const serviceSlice = createSlice({
  name: 'serviceSlice',
  initialState,
  reducers: {
    setApprovalCardState: (state, action) => {
      state.isDocApprovalCardOpen = action.payload.isOpen;
      state.docId = action.payload.docId;
      if (action.payload.reqId) {
        state.reqId = action.payload.reqId;
      }
    },
    setGraphApprovalCard: (state, action) => {
      state.isGraphApprovalCardOpen = action.payload.isOpen;
      if (action.payload.type) {
        state.typeGraph = action.payload.type;
      }
      if (action.payload.docId) {
        state.docGraphId = action.payload.docId;
      }
      if (action.payload.reqId) {
        state.reqGraphId = action.payload.reqId;
      }
    },
    setWeekReport: (state, action) => {
      state.weekReport = action.payload;
    },
  },
});

export const { setApprovalCardState, setGraphApprovalCard, setWeekReport } =
  serviceSlice.actions;
