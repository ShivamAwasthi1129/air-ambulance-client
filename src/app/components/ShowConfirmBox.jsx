import React from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ConfirmBox = ({ message, onConfirm, onCancel }) => {
  return (
    <div>
      <p>{message}</p>
      <button onClick={onConfirm}>Yes</button>
      <button onClick={onCancel}>No</button>
    </div>
  );
};

const showConfirmBox = (message, onConfirm, onCancel) => {
  toast(
    <ConfirmBox
      message={message}
      onConfirm={() => {
        onConfirm();
        toast.dismiss();
      }}
      onCancel={() => {
        onCancel();
        toast.dismiss();
      }}
    />,
    {
      position: "top-center",
      autoClose: false,
      closeButton: false,
      draggable: false,
      closeOnClick: false,
    }
  );
};

export default showConfirmBox;