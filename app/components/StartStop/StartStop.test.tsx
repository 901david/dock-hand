import * as React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";

import { StartStopIcon } from "./StartStop";

describe("Start Stop Icon Tests", () => {
  test("should show red background when stopped", () => {
    const mockHandleAction = jest.fn();
    const { container } = render(
      <StartStopIcon type={"stop"} handleAction={mockHandleAction} />
    );
  });
});
