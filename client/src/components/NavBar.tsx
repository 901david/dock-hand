import * as React from "react";
import styled from "styled-components";
import { withRouter } from "react-router-dom";

import { NavItem } from "./NavItem";

const NavWrapper = styled.div`
  background: black;
  width: 100vw;
  height: 50px;
  color: white;
  display: flex;
  &:first-child {
    margin-left: 20px;
  }
  a,
  a:visited,
  a:active {
    color: white;
    text-decoration: none;
  }
`;

type NavOptions = Array<NavOption>;

export interface NavOption {
  icon: any | null;
  title: string;
  path: string;
  testId: string;
}

const navOptions: NavOptions = [
  {
    icon: null,
    title: "Dashboard",
    path: "/dashboard",
    testId: "dashboard-btn"
  },
  {
    icon: null,
    title: "New Container",
    path: "#newContainerModal",
    testId: "new-container-btn"
  }
  //   { icon: null, title: "New Compose Cluster", path: "/new/compose/start" },
  //   { icon: null, title: "New Compose File", path: "/new/compose/create" }
];

const NavBarBase: React.FC<{ location?: any }> = props => {
  return (
    <NavWrapper data-testid="nav-wrapper">
      {navOptions.map((navOption, index) => {
        return (
          <NavItem
            key={index + 876}
            isSelected={props.location.pathname === navOption.path}
            data={navOption}
          />
        );
      })}
    </NavWrapper>
  );
};
export const NavBar = withRouter(NavBarBase);
