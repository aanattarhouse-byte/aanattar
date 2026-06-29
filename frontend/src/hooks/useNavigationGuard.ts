"use client";

import { useCallback, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";

type GuardReason = "empty" | "one-more";
type PendingNavigation =
  | { type: "href"; href: string }
  | { type: "back" }
  | { type: "done" };

type NavigationGuardOptions = {
  enabled: boolean;
  selectedCount: number;
  minimumRequired: number;
  onBlocked: (reason: GuardReason, pendingNavigation?: PendingNavigation) => void;
};

function isModifiedClick(event: MouseEvent) {
  return event.metaKey || event.ctrlKey || event.shiftKey || event.altKey;
}

export function useNavigationGuard({
  enabled,
  selectedCount,
  minimumRequired,
  onBlocked,
}: NavigationGuardOptions) {
  const router = useRouter();
  const pathname = usePathname();
  const bypassRef = useRef(false);
  const currentPathRef = useRef(pathname);

  useEffect(() => {
    currentPathRef.current = pathname;
  }, [pathname]);

  const guardNavigation = useCallback((pendingNavigation?: PendingNavigation) => {
    const reason =
      !enabled || selectedCount >= minimumRequired
        ? null
        : selectedCount === 0
          ? "empty"
          : "one-more";

    if (!reason || bypassRef.current) {
      return true;
    }

    onBlocked(reason, pendingNavigation);
    return false;
  }, [enabled, minimumRequired, onBlocked, selectedCount]);

  const continueNavigation = useCallback((pendingNavigation?: PendingNavigation) => {
    bypassRef.current = true;

    if (!pendingNavigation) {
      return;
    }

    if (pendingNavigation.type === "href") {
      router.push(pendingNavigation.href);
      return;
    }

    window.history.back();
  }, [router]);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const guardedPath = window.location.pathname + window.location.search;
    window.history.replaceState(
      { ...(window.history.state ?? {}), wardrobeGuard: true },
      "",
      guardedPath
    );
    window.history.pushState(
      { ...(window.history.state ?? {}), wardrobeGuard: true },
      "",
      guardedPath
    );

    const handlePopState = () => {
      if (bypassRef.current || selectedCount >= minimumRequired) {
        return;
      }

      window.history.pushState(
        { ...(window.history.state ?? {}), wardrobeGuard: true },
        "",
        guardedPath
      );
      onBlocked(selectedCount === 0 ? "empty" : "one-more", { type: "back" });
    };

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (bypassRef.current || selectedCount >= minimumRequired) {
        return;
      }

      event.preventDefault();
      event.returnValue = "";
    };

    window.addEventListener("popstate", handlePopState);
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("popstate", handlePopState);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [enabled, minimumRequired, onBlocked, selectedCount]);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const handleDocumentClick = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        isModifiedClick(event) ||
        bypassRef.current ||
        selectedCount >= minimumRequired
      ) {
        return;
      }

      const anchor = (event.target as Element | null)?.closest("a[href]");

      if (!anchor) {
        return;
      }

      const href = anchor.getAttribute("href");

      if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) {
        return;
      }

      const url = new URL(href, window.location.href);

      if (url.origin !== window.location.origin || url.pathname === currentPathRef.current) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();
      guardNavigation({ type: "href", href: `${url.pathname}${url.search}${url.hash}` });
    };

    document.addEventListener("click", handleDocumentClick, true);

    return () => document.removeEventListener("click", handleDocumentClick, true);
  }, [enabled, guardNavigation, minimumRequired, selectedCount]);

  return {
    guardNavigation,
    continueNavigation,
  };
}

export type { GuardReason, PendingNavigation };
