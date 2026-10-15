"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  User,
  Shield,
  Monitor,
  Store,
  ShoppingBag,
  MapPin,
  Package,
  ClipboardList,
  ShieldAlert,
  Users,
  ShieldCheck,
  Key,
  Plug,
  ArrowUpRight,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ============================================================
//  Navigation items
// ============================================================
interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  exact?: boolean;
}

const customerNavItems: NavItem[] = [
  {
    title: "Overview",
    href: "/dashboard",
    icon: LayoutDashboard,
    exact: true,
  },
  {
    title: "My Orders",
    href: "/dashboard/orders",
    icon: ShoppingBag,
  },
  {
    title: "Saved Addresses",
    href: "/dashboard/addresses",
    icon: MapPin,
  },
  {
    title: "Profile",
    href: "/dashboard/profile",
    icon: User,
  },
  {
    title: "Security",
    href: "/dashboard/security",
    icon: Shield,
  },
  {
    title: "Sessions",
    href: "/dashboard/sessions",
    icon: Monitor,
  },
];

const adminNavItems: NavItem[] = [
  {
    title: "Admin Overview",
    href: "/dashboard/admin",
    icon: ShieldAlert,
    exact: true,
  },
  {
    title: "Manage Products",
    href: "/dashboard/admin/products",
    icon: Package,
  },
  {
    title: "Manage Orders",
    href: "/dashboard/admin/orders",
    icon: ClipboardList,
  },
  {
    title: "Manage Users",
    href: "/dashboard/admin/users",
    icon: Users,
  },
  {
    title: "Manage Roles",
    href: "/dashboard/admin/roles",
    icon: ShieldCheck,
  },
  {
    title: "Permissions",
    href: "/dashboard/admin/permissions",
    icon: Key,
  },
];

// ============================================================
//  Component
// ============================================================
export interface SidebarUser {
  id?: string;
  name?: string;
  email?: string;
  roles?: { roleName: string }[];
}

export function Sidebar({ user }: { user?: SidebarUser }) {
  const pathname = usePathname();
  const isAdmin = user?.roles?.some((r) => r.roleName === "ADMIN");

  return (
    <aside className="hidden w-64 shrink-0 border-r border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-[#0A0F1C]/50 lg:flex lg:flex-col">
      {/* ─── Brand ─── */}
      <div className="flex h-[72px] items-center px-6">
        <Link href="/" className="flex items-center gap-3 font-semibold transition-opacity hover:opacity-90">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/20 text-white font-bold text-lg">
            👁️
          </div>
          <span className="text-[17px] tracking-tight text-slate-900 dark:text-white font-bold">
            Eye<span className="text-indigo-600 dark:text-indigo-400">Shop</span>
          </span>
        </Link>
      </div>

      {/* ─── Navigation ─── */}
      <nav className="flex-1 space-y-6 overflow-y-auto p-4">
        {/* Customer Section */}
        <div>
          <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Account & Shopping
          </p>
          <div className="space-y-1">
            {customerNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = item.exact
                ? pathname === item.href
                : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "group flex items-center gap-3 rounded-[10px] px-3.5 py-2.5 text-[14px] font-medium transition-all duration-200",
                    isActive
                      ? "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 shadow-sm border border-indigo-100/50 dark:border-indigo-500/10"
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-200"
                  )}
                >
                  <Icon
                    className={cn(
                      "h-4 w-4 transition-colors",
                      isActive
                        ? "text-indigo-600 dark:text-indigo-400"
                        : "text-slate-400 group-hover:text-slate-500 dark:group-hover:text-slate-300"
                    )}
                  />
                  {item.title}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Admin Section (if admin) */}
        {isAdmin && (
          <div>
            <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-purple-600 dark:text-purple-400">
              Admin Portal
            </p>
            <div className="space-y-1">
              {adminNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = item.exact
                  ? pathname === item.href
                  : pathname.startsWith(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "group flex items-center gap-3 rounded-[10px] px-3.5 py-2.5 text-[14px] font-medium transition-all duration-200",
                      isActive
                        ? "bg-purple-50 dark:bg-purple-500/10 text-purple-700 dark:text-purple-300 shadow-sm border border-purple-100/50 dark:border-purple-500/10"
                        : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-200"
                    )}
                  >
                    <Icon
                      className={cn(
                        "h-4 w-4 transition-colors",
                        isActive
                          ? "text-purple-600 dark:text-purple-400"
                          : "text-slate-400 group-hover:text-slate-500 dark:group-hover:text-slate-300"
                      )}
                    />
                    {item.title}
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </nav>

      {/* ─── Footer links ─── */}
      <div className="p-4 pt-0 space-y-2">
        <Link
          href="/"
          className="group flex items-center justify-between gap-2 rounded-[10px] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 px-4 py-2.5 text-[13px] font-medium text-slate-600 dark:text-slate-400 shadow-sm transition-all hover:border-indigo-300 dark:hover:border-indigo-500/30 hover:text-indigo-600 dark:hover:text-indigo-400"
        >
          <span className="flex items-center gap-2.5">
            <Store className="h-4 w-4 text-slate-400 group-hover:text-indigo-500 transition-colors" />
            Visit Store
          </span>
          <ArrowUpRight className="h-3.5 w-3.5 opacity-50 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100" />
        </Link>
        <Link
          href="/playground"
          className="group flex items-center justify-between gap-2 rounded-[10px] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 px-4 py-2.5 text-[13px] font-medium text-slate-600 dark:text-slate-400 shadow-sm transition-all hover:border-indigo-300 dark:hover:border-indigo-500/30 hover:text-indigo-600 dark:hover:text-indigo-400"
        >
          <span className="flex items-center gap-2.5">
            <Plug className="h-4 w-4 text-slate-400 group-hover:text-indigo-500 transition-colors" />
            API Playground
          </span>
          <ArrowUpRight className="h-3.5 w-3.5 opacity-50 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100" />
        </Link>
      </div>
    </aside>
  );
}
