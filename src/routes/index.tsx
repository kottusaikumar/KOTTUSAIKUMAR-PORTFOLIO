// Route: "/" — TanStack Start file-based routing maps this file's
// path directly to the URL. All actual page content lives in
// src/components/sections/Portfolio.tsx; this file only wires it
// up as the route's component. See src/routes/README.md for the
// file-based routing conventions this project follows.
import { createFileRoute } from "@tanstack/react-router";
import { Portfolio } from "../components/sections/Portfolio";

export const Route = createFileRoute("/")({
  component: Portfolio,
});
