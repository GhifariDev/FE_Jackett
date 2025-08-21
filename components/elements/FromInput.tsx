import React from 'react';

interface FormInputProps {
  label: string;
  name: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
}

const FormInput = ({ label, name, type = 'text', value, onChange, required = true }: FormInputProps) => (
  <div>
    <label className="block text-black font-medium mb-1">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      className="w-full border border-black rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-black"
    />
  </div>
);

export default FormInput;