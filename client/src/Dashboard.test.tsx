import React from "react";
import { render, RenderResult, fireEvent, act } from "@testing-library/react";
import { Dashboard } from "./components/Dashboard";
import { screen } from "@testing-library/dom";
import SocketMock from "socket.io-mock";

const startedContainers = [
  {
    Id: "63fbf9ae4a9bb61231d8bd7ca3b244bbafa7680855abb39ab4ded9f593964fd4",
    Names: "Jenkins_Docker",
    State: "running",
    Status: "Up 2 days",
    Image: "4990814/dock-hand-dev",
    Mounts: [
      {
        Type: "Volume",
        Source: "N/A",
        Destination: "C:/",
        Mode: "RW",
        RW: true,
        Propagation: "yes"
      }
    ],
    Volumes: ["C:/var", "F:/dev"],
    Command: "docker-entrypoint.sh npm run start:dev",
    Ports: [
      {
        IP: "10.3.4.2",
        PrivatePort: 230,
        PublicPort: 430,
        Type: "HTTP"
      }
    ]
  },
  {
    Id: "63fbf9ae4a9bb61231d8bd7ca3b244bbafa7680855abb39ab4ded9f593964fd4-2",
    Names: "Jenkins_Docker-2",
    State: "running",
    Status: "Up 5 days",
    Image: "4990814/dock-hand-dev-2",
    Mounts: [
      {
        Type: "VOLUME",
        Source: "N/A",
        Destination: "C:/",
        Mode: "RW",
        RW: true,
        Propagation: "yes"
      }
    ],
    Volumes: ["C:/www"],
    Command: "docker-entrypoint.sh npm run start:dev",
    Ports: [
      {
        IP: "10.3.4.2",
        PrivatePort: 230,
        PublicPort: 430,
        Type: "HTTP"
      },
      {
        IP: "10.3.4.4",
        PrivatePort: 240,
        PublicPort: 930,
        Type: "TCP"
      }
    ]
  }
];

const stoppedContainers = [
  {
    Id: "63fbf9ae4a9bb61231d8bd7ca3b244bbafa7680855abb39ab4ded9f593964fd4",
    Names: "Jenkins_Docker",
    State: "down",
    Status: "Down 2 days",
    Image: "4990814/dock-hand-dev",
    Mounts: [
      {
        Type: "Volume",
        Source: "N/A",
        Destination: "C:/",
        Mode: "RW",
        RW: true,
        Propagation: "yes"
      }
    ],
    Volumes: ["C:/var", "F:/dev"],
    Command: "docker-entrypoint.sh npm run start:dev",
    Ports: [
      {
        IP: "10.3.4.2",
        PrivatePort: 230,
        PublicPort: 430,
        Type: "HTTP"
      }
    ]
  },
  {
    Id: "63fbf9ae4a9bb61231d8bd7ca3b244bbafa7680855abb39ab4ded9f593964fd4-2",
    Names: "Jenkins_Docker-2",
    State: "down",
    Status: "Down 5 days",
    Image: "4990814/dock-hand-dev-2",
    Mounts: [
      {
        Type: "VOLUME",
        Source: "N/A",
        Destination: "C:/",
        Mode: "RW",
        RW: true,
        Propagation: "yes"
      }
    ],
    Volumes: ["C:/www"],
    Command: "docker-entrypoint.sh npm run start:dev",
    Ports: [
      {
        IP: "10.3.4.2",
        PrivatePort: 230,
        PublicPort: 430,
        Type: "HTTP"
      },
      {
        IP: "10.3.4.4",
        PrivatePort: 240,
        PublicPort: 930,
        Type: "TCP"
      }
    ]
  }
];

