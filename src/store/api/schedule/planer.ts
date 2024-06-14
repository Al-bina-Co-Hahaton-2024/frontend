import { baseApi } from '../baseApi/baseApi';

export const planerApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    //ГРАФИК НА МЕСЯЦ
    getGraphOnMonth: builder.query({
      query: (date) => `/planner/work-schedules?date=${date}`,
      providesTags: ['schedule'],
    }),
    //НОМЕРА НЕДЕЛЬ
    getWeekNums: builder.query({
      query: (dates: string[]) =>
        `/reference/week-numbers?dates=${dates.join(',')}`,
    }),
    getWorkload: builder.mutation({
      query: (body) => {
        return {
          url: `/reference/workloads/years/${body.year}/calculate`,
          method: 'POST',
          body,
        };
      },
    }),
    //АНАЛИТИКА ПО НЕДЕЛЯМ
    getAnalyzesWeeks: builder.mutation({
      query: (body) => {
        return {
          url: `/planner/analyzes/find`,
          method: 'POST',
          body,
        };
      },
    }),
  }),
});

export const {
  useGetAnalyzesWeeksMutation,
  useGetGraphOnMonthQuery,
  useGetWeekNumsQuery,
  useGetWorkloadMutation,
  useLazyGetGraphOnMonthQuery,
  useLazyGetWeekNumsQuery,
} = planerApi;
