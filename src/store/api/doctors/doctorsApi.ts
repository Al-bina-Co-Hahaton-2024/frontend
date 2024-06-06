import {baseApi} from "../baseApi/baseApi";
import {IDocsData} from "./types";


export const doctorsApi = baseApi.injectEndpoints({
    endpoints: (builder) =>({
        getDoctors: builder.query<IDocsData, any>({
            query: (args) => {
                const {page, userIds} = args
                return {
                    url: `/medical/doctors?${userIds ? `userIds=${userIds.join(',')}&` : ''}page=${page}&size=8`
                }
            }
        }),
        getFioDocsById: builder.mutation({
            query: (body) => {
                return {
                    url: '/user/users/find-by-ids',
                    method: 'POST',
                    body
                }
            }
        }),
        getIdByFioElastic: builder.mutation({
            query: (body) => {
                return {
                    url: '/user/users/find-ids',
                    method: 'POST',
                    body
                }
            }
        })
    })
})

export const {useGetDoctorsQuery, useLazyGetDoctorsQuery, useGetFioDocsByIdMutation, useGetIdByFioElasticMutation} = doctorsApi