'use client';
import React from 'react';

interface ModalProps {
  title: string;
  show: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  confirmText?: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({
  title,
  show,
  onClose,
  onConfirm,
  confirmText = 'Confirm',
  children,
}) => {
  if (!show) return null;

  return (
    <div
      className="modal fade show"
      style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}
      tabIndex={-1}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content shadow">
          <div className="modal-header">
            <h5 className="modal-title">{title}</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>

          <div className="modal-body">{children}</div>

          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onClose}>
              Close
            </button>
            {onConfirm && (
              <button className="btn btn-primary" onClick={onConfirm}>
                {confirmText}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
