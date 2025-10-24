'use client';
import { FC } from 'react';

interface CompanyCardProps {
  name: string;
  region: string;
  currency: string;
  employees: number;
  discount?: number;
}

const CompanyCard: FC<CompanyCardProps> = ({ name, region, currency, employees, discount }) => {
  return (
    <div className="col-md-4 mb-4">
      <div className="card shadow-sm h-100">
        <div className="card-body">
          <h5 className="card-title text-primary">{name}</h5>
          <p className="text-muted mb-1">
            <strong>Region:</strong> {region}
          </p>
          <p className="text-muted mb-1">
            <strong>Currency:</strong> {currency}
          </p>
          <p className="text-muted mb-1">
            <strong>Employees:</strong> {employees}
          </p>
          {discount && (
            <p className="text-success">
              <strong>Regional Discount:</strong> {discount}%
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompanyCard;
