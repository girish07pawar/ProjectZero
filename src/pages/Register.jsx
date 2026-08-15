import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AuthLayout, {
  Field,
  SubmitButton,
  ErrorBanner,
  C,
} from "../components/AuthLayout";

export default function Register() {
  const { register, loading, error, setError } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    displayName: "",
  });

  const onChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await register(form);
      navigate("/coming-soon");
    } catch {
      // error already set in context
    }
  };

  return (
    <AuthLayout
      eyebrow="BEGIN CHAPTER 1"
      title="Create Your Character"
      subtitle="Every legend starts at level 1."
      footer={
        <span style={{ color: C.textDim }}>
          Already playing?{" "}
          <Link to="/login" style={{ color: C.accent }}>
            Log in
          </Link>
        </span>
      }
    >
      <ErrorBanner message={error} />
      <form onSubmit={onSubmit}>
        <Field
          label="USERNAME"
          name="username"
          value={form.username}
          onChange={onChange}
          placeholder="player01"
          autoComplete="username"
          minLength={3}
          maxLength={50}
          required
        />
        <Field
          label="EMAIL"
          name="email"
          type="email"
          value={form.email}
          onChange={onChange}
          placeholder="you@email.com"
          autoComplete="email"
          required
        />
        <Field
          label="DISPLAY NAME (OPTIONAL)"
          name="displayName"
          value={form.displayName}
          onChange={onChange}
          placeholder="Player One"
          autoComplete="nickname"
        />
        <Field
          label="PASSWORD"
          name="password"
          type="password"
          value={form.password}
          onChange={onChange}
          placeholder="min. 6 characters"
          autoComplete="new-password"
          minLength={6}
          required
        />
        <SubmitButton type="submit" loading={loading}>
          Create Account
        </SubmitButton>
      </form>
    </AuthLayout>
  );
}
