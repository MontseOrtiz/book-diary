"use client";

import { useActionState } from "react";
import { signIn, type LoginState } from "./actions";

const initial: LoginState = {};

export default function LoginPage() {
  const [state, action, pending] = useActionState(signIn, initial);

  return (
    <main className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center gap-6 px-4 py-16">
      <h1 className="font-serif text-3xl">Entrar</h1>
      <form action={action} className="flex flex-col gap-4">
        <label className="flex flex-col gap-1 text-sm">
          Correo
          <input name="email" type="email" required autoComplete="email" className="field" />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          Contraseña
          <input
            name="password"
            type="password"
            required
            autoComplete="current-password"
            className="field"
          />
        </label>
        <button type="submit" disabled={pending} className="btn-primary">
          {pending ? "Entrando…" : "Entrar"}
        </button>
        {state.error && (
          <p role="alert" className="text-sm text-error">
            {state.error}
          </p>
        )}
      </form>
    </main>
  );
}
