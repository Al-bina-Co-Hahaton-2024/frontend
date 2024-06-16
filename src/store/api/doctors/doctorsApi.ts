import { baseApi } from '../baseApi/baseApi';
import { IDocsData } from './types';

export const doctorsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDoctors: builder.query<IDocsData, any>({
      query: (args) => {
        const { page, userIds } = args;
        return {
          url: `/medical/doctors?${userIds ? `userIds=${userIds.join(',')}&` : ''}page=${page}&size=11&sort=id`,
        };
      },
      providesTags: ['doctor'],
    }),
    getAllDoctors: builder.query({
      query: () => `/medical/doctors/`,
    }),
    findDocs: builder.mutation({
      query: (body) => {
        return {
          url: '/medical/doctors/find',
          method: 'POST',
          body,
        };
      },
    }),
    getDoctorsByIds: builder.mutation({
      query: (body) => {
        return {
          url: '/medical/doctors/find-by-ids',
          method: 'POST',
          body,
        };
      },
    }),
    getFioDocsById: builder.mutation({
      query: (body) => {
        return {
          url: '/user/users/find-by-ids',
          method: 'POST',
          body,
        };
      },
    }),
    getIdByFioElastic: builder.mutation({
      query: (body) => {
        return {
          url: '/user/users/find-ids',
          method: 'POST',
          body,
        };
      },
    }),
    patchDoctorById: builder.mutation({
      query: (data) => {
        const { body, id } = data;
        return {
          url: `/user/users/${id}`,
          method: 'PATCH',
          body,
        };
      },
      invalidatesTags: ['doctor'],
    }),
    getApprovedDoctorCard: builder.query({
      query: (id) => {
        return {
          url: `/approve/doctor-changes/?doctorId=${id}`,
        };
      },
    }),
    getDoctorChanges: builder.query({
      query: (args) => {
        const { page } = args;
        return {
          url: `/approve/doctor-changes?page=${page}&size=3&sort=id`,
        };
      },
      providesTags: ['doctor'],
    }),
    getAbsenceDoctors: builder.query({
      query: (args) => {
        const { page } = args;
        return {
          url: `/approve/absence-schedulers?page=${page}&size=3&sort=id`,
        };
      },
    }),
    toApproveDoctorChanges: builder.mutation({
      query: (body) => {
        return {
          url: '/approve/doctor-changes',
          method: 'PUT',
          body,
        };
      },
    }),
    getDoctorsApplications: builder.query({
      query: (page) =>
        `/approve/doctor-applications?page=${page}&size=3&sort=id`,
    }),
    getDoctorWorkSchedulersByIds: builder.mutation({
      query: (body) => {
        return {
          url: '/approve/doctor-work-schedulers/find-by-ids',
          method: 'POST',
          body,
        };
      },
    }),
    getAbsenceSchedulersByIds: builder.mutation({
      query: (body) => {
        return {
          url: '/approve/absence-schedulers/find-by-ids',
          method: 'POST',
          body,
        };
      },
    }),
    approveByManager: builder.mutation({
      query: (id) => {
        return {
          url: `/approve/doctor-changes/${id}/approve`,
          method: 'POST',
        };
      },
      invalidatesTags: ['doctor'],
    }),
    approveAbsenceScheduler: builder.mutation({
      query: (id) => {
        return {
          url: `/approve/absence-schedulers/${id}/approve`,
          method: 'POST',
        };
      },
    }),
    declineByManager: builder.mutation({
      query: (id) => {
        return {
          url: `/approve/doctor-changes/${id}`,
          method: 'DELETE',
        };
      },
      invalidatesTags: ['doctor'],
    }),
  }),
});

export const {
  useGetDoctorsQuery,
  useLazyGetDoctorsQuery,
  useGetFioDocsByIdMutation,
  useGetIdByFioElasticMutation,
  usePatchDoctorByIdMutation,
  useToApproveDoctorChangesMutation,
  useGetApprovedDoctorCardQuery,
  useLazyGetApprovedDoctorCardQuery,
  useGetDoctorChangesQuery,
  useGetAbsenceDoctorsQuery,
  useGetDoctorsApplicationsQuery,
  useGetDoctorWorkSchedulersByIdsMutation,
  useGetAbsenceSchedulersByIdsMutation,
  useGetDoctorsByIdsMutation,
  useApproveByManagerMutation,
  useDeclineByManagerMutation,
  useApproveAbsenceSchedulerMutation,
  useLazyGetAllDoctorsQuery,
  useFindDocsMutation,
} = doctorsApi;
