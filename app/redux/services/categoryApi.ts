import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuth } from "./api";
import { Category } from "../types";

// Types for category API
interface CategoryFilters {
  page?: number;
  limit?: number;
  search?: string;
  isActive?: boolean;
  isFeatured?: boolean;
}

export const categoryApi = createApi({
  reducerPath: "categoryApi",
  baseQuery: baseQueryWithAuth,
  tagTypes: ["Category"],
  endpoints: (builder) => ({
    // Get all categories with pagination and filters
    getCategories: builder.query<Category[], CategoryFilters | void>({
      query: ({
        page = 1,
        limit = 10,
        search = "",
        isActive = true,
        isFeatured = false,
      }: CategoryFilters = {}) => {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
          ...(search && { search }),
          isActive: isActive.toString(),
          isFeatured: isFeatured.toString(),
        });
        return `/categories?${params.toString()}`;
      },
      providesTags: ["Category"],
    }),

    // Get category by ID
    getCategoryById: builder.query<Category, string>({
      query: (id: string) => `/categories/${id}`,
      providesTags: (result, error, id) => [{ type: "Category", id }],
    }),

    // Create new category
    createCategory: builder.mutation<Category, Record<string, unknown>>({
      query: (data) => ({
        url: "/categories",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Category"],
    }),

    // Update category
    updateCategory: builder.mutation<
      Category,
      { id: string; data: Record<string, unknown> }
    >({
      query: ({ id, data }) => ({
        url: `/categories/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Category", id },
        "Category",
      ],
    }),

    // Delete category
    deleteCategory: builder.mutation<Category, string>({
      query: (id) => ({
        url: `/categories/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Category", id },
        "Category",
      ],
    }),

    // Toggle category active status
    toggleCategoryStatus: builder.mutation<Category, string>({
      query: (id) => ({
        url: `/categories/${id}/toggle-status`,
        method: "PATCH",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Category", id },
        "Category",
      ],
    }),

    // Toggle category featured status
    toggleCategoryFeatured: builder.mutation<Category, string>({
      query: (id) => ({
        url: `/categories/${id}/toggle-featured`,
        method: "PATCH",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Category", id },
        "Category",
      ],
    }),

    // Get featured categories
    getFeaturedCategories: builder.query<Category[], void>({
      query: () => "/categories/featured",
      providesTags: ["Category"],
    }),

    // Search categories
    searchCategories: builder.query<Category, string>({
      query: (searchTerm) => {
        const params = new URLSearchParams({
          search: searchTerm,
          isActive: "true",
        });
        return `/categories/search?${params.toString()}`;
      },
      providesTags: ["Category"],
    }),
  }),
});

export const {
  useGetCategoriesQuery,
  useGetCategoryByIdQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useToggleCategoryStatusMutation,
  useToggleCategoryFeaturedMutation,
  useGetFeaturedCategoriesQuery,
  useSearchCategoriesQuery,
} = categoryApi;
