import { Nav, Navbar } from "react-bootstrap";
import { NavLink, useLocation } from "react-router-dom";
import { Icon } from "./Icon";

export function TabBar() {
  const { pathname } = useLocation();
  return (
    <Navbar className="soil-tabbar" aria-label="Основная навигация">
      <Nav className="w-100">
        <Nav.Link
          as={NavLink}
          to="/soil_types/feed"
          className="soil-tab"
          active={pathname === "/soil_types/feed"}
        >
          <Icon name="feed" />
          <span>Лента</span>
        </Nav.Link>
        <Nav.Link
          as="button"
          type="button"
          disabled
          className="soil-tab"
          title="Добавление будет доступно после подключения входа"
        >
          <Icon name="add" />
          <span>Добавление</span>
        </Nav.Link>
        <Nav.Link
          as={NavLink}
          to="/soil_types"
          end
          className="soil-tab"
          active={pathname.startsWith("/soil_types/") && pathname !== "/soil_types/feed"}
        >
          <Icon name="grid" />
          <span>Плитка</span>
        </Nav.Link>
        <Nav.Link
          as="button"
          type="button"
          disabled
          className="soil-tab"
          title="Вход будет доступен в следующей лабораторной"
        >
          <Icon name="user" />
          <span>Вход</span>
        </Nav.Link>
      </Nav>
    </Navbar>
  );
}
