import "@testing-library/jest-dom/vitest";
import { configure } from "@testing-library/react";
import { vi } from "vitest";

// Radix Select's real implementation schedules animation/focus timers and uses
// floating-ui positioning that is extremely slow in jsdom — opening a Select
// takes seconds and leaks pending timers, which stalls the vitest worker. Only
// RouteExplorer uses Select, so replace it with a lightweight controlled
// implementation that runs instantly and deterministically while still
// exercising the app's onValueChange wiring.
vi.mock("@radix-ui/react-select", async () => {
  const React = await import("react");
  const { createContext, useContext, useState } = React;

  const SelectContext = createContext<{
    value: string;
    onValueChange: (v: string) => void;
    open: boolean;
    setOpen: (o: boolean) => void;
  }>({ value: "", onValueChange: () => {}, open: false, setOpen: () => {} });

  const Root = ({
    value,
    onValueChange,
    children,
  }: {
    value: string;
    onValueChange: (v: string) => void;
    children: React.ReactNode;
  }) => {
    const [open, setOpen] = useState(false);
    return React.createElement(
      SelectContext.Provider,
      { value: { value, onValueChange, open, setOpen } },
      children,
    );
  };

  const Trigger = ({
    children,
    ...props
  }: React.ButtonHTMLAttributes<HTMLButtonElement>) => {
    const { setOpen } = useContext(SelectContext);
    return React.createElement(
      "button",
      { type: "button", ...props, onClick: () => setOpen(true) },
      children,
    );
  };

  const Value = ({ placeholder }: { placeholder?: string }) => {
    const { value } = useContext(SelectContext);
    return React.createElement("span", null, value || placeholder);
  };

  const Content = ({ children }: { children: React.ReactNode }) => {
    const { open } = useContext(SelectContext);
    return open ? React.createElement("div", null, children) : null;
  };

  const Item = ({
    value,
    children,
    ...props
  }: {
    value: string;
    children: React.ReactNode;
  }) => {
    const { onValueChange, setOpen } = useContext(SelectContext);
    return React.createElement(
      "div",
      {
        role: "option",
        ...props,
        onClick: () => {
          onValueChange(value);
          setOpen(false);
        },
      },
      children,
    );
  };

  const passthrough = ({ children }: { children: React.ReactNode }) => children;

  return {
    Root,
    Trigger,
    Value,
    Content,
    Item,
    Portal: passthrough,
    Viewport: passthrough,
    Icon: passthrough,
    ItemIndicator: passthrough,
    ItemText: passthrough,
    Group: passthrough,
    Label: passthrough,
    Separator: () => null,
    ScrollUpButton: () => null,
    ScrollDownButton: () => null,
  };
});

// Generated components use `data-ocid` for test hooks rather than the default
// `data-testid`. Configure once so `getByTestId` works against them.
configure({ testIdAttribute: "data-ocid" });

// jsdom does not implement matchMedia; next-themes and several Radix primitives
// call it on mount. Provide a minimal stub that reports no matches.
if (typeof window !== "undefined" && !window.matchMedia) {
  window.matchMedia = (query: string) =>
    ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }) as MediaQueryList;
}

// recharts' ResponsiveContainer observes its container with ResizeObserver,
// which jsdom does not provide. Stub it so charts render without measuring.
if (typeof globalThis !== "undefined" && !("ResizeObserver" in globalThis)) {
  class ResizeObserverStub {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  (globalThis as Record<string, unknown>).ResizeObserver = ResizeObserverStub;
}

// Radix Select calls Element.prototype.hasPointerCapture / setPointerCapture /
// releasePointerCapture during pointer interactions, which jsdom does not
// implement. Polyfill them so opening a Radix Select works in tests.
if (typeof Element !== "undefined" && !Element.prototype.hasPointerCapture) {
  Element.prototype.hasPointerCapture = () => false;
  Element.prototype.setPointerCapture = () => {};
  Element.prototype.releasePointerCapture = () => {};
}

// Radix Select scrolls the highlighted option into view, which jsdom does not
// implement. Polyfill it so opening a Radix Select does not throw.
if (typeof Element !== "undefined" && !Element.prototype.scrollIntoView) {
  Element.prototype.scrollIntoView = () => {};
}
