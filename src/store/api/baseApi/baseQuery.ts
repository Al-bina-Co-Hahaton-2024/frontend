import {
    BaseQueryFn,
    FetchArgs,
    FetchBaseQueryError,
    FetchBaseQueryMeta,
    fetchBaseQuery,
} from '@reduxjs/toolkit/query';
import Cookies from 'js-cookie';

export const baseQuery: BaseQueryFn<
    string | FetchArgs,
    unknown,
    FetchBaseQueryError,
    NonNullable<unknown>,
    FetchBaseQueryMeta
> = fetchBaseQuery({
    baseUrl: 'https://api-hack.bigtows.org',
    prepareHeaders: (headers) => {
        const token = Cookies.get('accessToken');
        if (token) {
            headers.set('Authorization', `Bearer ${token}`);
        }
        return headers;
    },
});
