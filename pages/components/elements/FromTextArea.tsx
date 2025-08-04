import React from 'react';

interface FormTextareaProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  required?: boolean;
}

const FormTextarea = ({ label, name, value, onChange, required = true }: FormTextareaProps) => (
  <div>
    <label className="block text-black font-medium mb-1">{label}</label>
    <textarea
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      rows={4}
      className="w-full border border-black rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-black"
    ></textarea>
  </div>
);

export default FormTextarea;
