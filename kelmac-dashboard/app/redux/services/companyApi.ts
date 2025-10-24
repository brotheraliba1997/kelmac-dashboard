import { baseApi } from './baseApi';

export const companyApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllCompanies: builder.query({
      query: () => '/companies',
      providesTags: ['Company'],
    }),

    getCompanyById: builder.query({
      query: (id) => `/companies/${id}`,
      providesTags: ['Company'],
    }),

    createCompany: builder.mutation({
      query: (data) => ({
        url: '/companies',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Company'],
    }),

    updateCompany: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/companies/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Company'],
    }),
  }),
});

export const {
  useGetAllCompaniesQuery,
  useGetCompanyByIdQuery,
  useCreateCompanyMutation,
  useUpdateCompanyMutation,
} = companyApi;
