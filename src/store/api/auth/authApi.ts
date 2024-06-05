import {baseApi} from "../baseApi/baseApi";


export const authApi = baseApi.injectEndpoints({
    endpoints: (builder) =>({
        authUser: builder.mutation({
            query: (body) => {
                return {
                    url: '/user/tokens',
                    method: 'POST',
                    body
                }
            }
        })
    })
})


export const {useAuthUserMutation} = authApi