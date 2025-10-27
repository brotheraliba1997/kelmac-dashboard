'use client';
import { FC } from 'react';
import Link from 'next/link';

interface BlogCardProps {
  _id: string;
  title: string;
  content: string;
  author: string;
}

const BlogCard: FC<BlogCardProps> = ({ _id, title, content, author }) => {
  return (
    <div className="col-md-4 mb-4">
      <div className="card shadow-sm h-100">
        <div className="card-body">
          <h5 className="card-title text-primary">{title}</h5>
          <p className="card-text text-muted">{content.slice(0, 100)}...</p>
          <p className="card-text">
            <small className="text-secondary">By {author}</small>
          </p>
          <Link href={`/blogs/${_id}`} className="btn btn-outline-primary btn-sm mt-2">
            Read More
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BlogCard;
