"use client";

import { useState, useEffect } from "react";
import { apiClient } from "@/lib/api-client";
import { useAuth } from "@/hooks/useAuth";
import { ordersApi } from "@/lib/api/orders";
import { addressesApi } from "@/lib/api/addresses";
import { useCartStore } from "@/lib/cart-store";
import Link from "next/link";
import {
  Shield,
  Key,
  Monitor,
  ShoppingBag,
  MapPin,
  Package,
  Calendar,
  ArrowRight,
  Sparkles,
  Store,
  UserCircle,
  Clock,
} from "lucide-react";
import { StatCard } from "@/components/dashboard/stat-card";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function formatDate(iso: string | null | undefined): string {
  if (!iso) return "N/A";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "N/A";
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];
  return `${months[d.getUTCMonth()]} ${d.getUTCDate()}, ${d.getUTCFullYear()}`;
}

function getGreeting(): string {
  const hour = new Date().getUTCHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export default function DashboardOverviewPage() {
  const { user } = useAuth();
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [loading2FA, setLoading2FA] = useState(true);
  const [sessionsCount, setSessionsCount] = useState<number | null>(null);
  const [ordersCount, setOrdersCount] = useState<number | null>(null);
  const [addressCount, setAddressCount] = useState<number | null>(null);

  const { totalItems, fetchCart } = useCartStore();

  useEffect(() => {
    if (!user) return;
    fetchCart();

    Promise.all([
      apiClient.get("/auth/2fa/status").catch(() => ({ data: { data: { enabled: false } } })),
      apiClient.get("/users/me/sessions").catch(() => ({ data: { data: [] } })),
      ordersApi.getMyOrders(0, 1).catch(() => ({ totalElements: 0 })),
      addressesApi.getAddresses().catch(() => []),
    ])
      .then(([twoFaRes, sessionsRes, ordersRes, addressList]) => {
        setTwoFactorEnabled(twoFaRes.data?.data?.enabled || false);
        setSessionsCount(sessionsRes.data?.data?.length || 1);
        setOrdersCount(ordersRes?.totalElements ?? 0);
        setAddressCount(addressList?.length ?? 0);
      })
      .finally(() => {
        setLoading2FA(false);
      });
  }, [user, fetchCart]);

  if (!user) return null;

  const primaryRole = user.roles?.[0]?.roleName || "USER";
  const firstName = user.name?.split(" ")[0] || "User";
  const isAdmin = user.roles?.some((r) => r.roleName === "ADMIN");

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* ─── Welcome header ─── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            {getGreeting()}, {firstName} <span className="inline-block origin-[70%_70%] animate-[wave_2.5s_ease-in-out_infinite]">👋</span>
          </h1>
          <p className="mt-1.5 text-[15px] text-slate-500">
            Welcome to your EyeShop account dashboard.
          </p>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <Link
            href="/products"
            className={cn(
              buttonVariants({ variant: "default" }),
              "h-10 gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm font-semibold text-xs"
            )}
          >
            <ShoppingBag className="h-4 w-4" />
            Shop Catalog
          </Link>
          <Link
            href="/playground"
            className={cn(
              buttonVariants({ variant: "outline" }),
              "h-10 gap-2 rounded-xl border-slate-200 dark:border-slate-800 text-xs font-semibold"
            )}
          >
            <Sparkles className="h-4 w-4 text-indigo-500" />
            API Playground
          </Link>
        </div>
      </div>

      {/* ─── Stats grid ─── */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Link href="/dashboard/orders" className="block transition-transform hover:-translate-y-0.5">
          <StatCard
            icon={Package}
            label="My Orders"
            value={ordersCount === null ? "..." : ordersCount.toString()}
            hint={ordersCount === 0 ? "No orders placed" : `${ordersCount} total purchases`}
            accent="blue"
          />
        </Link>
        <Link href="/cart" className="block transition-transform hover:-translate-y-0.5">
          <StatCard
            icon={ShoppingBag}
            label="Cart Items"
            value={totalItems.toString()}
            hint={totalItems === 0 ? "Cart is empty" : "Ready for checkout"}
            accent="purple"
          />
        </Link>
        <Link href="/dashboard/addresses" className="block transition-transform hover:-translate-y-0.5">
          <StatCard
            icon={MapPin}
            label="Saved Addresses"
            value={addressCount === null ? "..." : addressCount.toString()}
            hint="Delivery destinations"
            accent="green"
          />
        </Link>
        <Link href="/dashboard/security" className="block transition-transform hover:-translate-y-0.5">
          <StatCard
            icon={Shield}
            label="2FA Protection"
            value={loading2FA ? "..." : twoFactorEnabled ? "Active" : "Disabled"}
            hint={loading2FA ? "Checking" : twoFactorEnabled ? "TOTP protected" : "Add extra layer"}
            accent={loading2FA ? "blue" : twoFactorEnabled ? "green" : "orange"}
          />
        </Link>
      </div>

      {/* ─── Two-column section ─── */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Profile summary card */}
        <div className="lg:col-span-2 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900/50">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/60 px-7 py-5">
            <div>
              <h2 className="text-base font-semibold text-slate-900 dark:text-white">Profile Details</h2>
              <p className="text-[13px] text-slate-500">Your account identity & permissions</p>
            </div>
            <Link
              href="/dashboard/profile"
              className="group flex items-center gap-1 text-[13px] font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors"
            >
              Edit Profile <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>

          <div className="p-7">
            {/* Avatar + name row */}
            <div className="flex items-center gap-5 pb-7 border-b border-slate-100 dark:border-slate-800/60">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-xl font-bold text-white shadow-sm">
                {user.name?.substring(0, 2).toUpperCase() ?? "U"}
              </div>
              <div className="min-w-0 flex-1 space-y-0.5">
                <div className="truncate text-lg font-bold text-slate-900 dark:text-white">{user.name}</div>
                <div className="truncate text-[15px] text-slate-500">{user.email}</div>
              </div>
              <div className="flex items-center gap-1.5 rounded-full border border-emerald-200 dark:border-emerald-500/20 bg-emerald-50 dark:bg-emerald-500/10 px-3 py-1 shadow-sm">
                <div className={cn("h-2 w-2 rounded-full", user.enabled ? "bg-emerald-500 animate-pulse" : "bg-red-500")} />
                <span className="text-[13px] font-semibold text-emerald-700 dark:text-emerald-400">
                  {user.enabled ? "Active" : "Inactive"}
                </span>
              </div>
            </div>

            {/* Details grid */}
            <dl className="grid gap-6 pt-7 sm:grid-cols-2">
              <div className="space-y-1.5">
                <dt className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Provider</dt>
                <dd className="text-[14.5px] font-medium text-slate-900 dark:text-slate-200">
                  {user.provider || "LOCAL"}
                </dd>
              </div>
              <div className="space-y-1.5">
                <dt className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Primary Role</dt>
                <dd className="flex flex-wrap gap-2 pt-0.5">
                  {user.roles?.map((r) => (
                    <span
                      key={r.roleName}
                      className="rounded-md border border-indigo-200 dark:border-indigo-500/20 bg-indigo-50 dark:bg-indigo-500/10 px-2.5 py-1 text-[11px] font-bold text-indigo-700 dark:text-indigo-300 shadow-sm uppercase tracking-wider"
                    >
                      {r.roleName}
                    </span>
                  ))}
                </dd>
              </div>
              <div className="space-y-1.5">
                <dt className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Active Sessions</dt>
                <dd className="text-[14.5px] font-medium text-slate-900 dark:text-slate-200">
                  {sessionsCount ?? 1} signed-in device(s)
                </dd>
              </div>
              <div className="space-y-1.5">
                <dt className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Member Since</dt>
                <dd className="text-[14.5px] font-medium text-slate-900 dark:text-slate-200">
                  {formatDate(user.createdAt)}
                </dd>
              </div>
            </dl>
          </div>
        </div>

        {/* Quick actions card */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900/50">
          <div className="border-b border-slate-100 dark:border-slate-800/60 px-6 py-5">
            <h2 className="text-base font-semibold text-slate-900 dark:text-white">Quick Shortcuts</h2>
            <p className="text-[13px] text-slate-500">Frequent account and store operations</p>
          </div>

          <div className="flex flex-col p-3">
            <QuickAction
              icon={Store}
              title="Shop EyeShop"
              description="Explore latest frames & optics"
              href="/products"
              iconColor="text-indigo-500"
              iconBg="bg-indigo-500/10"
            />
            <QuickAction
              icon={Package}
              title="Track My Orders"
              description="Check shipping & status lifecycle"
              href="/dashboard/orders"
              iconColor="text-blue-500"
              iconBg="bg-blue-500/10"
            />
            <QuickAction
              icon={MapPin}
              title="Delivery Addresses"
              description="Manage shipping locations"
              href="/dashboard/addresses"
              iconColor="text-emerald-500"
              iconBg="bg-emerald-500/10"
            />
            <QuickAction
              icon={Shield}
              title="Security & 2FA"
              description="Configure authenticator app"
              href="/dashboard/security"
              iconColor="text-amber-500"
              iconBg="bg-amber-500/10"
            />
            {isAdmin && (
              <QuickAction
                icon={Sparkles}
                title="Admin Control Center"
                description="Manage products & orders"
                href="/dashboard/admin"
                iconColor="text-purple-500"
                iconBg="bg-purple-500/10"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function QuickAction({
  icon: Icon,
  title,
  description,
  href,
  iconColor,
  iconBg,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  href: string;
  iconColor: string;
  iconBg: string;
}) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-3.5 rounded-xl p-3 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50"
    >
      <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition-transform group-hover:scale-105", iconBg, iconColor)}>
        <Icon className="h-5 w-5" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-[14px] font-semibold text-slate-900 group-hover:text-indigo-600 dark:text-slate-200 dark:group-hover:text-indigo-400 transition-colors">
          {title}
        </div>
        <div className="truncate text-[12px] text-slate-400">{description}</div>
      </div>
      <ArrowRight className="h-4 w-4 text-slate-300 transition-all group-hover:translate-x-0.5 group-hover:text-slate-500 dark:text-slate-600 dark:group-hover:text-slate-400" />
    </Link>
  );
}
