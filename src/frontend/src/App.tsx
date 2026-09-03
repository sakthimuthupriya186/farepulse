import { RouterProvider, createRouter } from "@tanstack/react-router";

import { rootRoute } from "./routes/__root";
import { aboutRoute } from "./routes/about";
import { airlinesRoute } from "./routes/airlines";
import { analyticsRoute } from "./routes/analytics";
import { apiRoute } from "./routes/api";
import { dataQualityRoute } from "./routes/data-quality";
import { indexRoute } from "./routes/index";
import { liveIndexRoute } from "./routes/live-index";
import { mapRoute } from "./routes/map";
import { methodologyRoute } from "./routes/methodology";
import { routesRoute } from "./routes/routes";

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

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
