import React from "react";

interface RegisterFormProps {
  data: {
    email: string;
    username: string;
    password: string;
    name: string;
    dob: string;
  };
  onChange: (data: RegisterFormProps["data"]) => void;
  onSubmit: (e: React.FormEvent) => void;
  onSwitch: () => void;
}

export default function RegisterForm({ data, onChange, onSubmit, onSwitch }: RegisterFormProps) {
  const handleChange = (field: keyof RegisterFormProps["data"]) => (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...data, [field]: e.target.value });
  };

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4 w-full max-w-md mx-auto">
      {[
        { label: "Email", type: "email", field: "email", autoComplete: "email" },
        { label: "Username", type: "text", field: "username", autoComplete: "username" },
        { label: "Password", type: "password", field: "password", autoComplete: "new-password" },
        { label: "Full Name", type: "text", field: "name", autoComplete: "name" },
        { label: "Date of Birth", type: "date", field: "dob", autoComplete: "bday" },
      ].map(({ label, type, field, autoComplete }) => (
        <div key={field} className="flex flex-col gap-1">
          <label htmlFor={field} className="font-medium text-sm text-gray-700">
            {label}
          </label>
          <input
            id={field}
            type={type}
            autoComplete={autoComplete}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            value={data[field as keyof RegisterFormProps["data"]]}
            onChange={handleChange(field as keyof RegisterFormProps["data"])}
          />
        </div>
      ))}

      <button
        type="submit"
        className="mt-4 py-3 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 transition"
      >
        Register
      </button>

      <div className="text-center text-gray-600 text-sm mt-2">
        Already have an account?{" "}
        <button
          type="button"
          onClick={onSwitch}
          className="text-blue-600 font-medium hover:underline"
        >
          Login
        </button>
      </div>
    </form>
  );
}
