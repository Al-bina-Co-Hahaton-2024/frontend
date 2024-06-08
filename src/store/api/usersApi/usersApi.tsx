import {baseApi} from "../baseApi/baseApi";

export const usersApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        addUser: builder.mutation({
            query: (body) => {
                return {
                    url: '/user/users',
                    method: 'POST',
                    body
                }
            }
        })
    })
})

export const {useAddUserMutation} = usersApi