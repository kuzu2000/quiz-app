import { apiSlice } from "../../app/api/apiSlice";

const quizApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getQuizByCategory: builder.query({
            query: (category) => `/quiz?category=${category}`,
            provideTags: ['Quiz']
        }),
        getCategory: builder.query({
            query: () => '/quiz/category'
        })
    })
})

export const {useGetCategoryQuery, useGetQuizByCategoryQuery} = quizApiSlice