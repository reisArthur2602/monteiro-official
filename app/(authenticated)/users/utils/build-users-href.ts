import type { ListUsersParams } from "../schemas/list-users-params-schema";

export const USERS_PATH = "/users";

export const buildUsersHref = (params: Partial<ListUsersParams>) => {
  const searchParams = new URLSearchParams();

  if (params.search) {
    searchParams.set("search", params.search);
  }

  if (params.role) {
    searchParams.set("role", params.role);
  }

  if (params.status) {
    searchParams.set("status", params.status);
  }

  const query = searchParams.toString();

  return query ? `${USERS_PATH}?${query}` : USERS_PATH;
};

export const hasActiveUsersFilters = (params: ListUsersParams) =>
  Boolean(params.search || params.role || params.status);
