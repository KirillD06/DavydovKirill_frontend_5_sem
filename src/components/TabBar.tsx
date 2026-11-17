import { useState } from "react";
import { Nav, Navbar, Spinner } from "react-bootstrap";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { logoutUser } from "../api/users";
import { errorMessage } from "../api/errors";
import { useAppDispatch, useAppSelector } from "../store";
import { signedOut } from "../store/authSlice";
import { Icon } from "./Icon";

export function TabBar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const mutation = useAppSelector((state) => state.soilTypes.mutation.requestId);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function logout() {
    setPending(true);
    setError(null);
    try {
      await logoutUser();
      dispatch(signedOut());
      navigate("/soil_types", { replace: true });
    } catch (error) {
      setError(errorMessage(error));
    } finally {
      setPending(false);
    }
  }

  return (
    <Navbar className="soil-tabbar" aria-label="Основная навигация">
      {error && <p role="alert" className="soil-logout-error">{error}</p>}
      <Nav className="w-100" inert={Boolean(mutation || pending)}>
        <Nav.Link as={NavLink} to="/soil_types/feed" className="soil-tab">
          <Icon name="feed" /><span>Лента</span>
        </Nav.Link>
        {user ? (
          <Nav.Link as={NavLink} to="/soil_types/draft" className="soil-tab">
            <Icon name="add" /><span>Добавление</span>
          </Nav.Link>
        ) : (
          <Nav.Link as="button" type="button" disabled className="soil-tab">
            <Icon name="add" /><span>Добавление</span>
          </Nav.Link>
        )}
        <Nav.Link
          as={NavLink} to="/soil_types" end className="soil-tab"
          active={/^\/soil_types\/[0-9]+$/.test(pathname)}
        >
          <Icon name="grid" /><span>Плитка</span>
        </Nav.Link>
        {user ? (
          <Nav.Link as="button" type="button" className="soil-tab" onClick={() => void logout()}>
            {pending ? <Spinner size="sm" animation="border" /> : <Icon name="user" />}
            <span>Выход</span>
          </Nav.Link>
        ) : (
          <Nav.Link as={NavLink} to="/users/login" className="soil-tab">
            <Icon name="user" /><span>Вход</span>
          </Nav.Link>
        )}
      </Nav>
    </Navbar>
  );
}
