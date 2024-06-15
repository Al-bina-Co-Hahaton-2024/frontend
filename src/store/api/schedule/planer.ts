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
    //Генерация календаря
    generateCalendar: builder.mutation({
      query: (body) => {
        return {
          url: '/planner/work-schedules/generate',
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
  useLazyGetGraphOnMonthQuery,
  useLazyGetWeekNumsQuery,
  useGenerateCalendarMutation,
} = planerApi;
