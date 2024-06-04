import {
    BaseQueryFn,
    FetchArgs,
    FetchBaseQueryError,
    FetchBaseQueryMeta,
    fetchBaseQuery,
} from '@reduxjs/toolkit/query';

export const baseQuery: BaseQueryFn<
    string | FetchArgs,
    unknown,
    FetchBaseQueryError,
    NonNullable<unknown>,
    FetchBaseQueryMeta
> = fetchBaseQuery({
    baseUrl: 'https://base-api-there'
});
