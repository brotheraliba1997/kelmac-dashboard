"use client";
import React, { useState } from "react";
import DynamicForm, { DynamicFormConfig } from "../shared/DynamicForm";
import { useRouter } from "next/navigation";
import {
  useGetCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useToggleCategoryStatusMutation,
  useToggleCategoryFeaturedMutation,
} from "../../redux/services/categoryApi";
import {
  FaTag,
  FaEdit,
  FaTrash,
  FaPlus,
  FaEye,
  FaEyeSlash,
  FaStar,
} from "react-icons/fa";

interface CategoryManagerProps {
  embedded?: boolean; // When used as part of another component
}

export default function CategoryManager({
  embedded = false,
}: CategoryManagerProps) {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  // API hooks
  const {
    data: categoriesData,
    isLoading,
    error,
    refetch,
  } = useGetCategoriesQuery({
    page,
    limit: 10,
    search: searchTerm,
    isActive: true,
  });

  const [createCategory, { isLoading: isCreating }] =
    useCreateCategoryMutation();
  const [updateCategory, { isLoading: isUpdating }] =
    useUpdateCategoryMutation();
  const [deleteCategory] = useDeleteCategoryMutation();
  const [toggleStatus] = useToggleCategoryStatusMutation();
  const [toggleFeatured] = useToggleCategoryFeaturedMutation();

  // Form configuration
  const categoryFormConfig: DynamicFormConfig = {
    title: editingCategory ? "Edit Category" : "Create Category",
    description: "Enter category information",
    submitText: editingCategory ? "Update Category" : "Create Category",
    cancelText: "Cancel",
    layout: "vertical",
    columns: 1,
    fields: [
      {
        name: "name",
        label: "Category Name",
        type: "text",
        placeholder: "Enter category name",
        validation: { required: true, maxLength: 100 },
        icon: <FaTag />,
      },
      {
        name: "description",
        label: "Description",
        type: "textarea",
        placeholder: "Category description",
        validation: { maxLength: 500 },
      },
      {
        name: "slug",
        label: "Slug",
        type: "text",
        placeholder: "category-slug (auto-generated if empty)",
        validation: { maxLength: 100 },
        description: "URL-friendly version of the name",
      },
      {
        name: "isActive",
        label: "Active",
        type: "checkbox",
        defaultValue: true,
        description: "Category is available for use",
      },
      {
        name: "isFeatured",
        label: "Featured",
        type: "checkbox",
        defaultValue: false,
        description: "Show category in featured sections",
      },
    ],
  };

  const handleFormSubmit = async (data: Record<string, any>) => {
    try {
      const categoryData = {
        name: data.name,
        description: data.description,
        slug: data.slug || data.name?.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        isActive: data.isActive !== false,
        isFeatured: data.isFeatured || false,
      };

      if (editingCategory) {
        await updateCategory({
          id: editingCategory.id || editingCategory._id,
          data: categoryData,
        }).unwrap();
        alert("Category updated successfully!");
      } else {
        await createCategory(categoryData).unwrap();
        alert("Category created successfully!");
      }

      setShowForm(false);
      setEditingCategory(null);
      refetch();
    } catch (error: any) {
      console.error("Error saving category:", error);
      const errorMessage =
        error?.data?.message || error?.message || "Failed to save category";
      alert(errorMessage);
    }
  };

  const handleEdit = (category: any) => {
    setEditingCategory(category);
    setShowForm(true);
  };

  const handleDelete = async (category: any) => {
    if (confirm(`Are you sure you want to delete "${category.name}"?`)) {
      try {
        await deleteCategory(category.id || category._id).unwrap();
        alert("Category deleted successfully!");
        refetch();
      } catch (error: any) {
        console.error("Error deleting category:", error);
        alert("Failed to delete category");
      }
    }
  };

  const handleToggleStatus = async (category: any) => {
    try {
      await toggleStatus(category.id || category._id).unwrap();
      refetch();
    } catch (error: any) {
      console.error("Error toggling status:", error);
      alert("Failed to toggle category status");
    }
  };

  const handleToggleFeatured = async (category: any) => {
    try {
      await toggleFeatured(category.id || category._id).unwrap();
      refetch();
    } catch (error: any) {
      console.error("Error toggling featured:", error);
      alert("Failed to toggle category featured status");
    }
  };

  const getFormInitialData = () => {
    if (!editingCategory) return {};

    return {
      name: editingCategory.name,
      description: editingCategory.description,
      slug: editingCategory.slug,
      isActive: editingCategory.isActive,
      isFeatured: editingCategory.isFeatured,
    };
  };

  // Extract categories from API response
  const categories: any[] = Array.isArray(categoriesData) ? categoriesData : [];

  const WrapperComponent = embedded
    ? React.Fragment
    : ({ children }: { children: React.ReactNode }) => (
        <div className="page-wrapper" style={{ minHeight: "100vh" }}>
          <div className="content container-fluid">{children}</div>
        </div>
      );

  if (showForm) {
    return (
      <WrapperComponent>
        <div className="row justify-content-center">
          <div className="col-xl-8">
            <div className="card">
              <div className="card-body">
                <DynamicForm
                  config={categoryFormConfig}
                  initialData={getFormInitialData()}
                  onSubmit={handleFormSubmit}
                  onCancel={() => {
                    setShowForm(false);
                    setEditingCategory(null);
                  }}
                  loading={isCreating || isUpdating}
                />
              </div>
            </div>
          </div>
        </div>
      </WrapperComponent>
    );
  }

  return (
    <WrapperComponent>
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <div className="d-flex justify-content-between align-items-center">
                <h4 className="card-title mb-0">Category Management</h4>
                <button
                  className="btn btn-primary"
                  onClick={() => setShowForm(true)}
                >
                  <FaPlus className="me-1" />
                  Add Category
                </button>
              </div>
            </div>

            <div className="card-body">
              {/* Search */}
              <div className="row mb-3">
                <div className="col-md-6">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search categories..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              {/* Loading State */}
              {isLoading && (
                <div className="text-center py-4">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              )}

              {/* Error State */}
              {error && (
                <div className="alert alert-danger">
                  <strong>Error:</strong> Failed to load categories
                  <button
                    className="btn btn-outline-danger btn-sm ms-2"
                    onClick={() => refetch()}
                  >
                    Retry
                  </button>
                </div>
              )}

              {/* Categories Table */}
              {!isLoading && !error && (
                <div className="table-responsive">
                  <table className="table table-striped">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Slug</th>
                        <th>Description</th>
                        <th>Status</th>
                        <th>Featured</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {categories.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="text-center">
                            No categories found
                          </td>
                        </tr>
                      ) : (
                        categories.map((category: any) => (
                          <tr key={category.id || category._id}>
                            <td>{category.name}</td>
                            <td>
                              <code>{category.slug}</code>
                            </td>
                            <td>
                              {category.description ? (
                                <span title={category.description}>
                                  {category.description.length > 50
                                    ? `${category.description.substring(
                                        0,
                                        50
                                      )}...`
                                    : category.description}
                                </span>
                              ) : (
                                <span className="text-muted">
                                  No description
                                </span>
                              )}
                            </td>
                            <td>
                              <button
                                className={`btn btn-sm ${
                                  category.isActive
                                    ? "btn-success"
                                    : "btn-secondary"
                                }`}
                                onClick={() => handleToggleStatus(category)}
                              >
                                {category.isActive ? <FaEye /> : <FaEyeSlash />}
                                {category.isActive ? " Active" : " Inactive"}
                              </button>
                            </td>
                            <td>
                              <button
                                className={`btn btn-sm ${
                                  category.isFeatured
                                    ? "btn-warning"
                                    : "btn-outline-warning"
                                }`}
                                onClick={() => handleToggleFeatured(category)}
                              >
                                <FaStar />
                                {category.isFeatured ? " Featured" : " Regular"}
                              </button>
                            </td>
                            <td>
                              <div className="btn-group">
                                <button
                                  className="btn btn-outline-primary btn-sm"
                                  onClick={() => handleEdit(category)}
                                >
                                  <FaEdit />
                                </button>
                                <button
                                  className="btn btn-outline-danger btn-sm"
                                  onClick={() => handleDelete(category)}
                                >
                                  <FaTrash />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </WrapperComponent>
  );
}
