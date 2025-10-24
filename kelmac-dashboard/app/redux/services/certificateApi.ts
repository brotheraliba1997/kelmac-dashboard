import { baseApi } from './baseApi';

export const certificateApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllCertificates: builder.query({
      query: () => '/certificates/me', // user ke certificates
      providesTags: ['Certificate'],
    }),

    getCertificateById: builder.query({
      query: (id) => `/certificates/${id}`,
      providesTags: ['Certificate'],
    }),
  }),
});

export const {
  useGetAllCertificatesQuery,
  useGetCertificateByIdQuery,
} = certificateApi;
