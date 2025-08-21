import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  name: string;
}

const Input: React.FC<InputProps> = ({ label, name, ...props }) => (
  <div className="mb-4">
    <label htmlFor={name} className="block mb-1 font-semibold">{label}</label>
    <input
      {...props}
      name={name}
      id={name}
      className="w-full border border-gray-300 px-3 py-2 rounded"
    />
  </div>
);

export default Input;
