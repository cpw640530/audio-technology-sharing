import { useEffect, useState } from "react";
import { parseSiteRoute } from "../content/topicRoutes";

export function useHashRoute() {
  const [hash, setHash] = useState(() => window.location.hash);
  useEffect(() => {
    const sync = () => setHash(window.location.hash);
    const previousRestoration = window.history.scrollRestoration;
    window.history.scrollRestoration = "manual";
    window.addEventListener("hashchange", sync);
    window.addEventListener("popstate", sync);
    return () => {
      window.history.scrollRestoration = previousRestoration;
      window.removeEventListener("hashchange", sync);
      window.removeEventListener("popstate", sync);
    };
  }, []);
  function navigate(next: string) {
    if (window.location.hash !== next) window.history.pushState(null, "", next);
    setHash(next);
  }
  return { route: parseSiteRoute(hash), navigate };
}
