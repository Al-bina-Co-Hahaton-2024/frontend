import { baseApi } from '../baseApi/baseApi';

export const exportApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createReport: builder.mutation({
      query: (body) => {
        return {
          url: `/export/doctor-report-cards`,
          method: 'POST',
          body,
        };
      },
    }),
    createForecastReport: builder.mutation({
      query: (body) => {
        return {
          url: `/export/forecast-reports`,
          method: 'POST',
          body,
        };
      },
    }),
    getReport: builder.query({
      query: (id) => `/export/reports/${id}`,
    }),
  }),
});

export const {
  useCreateReportMutation,
  useCreateForecastReportMutation,
  useLazyGetReportQuery,
} = exportApi;
