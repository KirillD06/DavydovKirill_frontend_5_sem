import { useState } from "react";
import type { FormEvent } from "react";
import { Button, Form } from "react-bootstrap";
import { Navigate } from "react-router-dom";
import { loginUser, registerUser } from "../api/users";
import { errorMessage } from "../api/errors";
import { RequestStatus } from "../components/RequestStatus";
import { usePageTitle } from "../hooks/usePageTitle";
import { useAppDispatch, useAppSelector } from "../store";
import { signedIn } from "../store/authSlice";

export function LoginPage() {
  usePageTitle("Вход");
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const [registration, setRegistration] = useState(false);
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    setError(null);
    setNotice(null);
    setPending(true);
    try {
      const credentials = { login: login.trim(), password };
      if (registration) {
        await registerUser(credentials);
        setRegistration(false);
        setPassword("");
        setNotice("Аккаунт создан. Теперь можно войти.");
      } else {
        dispatch(signedIn(await loginUser(credentials)));
      }
    } catch (error) {
      setError(errorMessage(error));
    } finally {
      setPending(false);
    }
  }

  if (user) return <Navigate to="/soil_types" replace />;

  return (
    <section className="soil-page" aria-busy={pending}>
      <h1>{registration ? "Регистрация" : "Вход"}</h1>
      <Form className="soil-form" onSubmit={(event) => void submit(event)}>
        <RequestStatus pending={pending} error={error} />
        {notice && <p role="status">{notice}</p>}
        <fieldset disabled={pending} className="soil-form-fields">
          <Form.Group controlId="login">
            <Form.Label>Логин</Form.Label>
            <Form.Control
              value={login} onChange={(event) => setLogin(event.target.value)}
              autoComplete="username" maxLength={50} pattern=".*\S.*" required
            />
          </Form.Group>
          <Form.Group controlId="password">
            <Form.Label>Пароль</Form.Label>
            <Form.Control
              type="password" value={password} onChange={(event) => setPassword(event.target.value)}
              autoComplete={registration ? "new-password" : "current-password"}
              minLength={registration ? 4 : undefined} maxLength={100} required
            />
          </Form.Group>
          <Button variant="warning" type="submit">
            {registration ? "Зарегистрироваться" : "Войти"}
          </Button>
          <Button variant="link" type="button" onClick={() => {
            setRegistration(!registration);
            setError(null);
            setNotice(null);
          }}>
            {registration ? "Ко входу" : "Создать аккаунт"}
          </Button>
        </fieldset>
      </Form>
    </section>
  );
}
