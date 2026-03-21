const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  DASHBOARD: "/dashboard",
  PROJECTS: "/projects",
  DOCS: "/docs",
  PROJECT: (id: string) => `/projects/${id}` as const,
  FEATURE: (projectId: string, epicId: string) =>
    `/projects/${projectId}/features/${epicId}` as const,
}

const PRIVATE_ROUTE_PREFIXES = ["/dashboard", "/projects"]

export { ROUTES, PRIVATE_ROUTE_PREFIXES }
