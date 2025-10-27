'use client';
import { FC } from 'react';

interface CourseCardProps {
  title: string;
  description: string;
  instructor: string;
  price: number;
}

const CourseCard: FC<CourseCardProps> = ({ title, description, instructor, price }) => {
  return (
    <div className="col-md-4 mb-4">
      <div className="card shadow-sm h-100">
        <div className="card-body">
          <h5 className="card-title text-primary">{title}</h5>
          <p className="card-text text-muted">{description?.slice(0, 100)}...</p>
          <p className="card-text">
            <small className="text-secondary">Instructor: {instructor}</small>
          </p>
          <div className="d-flex justify-content-between align-items-center mt-3">
            <span className="fw-bold">${price}</span>
            <button className="btn btn-sm btn-outline-primary">View</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
