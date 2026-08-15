import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AuthLayout, {
  Field,
  SubmitButton,
  ErrorBanner,
  C,
} from "../components/AuthLayout";

export default function Login() {
  const { login, loading, error, setError } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", password: "" });

  const onChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await login(form);
      navigate("/coming-soon");
    } catch {
      // error already set in context
    }
  };

  return (
    <AuthLayout
      eyebrow="CONTINUE YOUR RUN"
      title="Welcome Back, Player"
      subtitle="Log in to pick up where the story left off."
      footer={
        <span style={{ color: C.textDim }}>
          New here?{" "}
          <Link to="/register" style={{ color: C.accent }}>
            Create an account
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
          required
        />
        <Field
          label="PASSWORD"
          name="password"
          type="password"
          value={form.password}
          onChange={onChange}
          placeholder="••••••••"
          autoComplete="current-password"
          required
        />
        <SubmitButton type="submit" loading={loading}>
          Log In
        </SubmitButton>
      </form>
    </AuthLayout>
  );
}
