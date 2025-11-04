import React from "react";
import {
  useCreateCourseMutation,
  useGetCourseByIdQuery,
} from "@/app/redux/services/courseApi";
import { useGetUsersQuery } from "@/app/redux/services/userApi";
import { GetUserRoleName } from "@/app/utils/getUserRoleName";
import { useRouter } from "next/navigation";

import { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { FaTimes } from "react-icons/fa";

interface Lesson {
  title: string;
  content?: string;
  videoUrl?: string;
}

interface Module {
  title: string;
  lessons: Lesson[];
}

interface CourseForm {
  title: string;
  description?: string;
  instructor: string;
  price: string;
  modules: Module[];
}

function Coursescomponents({
  findOne,
  createCourse,
  id,
  isLoading,
  data,
}: any) {
  console.log(createCourse, id, "createCourse");
  const [formData, setFormData] = useState<CourseForm>({
    title: "",
    description: "",
    instructor: "",
    price: "",
    modules: [
      { title: "", lessons: [{ title: "", content: "", videoUrl: "" }] },
    ],
  });

  const router = useRouter();

  useEffect(() => {
    if (findOne) {
      setFormData({
        title: findOne.title || "",
        description: findOne.description || "",
        instructor: findOne.instructor || "",
        price: findOne.price || "",
        modules:
          findOne.modules?.map((mod: any) => ({
            title: mod.title || "",
            lessons:
              mod.lessons?.map((lesson: any) => ({
                title: lesson.title || "",
                content: lesson.content || "",
                videoUrl: lesson.videoUrl || "",
              })) || [],
          })) || [],
      });
    }
  }, [findOne]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    // convert numeric fields automatically
    const numericFields = ["role", "instructor", "status", "price"];
    setFormData({
      ...formData,
      [name]: numericFields.includes(name) ? Number(value) : value,
    });
  };

  const handleModuleChange = (i: number, e: ChangeEvent<HTMLInputElement>) => {
    const modules = [...formData.modules];
    const propertyName = e.target.name as keyof Module;
    (modules[i] as any)[propertyName] = e.target.value;
    setFormData({ ...formData, modules });
  };

  const handleLessonChange = (
    mi: number,
    li: number,
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const modules = [...formData.modules];
    modules[mi].lessons[li][e.target.name as keyof Lesson] = e.target.value;
    setFormData({ ...formData, modules });
  };

  const addModule = () =>
    setFormData({
      ...formData,
      modules: [...formData.modules, { title: "", lessons: [] }],
    });

  const addLesson = (i: number) => {
    const modules = [...formData.modules];
    modules[i].lessons.push({ title: "", content: "", videoUrl: "" });
    setFormData({ ...formData, modules });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const payload = { ...formData, price: parseFloat(formData.price) };
    await createCourse({ id: id || "", data: payload }).unwrap();
    router.push("/dashboard/courses");
  };

  const removeLesson = (moduleIndex: number, lessonIndex: number) => {
    const updatedModules = [...formData.modules];
    updatedModules[moduleIndex].lessons.splice(lessonIndex, 1);
    setFormData({ ...formData, modules: updatedModules });
  };

  const removeModule = (index: number) => {
    const updated = [...formData.modules];
    updated.splice(index, 1);
    setFormData({ ...formData, modules: updated });
  };

  console.log("formData==>", formData);

  return (
    <div
      className="container py-5"
      style={{ marginLeft: "240px", marginTop: "50px" }}
    >
      <div className="card p-4 shadow  w-75 mx-auto">
        <h4>Create Course</h4>
        <form onSubmit={handleSubmit} className="row">
          {/* Course Title */}
          <div className="col-md-12 mb-3">
            <label className="form-label fw-medium">Course Title</label>
            <input
              type="text"
              className="form-control"
              name="title"
              placeholder="Enter course title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          {/* Description */}
          <div className="col-md-12 mb-3">
            <label className="form-label fw-medium">Description</label>
            <textarea
              className="form-control"
              name="description"
              placeholder="Enter course description"
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          {/* Instructor */}
          <div className="col-md-6 mb-3">
            <label className="form-label fw-medium">Instructor Role</label>
            <select
              className="form-select"
              name="instructor"
              value={formData.instructor || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  instructor: String(e.target.value),
                })
              }
              required
            >
              <option value="">Select Role</option>
              {data?.data.map((roleId: any) => (
                <option key={roleId} value={roleId?.id}>
                  {GetUserRoleName(roleId?.role?.id)}
                </option>
              ))}
            </select>
          </div>

          {/* Price */}
          <div className="col-md-6 mb-3">
            <label className="form-label fw-medium">Price ($)</label>
            <input
              type="number"
              className="form-control"
              name="price"
              placeholder="Enter price"
              value={formData.price}
              onChange={handleChange}
              required
            />
          </div>

          {/* Modules */}
          <div className="col-md-12 mb-3">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <h6 className="fw-bold mb-0">
                <i className="fas fa-layer-group me-2"></i>Modules
              </h6>
              <button
                type="button"
                className="btn btn-sm btn-outline-success"
                onClick={addModule}
              >
                + Add Module
              </button>
            </div>

            {formData.modules.map((module, moduleIndex) => (
              <div key={moduleIndex} className="border rounded p-3 mb-3">
                {/* Module Title */}
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <label className="form-label fw-medium">Module Title</label>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => removeModule(moduleIndex)}
                  >
                    <FaTimes />
                  </button>
                </div>
                <input
                  type="text"
                  className="form-control mb-3"
                  name="title"
                  placeholder="Enter module title"
                  value={module.title}
                  onChange={(e) => handleModuleChange(moduleIndex, e)}
                  required
                />

                {/* Lessons */}
                <div className="ms-3">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <h6 className="fw-bold mb-0">
                      <i className="fas fa-book me-2"></i>Lessons
                    </h6>
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => addLesson(moduleIndex)}
                    >
                      + Add Lesson
                    </button>
                  </div>

                  {module.lessons.map((lesson, lessonIndex) => (
                    <div key={lessonIndex} className="border rounded p-3 mb-2">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <label className="form-label fw-medium mb-1">
                          Lesson {lessonIndex + 1}
                        </label>
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => removeLesson(moduleIndex, lessonIndex)}
                        >
                          <FaTimes />
                        </button>
                      </div>

                      <input
                        type="text"
                        className="form-control mb-2"
                        name="title"
                        placeholder="Lesson title"
                        value={lesson.title}
                        onChange={(e) =>
                          handleLessonChange(moduleIndex, lessonIndex, e)
                        }
                        required
                      />

                      <input
                        type="text"
                        className="form-control mb-2"
                        name="videoUrl"
                        placeholder="Video URL"
                        value={lesson.videoUrl}
                        onChange={(e) =>
                          handleLessonChange(moduleIndex, lessonIndex, e)
                        }
                      />

                      <textarea
                        className="form-control"
                        name="content"
                        placeholder="Lesson content"
                        value={lesson.content}
                        onChange={(e) =>
                          handleLessonChange(moduleIndex, lessonIndex, e)
                        }
                      ></textarea>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Submit */}
          <div className="col-md-12 mt-3 text-end border-top pt-3">
            <button
              type="submit"
              className="btn btn-primary fw-semibold"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <i className="fas fa-spinner fa-spin me-2"></i> Creating...
                </>
              ) : (
                <>
                  <i className="fas fa-save me-2"></i> Create Course
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Coursescomponents;
