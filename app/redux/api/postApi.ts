import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import Cookies from 'js-cookie';

const token = Cookies.get('jwt');
export const postApi: any = createApi({
  reducerPath: 'postsApi',
  tagTypes: ['Posts'],
  baseQuery: fetchBaseQuery({
    // baseUrl: process.env.BASE_API_URL,
    baseUrl: 'https://663e6894e1913c4767978fca.mockapi.io',
    prepareHeaders: (headers) => {
      headers.set('Content-type', 'application/json');
      return headers;
    },
  }),
  endpoints: (builder) => ({
    //GET
    getAllPosts: builder.query({
      query: () => `/posts/`,
      // query: () => `/post/`,
      providesTags: ({ results }) =>
        results
          ? [
              ...results.map(({ id }: { id: string }) => ({
                type: 'Posts',
                id,
              })),
              { type: 'Posts', id: 'LIST' },
            ]
          : [{ type: 'Posts', id: 'LIST' }],
    }),
    //GET by ID
    getPostById: builder.query({
      query: () => `/post/${token}`,
    }),
    //POST
    createPosts: builder.mutation({
      query: (data) => {
        return {
          method: 'POST',
          // url: '/post/',
          url: '/posts/',
          body: JSON.stringify(data),
        };
      },
      invalidatesTags: [{ type: 'Posts', id: 'LIST' }],
    }),
    //PUT
    changePost: builder.mutation({
      query: ({ data }) => {
        return {
          method: 'PUT',
          url: `/post/${token}`,
          body: JSON.stringify(data),
        };
      },
      invalidatesTags: [{ type: 'Posts', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetAllPostsQuery,
  useGetPostByIdQuery,
  useCreatePostsMutation,
  useChangePostMutation,
} = postApi;
