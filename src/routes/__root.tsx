import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { type ReactNode } from "react";

import appCss from "../styles.css?url";
import { I18nProvider } from "@/lib/i18n";
import { Toaster } from "@/components/ui/sonner";

function NotFoundComponent() {
  return (
    <div className="premium-scene flex min-h-screen items-center justify-center px-4">
      <div className="premium-bg" aria-hidden="true">
        <div className="premium-bg__gradient" />
        <div className="premium-bg__sweep" />
        <div className="premium-bg__metal" />
        <div className="premium-bg__sheen" />
        <div className="premium-bg__grain" />
        <div className="premium-bg__mesh" />
        <div className="premium-bg__wave premium-bg__wave--1" />
        <div className="premium-bg__glow premium-bg__glow--1" />
      </div>
      <div className="glass-panel max-w-md rounded-xl p-8 text-center">
        <p className="font-heading text-8xl font-bold text-primary/25">404</p>
        <h1 className="mt-4 font-heading text-xl font-semibold text-foreground">Page not found</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-8">
          <Link to="/register" className="btn-primary">
            Go to registration
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();

  return (
    <div className="premium-scene flex min-h-screen items-center justify-center px-4">
      <div className="premium-bg" aria-hidden="true">
        <div className="premium-bg__gradient" />
        <div className="premium-bg__sweep" />
        <div className="premium-bg__metal" />
        <div className="premium-bg__sheen" />
        <div className="premium-bg__grain" />
        <div className="premium-bg__mesh" />
        <div className="premium-bg__wave premium-bg__wave--1" />
        <div className="premium-bg__glow premium-bg__glow--1" />
      </div>
      <div className="glass-panel max-w-md rounded-xl p-8 text-center">
        <h1 className="font-heading text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back to registration.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="btn-primary"
          >
            Try again
          </button>
          <a href="/register" className="btn-secondary">
            Go to registration
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "International Student Registration" },
      {
        name: "description",
        content:
          "Secure bilingual registration portal for international students. Register, review, and manage your details in English or French.",
      },
      {
        property: "og:title",
        content: "International Student Registration",
      },
      {
        property: "og:description",
        content: "Secure bilingual registration portal for international students.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "icon", href: "/favicon.png", type: "image/png" },
      {
        rel: "preconnect",
        href: "https://fonts.googleapis.com",
      },
      {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossOrigin: "anonymous",
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Manrope:wght@500;600;700;800&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <>
      <HeadContent />
      {children}
      <Scripts />
    </>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <I18nProvider>
        <Outlet />
        <Toaster richColors position="top-center" />
      </I18nProvider>
    </QueryClientProvider>
  );
}
