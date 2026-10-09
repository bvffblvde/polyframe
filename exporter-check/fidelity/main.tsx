import { StrictMode, type ComponentType, type ReactNode } from "react";
import { createRoot } from "react-dom/client";

const screens = import.meta.glob<{ default: ComponentType }>("../generated/*/*/*.tsx");

type Wrap = (children: ReactNode) => ReactNode;

const setups: Record<string, () => Promise<Wrap>> = {
  shadcn: async () => {
    await import("./shadcn.css");
    return (c) => c;
  },
  mui: async () => {
    const { CssBaseline, ThemeProvider, createTheme } = await import("@mui/material");
    const theme = createTheme();
    return (c) => (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {c}
      </ThemeProvider>
    );
  },
  mantine: async () => {
    await Promise.all([
      import("@mantine/core/styles.css"),
      import("@mantine/dates/styles.css"),
      import("@mantine/charts/styles.css"),
    ]);
    const { MantineProvider } = await import("@mantine/core");
    return (c) => <MantineProvider>{c}</MantineProvider>;
  },
  antd: async () => {
    await import("antd/dist/reset.css");
    return (c) => c;
  },
  bootstrap: async () => {
    await import("bootstrap/dist/css/bootstrap.min.css");
    return (c) => c;
  },
  chakra: async () => {
    const { ChakraProvider, defaultSystem } = await import("@chakra-ui/react");
    return (c) => <ChakraProvider value={defaultSystem}>{c}</ChakraProvider>;
  },
};

async function main() {
  const params = new URLSearchParams(location.search);
  const target = params.get("target") ?? "";
  const strategy = params.get("strategy") ?? "absolute";
  const file = params.get("file") ?? "";
  const load = screens[`../generated/${target}/${strategy}/${file}`];
  const setup = setups[target];
  const root = createRoot(document.getElementById("root") as HTMLElement);
  if (!load || !setup) {
    root.render(<p>Unknown screen {`${target}/${strategy}/${file}`}</p>);
    return;
  }
  const [wrap, { default: Screen }] = await Promise.all([setup(), load()]);
  root.render(
    <StrictMode>
      <div data-fidelity-root>{wrap(<Screen />)}</div>
    </StrictMode>,
  );
  await document.fonts.ready;
  document.body.dataset.ready = "true";
}

void main();
