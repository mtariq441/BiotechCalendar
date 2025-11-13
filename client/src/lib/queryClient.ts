import { QueryClient, QueryFunction } from "@tanstack/react-query";
import { 
  mockEvents, 
  mockCompanies, 
  mockWatchlist,
  getEventsWithDetails,
  getEventWithFullDetails
} from "./mockData";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  if (url.startsWith("/api/ai-analysis/")) {
    const res = await fetch(url, {
      method,
      headers: data ? { "Content-Type": "application/json" } : {},
      body: data ? JSON.stringify(data) : undefined,
    });
    await throwIfResNotOk(res);
    return res;
  }

  throw new Error("API requests disabled - using mock data");
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn = <T>(options: {
  on401: UnauthorizedBehavior;
}): QueryFunction<T> =>
  async ({ queryKey }): Promise<T> => {
    const { on401: unauthorizedBehavior } = options;
    const url = queryKey.join("/") as string;
    
    if (url === "/api/events") {
      await new Promise(resolve => setTimeout(resolve, 300));
      return getEventsWithDetails() as T;
    }
    
    if (url === "/api/companies") {
      await new Promise(resolve => setTimeout(resolve, 200));
      return mockCompanies as T;
    }
    
    if (url === "/api/watchlist") {
      await new Promise(resolve => setTimeout(resolve, 200));
      return mockWatchlist as T;
    }
    
    if (url.startsWith("/api/events/")) {
      const eventId = parseInt(url.split("/").pop() || "0");
      await new Promise(resolve => setTimeout(resolve, 300));
      return getEventWithFullDetails(eventId) as T;
    }
    
    if (url.startsWith("/api/companies/")) {
      const companyId = parseInt(url.split("/").pop() || "0");
      await new Promise(resolve => setTimeout(resolve, 300));
      const company = mockCompanies.find(c => c.id === companyId);
      if (!company) throw new Error("Company not found");
      return company as T;
    }
    
    if (url === "/api/auth/user") {
      return null as T;
    }
    
    if (url.startsWith("/api/ai-analysis/")) {
      const res = await fetch(url);
      if (unauthorizedBehavior === "returnNull" && res.status === 401) {
        return null as T;
      }
      await throwIfResNotOk(res);
      return await res.json();
    }
    
    throw new Error(`Unknown API endpoint: ${url}`);
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
