import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from './baseQuery';

export const baseApi = createApi({
    tagTypes: ['doctor','schedule'],
    reducerPath: 'api',
    baseQuery: baseQuery,
    endpoints: () => ({}),
});
