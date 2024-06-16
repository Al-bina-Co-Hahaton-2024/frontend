import { createSlice } from '@reduxjs/toolkit';

const initialState: any = {
  isDocApprovalCardOpen: false,
  docId: null,
  reqId: null,

  isGraphApprovalCardOpen: false,
  typeGraph: null,
  docGraphId: null,
  reqGraphId: null,

  currentWeekReport: null,
  weekReport: null,

  reportPatchData: [],
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
      if (action.payload.current) {
        state.currentWeekReport = action.payload.current;
      }
      if (action.payload.perfomance) {
        state.weekReport = action.payload.perfomance;
      }
    },
    setReportPatchData: (state, action) => {
      state.reportPatchData = action.payload;
    },
  },
});

export const {
  setApprovalCardState,
  setReportPatchData,
  setGraphApprovalCard,
  setWeekReport,
} = serviceSlice.actions;
