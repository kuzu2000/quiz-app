import { apiSlice } from '../../app/api/apiSlice';

const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    addNewUser: builder.mutation({
      query: (initialUserData) => ({
        url: '/user',
        method: 'POST',
        body: {
          ...initialUserData,
        },
      }),
      invalidatesTags: [{ type: 'User', id: 'LIST' }],
    }),
    getLeaderboard: builder.query({
      query: () => '/user/leaderboard',
    }),
    getUser: builder.query({
      query: (id) => ({
        url: `/user/get-user?userId=${id}`
      }),
      provideTags: ['User']
    }),
  }),
});

export const {
  useAddNewUserMutation,
  useGetLeaderboardQuery,
  useGetUserQuery,
} = userApiSlice;
