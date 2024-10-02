import { apiSlice } from '../../app/api/apiSlice';

export const notiApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
      fetchNoti: builder.query({
        query: (id) => `/notification?userId=${id}`,
        providesTags: (result, error, arg) =>
          result
            ? [...result.map(({ _id }) => ({ type: 'Notification', id: _id })), 'NotificationList']
            : ['NotificationList'],
      }),
      addExperience: builder.mutation({
        query: (initialUserData) => ({
          url: '/user/add-experience',
          method: 'POST',
          body: {...initialUserData}
        }),
      }),
      readNoti: builder.mutation({
        query: (data) => ({
          url: '/notification/read',
          method: 'POST',
          body: { ...data },
        }),
        async onQueryStarted(args, { dispatch, queryFulfilled }) {
          // Optimistically update the state
          const patchResult = dispatch(
            apiSlice.util.updateQueryData('fetchNoti', undefined, (draft) => {
              args.notificationIds.forEach((id) => {
                const notification = draft.find((notif) => notif._id === id);
                if (notification) {
                  notification.read = true; // Update the read status
                }
              });
            })
          );
  
          try {
            await queryFulfilled; // Await the original query to finish
          } catch {
            patchResult.undo(); // Rollback the optimistic update if the request fails
          }
        },
      }),
    }),
  });
  
  export const { useFetchNotiQuery, useReadNotiMutation, useAddExperienceMutation } = notiApiSlice;
  
