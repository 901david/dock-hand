import React from "react";
import { render, RenderResult, fireEvent } from "@testing-library/react";
import { App } from "./App";

describe("App level Integration tests", () => {
  let returnValues: RenderResult;
  beforeEach(() => {
    returnValues = render(<App />);
  });
  test("presents correct title on load", () => {
    const { getByText } = returnValues;
    const mainTitle = getByText(/DockHand/i);
    expect(mainTitle).toBeInTheDocument();
  });

  test("presents correct navigation items on load", () => {
    const { getByTestId } = returnValues;
    const dashBoardNav = getByTestId("dashboard-btn");
    const newContainerNav = getByTestId("new-container-btn");
    expect(dashBoardNav).toBeInTheDocument();
    expect(newContainerNav).toBeInTheDocument();
  });

  test("points to correct url on load", () => {
    const url = window.location.pathname;
    expect(url).toEqual("/dashboard");
  });

  test("renders dashboard text on load", () => {
    const { getByText } = returnValues;
    const runningContainersTitle = getByText(/Running Containers/i);
    const stoppedContainersTitle = getByText(/Stopped Containers/i);
    expect(runningContainersTitle).toBeInTheDocument();
    expect(stoppedContainersTitle).toBeInTheDocument();
  });

  describe("When new container modal is clicked", () => {
    test("renders modal when new container is clicked", () => {
      const {
        getByTestId,
        getByLabelText,
        getByText,
        findByTestId
      } = returnValues;

      fireEvent(
        getByTestId("new-container-btn"),
        new MouseEvent("click", {
          bubbles: true,
          cancelable: true
        })
      );

      const labelText = getByLabelText(/Image Name/i);
      const modalTitle = getByText(/Create a new container/i);
      expect(labelText).toBeInTheDocument();
      expect(modalTitle).toBeInTheDocument();
    });
  });
});
