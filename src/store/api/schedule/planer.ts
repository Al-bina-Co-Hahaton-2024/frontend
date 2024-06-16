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
    // Данные для тултипа модальностей УЕ
    getToolTipModality: builder.mutation({
      query: (body) => {
        return {
          url: '/planner/performance-analyzes/perform',
          method: 'POST',
          body,
        };
      },
    }),
    // Поиск по имени в календаре
    getSearchDocsCalendar: builder.mutation({
      query: (body) => {
        return {
          url: '/planner/work-schedules/find',
          method: 'POST',
          body,
        };
      },
    }),
    patchWorkSchedule: builder.mutation({
      query: (args) => {
        const { work, doc, body } = args;
        return {
          url: `/planner/work-schedules/${work}/doctor-schedules/${doc}/extra-hours`,
          method: 'PATCH',
          body,
        };
      },
    }),
    patchEmptyItem: builder.mutation({
      query: (body) => {
        return {
          url: '/planner/work-schedules/add-day',
          method: 'POST',
          body,
        };
      },
    }),
  }),
});

export const {
  useGetAnalyzesWeeksMutation,
  usePatchWorkScheduleMutation,
  useGetGraphOnMonthQuery,
  useGetWeekNumsQuery,

  useGetWorkloadMutation,
  useLazyGetWeekNumsQuery,

  useLazyGetGraphOnMonthQuery,
  useGenerateCalendarMutation,
  useGetToolTipModalityMutation,
  useGetSearchDocsCalendarMutation,
  usePatchEmptyItemMutation,
} = planerApi;
