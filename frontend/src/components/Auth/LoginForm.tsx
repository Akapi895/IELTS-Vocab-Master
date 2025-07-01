import React from "react";

interface LoginFormProps {
  data: { email: string; password: string };
  onChange: (data: { email: string; password: string }) => void;
  onSubmit: (e: React.FormEvent) => void;
  onSwitch: () => void;
}

export default function LoginForm({
  data,
  onChange,
  onSubmit,
  onSwitch,
}: LoginFormProps) {
  const handleChange = (field: keyof typeof data) => (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...data, [field]: e.target.value });
  };

  return (
    <form
      onSubmit={onSubmit}
      className="flex flex-col gap-4 w-full max-w-md mx-auto"
    >
      {/* Email */}
      <div className="flex flex-col gap-1">
        <label htmlFor="email" className="font-medium text-sm text-gray-700">
          Email
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          required
          className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={data.email}
          onChange={handleChange("email")}
        />
      </div>

      {/* Password */}
      <div className="flex flex-col gap-1">
        <label htmlFor="password" className="font-medium text-sm text-gray-700">
          Password
        </label>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          required
          className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={data.password}
          onChange={handleChange("password")}
        />
      </div>

      <button
        type="submit"
        className="mt-4 py-3 bg-emerald-600 text-white font-semibold rounded hover:bg-emerald-700 transition"
      >
        Login
      </button>

      <div className="text-center text-gray-600 text-sm mt-2">
        Don't have an account?{" "}
        <button
          type="button"
          onClick={onSwitch}
          className="text-emerald-600 font-medium hover:underline"
        >
          Register
        </button>
      </div>
    </form>
  );
}