describe("Dashboard level Integration tests", () => {
  let returnValues;
  const socket = new SocketMock();

  beforeEach(() => {
    returnValues = render(<Dashboard />);
  });

  test("renders dashboard text on load", () => {
    const { getByText } = returnValues;
    const runningContainersTitle = getByText(/Running Containers/i);
    const stoppedContainersTitle = getByText(/Stopped Containers/i);
    expect(runningContainersTitle).toBeInTheDocument();
    expect(stoppedContainersTitle).toBeInTheDocument();
  });

  test("should render correct text when no stopped or running containers present", () => {
    const { getAllByTestId, rerender } = returnValues;
    rerender(<Dashboard />);
    const [innerRunningContainers, innerStopperContainers] = getAllByTestId(
      "no-containers"
    );
    expect(innerRunningContainers.textContent).toEqual("No containers to show");
    expect(innerStopperContainers.textContent).toEqual("No containers to show");
  });

  test.skip("should render containers collapsed", () => {
    const { getAllByTestId, rerender } = returnValues;
    rerender(<Dashboard />);
    const [innerRunningContainers, innerStopperContainers] = getAllByTestId(
      "no-containers"
    );
    expect(innerRunningContainers).toBeFalsy();
    expect(innerStopperContainers.textContent).toEqual("No containers to show");
  });

  test.skip("should expand wrappers when icons are clicked", () => {
    const { getByText } = returnValues;
    const runningContainersTitle = getByText(/Running Containers/i);
    const stoppedContainersTitle = getByText(/Stopped Containers/i);
    fireEvent.click();
    expect(runningContainersTitle).toBeInTheDocument();
    expect(stoppedContainersTitle).toBeInTheDocument();
  });

  test.skip("should collapse again when clicked again", () => {
    const { getByText } = returnValues;
    const runningContainersTitle = getByText(/Running Containers/i);
    const stoppedContainersTitle = getByText(/Stopped Containers/i);
    expect(runningContainersTitle).toBeInTheDocument();
    expect(stoppedContainersTitle).toBeInTheDocument();
  });

  test("should render correct number of started coontainers", () => {
    socket.socketClient.emit(
      "containers.list",
      startedContainers.concat(stoppedContainers)
    );
    const { getAllByTestId } = returnValues;
    const [runningContainersEl, stoppedContainersEl] = getAllByTestId(
      "container-list-wrapper"
    );
    screen.debug(runningContainersEl);
    expect(runningContainersEl.children.length).toEqual(
      startedContainers.length
    );
    expect(stoppedContainersEl.children.length).toEqual(
      startedContainers.length
    );
  });

  test.skip("should render correct number of stopped coontainers", () => {
    const { getByText } = returnValues;
    const runningContainersTitle = getByText(/Running Containers/i);
    const stoppedContainersTitle = getByText(/Stopped Containers/i);
    expect(runningContainersTitle).toBeInTheDocument();
    expect(stoppedContainersTitle).toBeInTheDocument();
  });

  describe("Container Specific interactions", () => {
    describe("Starting and Stopping containers", () => {
      test.skip("should move container to stopped once stop is clicked and receive correct info  to stop", () => {
        const { getByText } = returnValues;
        const runningContainersTitle = getByText(/Running Containers/i);
        const stoppedContainersTitle = getByText(/Stopped Containers/i);
        expect(runningContainersTitle).toBeInTheDocument();
        expect(stoppedContainersTitle).toBeInTheDocument();
      });

      test.skip("should move container to started once start is clicked and receive correct info  to start", () => {
        const { getByText } = returnValues;
        const runningContainersTitle = getByText(/Running Containers/i);
        const stoppedContainersTitle = getByText(/Stopped Containers/i);
        expect(runningContainersTitle).toBeInTheDocument();
        expect(stoppedContainersTitle).toBeInTheDocument();
      });
    });

    describe("Containers which are started", () => {
      test.skip("expand should enlarge the container", () => {
        const { getByText } = returnValues;
        const runningContainersTitle = getByText(/Running Containers/i);
        const stoppedContainersTitle = getByText(/Stopped Containers/i);
        expect(runningContainersTitle).toBeInTheDocument();
        expect(stoppedContainersTitle).toBeInTheDocument();
      });

      test.skip("running text should have a green background", () => {
        const { getByText } = returnValues;
        const runningContainersTitle = getByText(/Running Containers/i);
        const stoppedContainersTitle = getByText(/Stopped Containers/i);
        expect(runningContainersTitle).toBeInTheDocument();
        expect(stoppedContainersTitle).toBeInTheDocument();
      });

      test.skip("stop icon should be showing", () => {
        const { getByText } = returnValues;
        const runningContainersTitle = getByText(/Running Containers/i);
        const stoppedContainersTitle = getByText(/Stopped Containers/i);
        expect(runningContainersTitle).toBeInTheDocument();
        expect(stoppedContainersTitle).toBeInTheDocument();
      });

      test.skip("should show correct status", () => {
        const { getByText } = returnValues;
        const runningContainersTitle = getByText(/Running Containers/i);
        const stoppedContainersTitle = getByText(/Stopped Containers/i);
        expect(runningContainersTitle).toBeInTheDocument();
        expect(stoppedContainersTitle).toBeInTheDocument();
      });

      test.skip("should show correct ID", () => {
        const { getByText } = returnValues;
        const runningContainersTitle = getByText(/Running Containers/i);
        const stoppedContainersTitle = getByText(/Stopped Containers/i);
        expect(runningContainersTitle).toBeInTheDocument();
        expect(stoppedContainersTitle).toBeInTheDocument();
      });

      test.skip("should show correct Image", () => {
        const { getByText } = returnValues;
        const runningContainersTitle = getByText(/Running Containers/i);
        const stoppedContainersTitle = getByText(/Stopped Containers/i);
        expect(runningContainersTitle).toBeInTheDocument();
        expect(stoppedContainersTitle).toBeInTheDocument();
      });

      test.skip("should show correct Volumes", () => {
        const { getByText } = returnValues;
        const runningContainersTitle = getByText(/Running Containers/i);
        const stoppedContainersTitle = getByText(/Stopped Containers/i);
        expect(runningContainersTitle).toBeInTheDocument();
        expect(stoppedContainersTitle).toBeInTheDocument();
      });

      test.skip("should show correct mounts", () => {
        const { getByText } = returnValues;
        const runningContainersTitle = getByText(/Running Containers/i);
        const stoppedContainersTitle = getByText(/Stopped Containers/i);
        expect(runningContainersTitle).toBeInTheDocument();
        expect(stoppedContainersTitle).toBeInTheDocument();
      });

      test.skip("should show correct ports", () => {
        const { getByText } = returnValues;
        const runningContainersTitle = getByText(/Running Containers/i);
        const stoppedContainersTitle = getByText(/Stopped Containers/i);
        expect(runningContainersTitle).toBeInTheDocument();
        expect(stoppedContainersTitle).toBeInTheDocument();
      });

      test.skip("should show correct command", () => {
        const { getByText } = returnValues;
        const runningContainersTitle = getByText(/Running Containers/i);
        const stoppedContainersTitle = getByText(/Stopped Containers/i);
        expect(runningContainersTitle).toBeInTheDocument();
        expect(stoppedContainersTitle).toBeInTheDocument();
      });
    });

    describe("Logs and Log filtering", () => {
      test.skip("should show correct message when no logs exist for container", () => {
        const { getByText } = returnValues;
        const runningContainersTitle = getByText(/Running Containers/i);
        const stoppedContainersTitle = getByText(/Stopped Containers/i);
        expect(runningContainersTitle).toBeInTheDocument();
        expect(stoppedContainersTitle).toBeInTheDocument();
      });

      test.skip("should start streaming logs when correct icon is clicked", () => {
        const { getByText } = returnValues;
        const runningContainersTitle = getByText(/Running Containers/i);
        const stoppedContainersTitle = getByText(/Stopped Containers/i);
        expect(runningContainersTitle).toBeInTheDocument();
        expect(stoppedContainersTitle).toBeInTheDocument();
      });

      test.skip("should stop streaming logs when correct icon is clicked", () => {
        const { getByText } = returnValues;
        const runningContainersTitle = getByText(/Running Containers/i);
        const stoppedContainersTitle = getByText(/Stopped Containers/i);
        expect(runningContainersTitle).toBeInTheDocument();
        expect(stoppedContainersTitle).toBeInTheDocument();
      });

      test.skip("should show correct icon color while streaming", () => {
        const { getByText } = returnValues;
        const runningContainersTitle = getByText(/Running Containers/i);
        const stoppedContainersTitle = getByText(/Stopped Containers/i);
        expect(runningContainersTitle).toBeInTheDocument();
        expect(stoppedContainersTitle).toBeInTheDocument();
      });

      test.skip("should show correct icon color while not streaming", () => {
        const { getByText } = returnValues;
        const runningContainersTitle = getByText(/Running Containers/i);
        const stoppedContainersTitle = getByText(/Stopped Containers/i);
        expect(runningContainersTitle).toBeInTheDocument();
        expect(stoppedContainersTitle).toBeInTheDocument();
      });

      test.skip("should show correct icon color for filter when no logs are streamed", () => {
        const { getByText } = returnValues;
        const runningContainersTitle = getByText(/Running Containers/i);
        const stoppedContainersTitle = getByText(/Stopped Containers/i);
        expect(runningContainersTitle).toBeInTheDocument();
        expect(stoppedContainersTitle).toBeInTheDocument();
      });

      test.skip("should show correct icon color for filter when logs are streamed", () => {
        const { getByText } = returnValues;
        const runningContainersTitle = getByText(/Running Containers/i);
        const stoppedContainersTitle = getByText(/Stopped Containers/i);
        expect(runningContainersTitle).toBeInTheDocument();
        expect(stoppedContainersTitle).toBeInTheDocument();
      });

      test.skip("should open filter bar when  filter icon  is clicked and is closed", () => {
        const { getByText } = returnValues;
        const runningContainersTitle = getByText(/Running Containers/i);
        const stoppedContainersTitle = getByText(/Stopped Containers/i);
        expect(runningContainersTitle).toBeInTheDocument();
        expect(stoppedContainersTitle).toBeInTheDocument();
      });

      test.skip("should close filter bar when  filter icon  is clicked and is open", () => {
        const { getByText } = returnValues;
        const runningContainersTitle = getByText(/Running Containers/i);
        const stoppedContainersTitle = getByText(/Stopped Containers/i);
        expect(runningContainersTitle).toBeInTheDocument();
        expect(stoppedContainersTitle).toBeInTheDocument();
      });

      test.skip("should clear filtering when closing filter bar with filters applied using filter icon", () => {
        const { getByText } = returnValues;
        const runningContainersTitle = getByText(/Running Containers/i);
        const stoppedContainersTitle = getByText(/Stopped Containers/i);
        expect(runningContainersTitle).toBeInTheDocument();
        expect(stoppedContainersTitle).toBeInTheDocument();
      });

      test.skip("should open filter bar whe you click on magnify glass", () => {
        const { getByText } = returnValues;
        const runningContainersTitle = getByText(/Running Containers/i);
        const stoppedContainersTitle = getByText(/Stopped Containers/i);
        expect(runningContainersTitle).toBeInTheDocument();
        expect(stoppedContainersTitle).toBeInTheDocument();
      });

      test.skip("should clear filtering when closing filter bar with X", () => {
        const { getByText } = returnValues;
        const runningContainersTitle = getByText(/Running Containers/i);
        const stoppedContainersTitle = getByText(/Stopped Containers/i);
        expect(runningContainersTitle).toBeInTheDocument();
        expect(stoppedContainersTitle).toBeInTheDocument();
      });

      test.skip("should filter logs as typing text", () => {
        const { getByText } = returnValues;
        const runningContainersTitle = getByText(/Running Containers/i);
        const stoppedContainersTitle = getByText(/Stopped Containers/i);
        expect(runningContainersTitle).toBeInTheDocument();
        expect(stoppedContainersTitle).toBeInTheDocument();
      });

      test.skip("should hide quick filters to start", () => {
        const { getByText } = returnValues;
        const runningContainersTitle = getByText(/Running Containers/i);
        const stoppedContainersTitle = getByText(/Stopped Containers/i);
        expect(runningContainersTitle).toBeInTheDocument();
        expect(stoppedContainersTitle).toBeInTheDocument();
      });

      test.skip("should show correct icon color for quick filters icon when no logs present", () => {
        const { getByText } = returnValues;
        const runningContainersTitle = getByText(/Running Containers/i);
        const stoppedContainersTitle = getByText(/Stopped Containers/i);
        expect(runningContainersTitle).toBeInTheDocument();
        expect(stoppedContainersTitle).toBeInTheDocument();
      });

      test.skip("should show correct icon color for quick filters icon when logs present", () => {
        const { getByText } = returnValues;
        const runningContainersTitle = getByText(/Running Containers/i);
        const stoppedContainersTitle = getByText(/Stopped Containers/i);
        expect(runningContainersTitle).toBeInTheDocument();
        expect(stoppedContainersTitle).toBeInTheDocument();
      });

      test.skip("should show quick filters when you click icon and logs present", () => {
        const { getByText } = returnValues;
        const runningContainersTitle = getByText(/Running Containers/i);
        const stoppedContainersTitle = getByText(/Stopped Containers/i);
        expect(runningContainersTitle).toBeInTheDocument();
        expect(stoppedContainersTitle).toBeInTheDocument();
      });

      test.skip("should not show quick filters when you click icon and logs are not present", () => {
        const { getByText } = returnValues;
        const runningContainersTitle = getByText(/Running Containers/i);
        const stoppedContainersTitle = getByText(/Stopped Containers/i);
        expect(runningContainersTitle).toBeInTheDocument();
        expect(stoppedContainersTitle).toBeInTheDocument();
      });

      test.skip("should correctly  filter by quick filter when one applied", () => {
        const { getByText } = returnValues;
        const runningContainersTitle = getByText(/Running Containers/i);
        const stoppedContainersTitle = getByText(/Stopped Containers/i);
        expect(runningContainersTitle).toBeInTheDocument();
        expect(stoppedContainersTitle).toBeInTheDocument();
      });

      test.skip("should correctly  filter by quick filter when  multiple quick filters applied", () => {
        const { getByText } = returnValues;
        const runningContainersTitle = getByText(/Running Containers/i);
        const stoppedContainersTitle = getByText(/Stopped Containers/i);
        expect(runningContainersTitle).toBeInTheDocument();
        expect(stoppedContainersTitle).toBeInTheDocument();
      });

      test.skip("should correctly  filter by quick filter when  multiple quick filters applied and custom filter", () => {
        const { getByText } = returnValues;
        const runningContainersTitle = getByText(/Running Containers/i);
        const stoppedContainersTitle = getByText(/Stopped Containers/i);
        expect(runningContainersTitle).toBeInTheDocument();
        expect(stoppedContainersTitle).toBeInTheDocument();
      });
    });
  });
});
