import { ThemeProvider } from "@/lib/theme";
import { rootRoute } from "@/routes/__root";
import { aboutRoute } from "@/routes/about";
import { airlinesRoute } from "@/routes/airlines";
import { analyticsRoute } from "@/routes/analytics";
import { apiRoute } from "@/routes/api";
import { dataQualityRoute } from "@/routes/data-quality";
import { indexRoute } from "@/routes/index";
import { liveIndexRoute } from "@/routes/live-index";
import { mapRoute } from "@/routes/map";
import { methodologyRoute } from "@/routes/methodology";
import { routesRoute } from "@/routes/routes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { render } from "@testing-library/react";
import type { ReactElement } from "react";

const routeTree = rootRoute.addChildren([
  indexRoute.addChildren([
    liveIndexRoute,
    routesRoute,
    airlinesRoute,
    analyticsRoute,
    methodologyRoute,
    dataQualityRoute,
    apiRoute,
    aboutRoute,
    mapRoute,
  ]),
]);

export function createTestRouter() {
  return createRouter({ routeTree });
}

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof createTestRouter>;
  }
}

/**
 * Renders the full app (router + providers) exactly as main.tsx does, minus the
 * InternetIdentityProvider, which none of the app's pages consume. The app's
 * pages are static demo-data views, so the auth provider is an unnecessary seam
 * that would otherwise attempt network/config work in jsdom.
 *
 * A fresh router is created per call so navigation state does not leak between
 * tests.
 */
export async function renderApp() {
  // Reset the browser location so a fresh router starts at the home page.
  // Without this, navigation from a previous test (history.pushState) leaks
  // into the next test's router initial load.
  window.history.replaceState({}, "", "/");
  const router = createTestRouter();
  await router.load();
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <RouterProvider router={router} />
      </ThemeProvider>
    </QueryClientProvider>,
  );
}

export function renderWithProviders(ui: ReactElement) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>{ui}</ThemeProvider>
    </QueryClientProvider>,
  );
}
