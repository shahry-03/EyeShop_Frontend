"use client";

import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";
import {
  Users,
  Shield,
  Key,
  Package,
  ClipboardList,
  Store,
  ArrowRight,
  ShieldAlert,
  FolderTree,
} from "lucide-react";

export default function AdminDashboardPage() {
  const { user } = useAuth();
  if (!user) return null;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              Admin Portal
            </h1>
            <span className="rounded-md border border-purple-200 dark:border-purple-500/20 bg-purple-50 dark:bg-purple-500/10 px-2.5 py-0.5 text-xs font-bold text-purple-700 dark:text-purple-300">
              Admin Role
            </span>
          </div>
          <p className="mt-1 text-sm text-slate-500">
            Complete administration over EyeShop catalog, orders, security, users, and roles.
          </p>
        </div>

        <Link
          href="/products"
          className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-indigo-600 transition-colors shadow-xs self-start sm:self-auto"
        >
          <Store className="h-4 w-4" />
          View Live Store
        </Link>
      </div>

      {/* Grid of Admin modules */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {/* Products */}
        <Link
          href="/dashboard/admin/products"
          className="group flex flex-col justify-between rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-[#0A0F1C] p-6 transition-all hover:-translate-y-1 hover:border-indigo-400 dark:hover:border-indigo-500/40 hover:shadow-lg hover:shadow-indigo-500/5"
        >
          <div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 transition-transform group-hover:scale-105">
              <Package className="h-6 w-6" />
            </div>
            <div className="mt-4">
              <h3 className="font-bold text-base text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                Manage Products
              </h3>
              <p className="mt-1 text-xs text-slate-500 leading-relaxed">
                Add new eyeglasses, update prices, manage product descriptions and categories.
              </p>
            </div>
          </div>
          <div className="mt-6 flex items-center gap-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
            Open Products Catalog <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
          </div>
        </Link>

        {/* Categories */}
        <Link
          href="/dashboard/admin/categories"
          className="group flex flex-col justify-between rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-[#0A0F1C] p-6 transition-all hover:-translate-y-1 hover:border-emerald-400 dark:hover:border-emerald-500/40 hover:shadow-lg hover:shadow-emerald-500/5"
        >
          <div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 transition-transform group-hover:scale-105">
              <FolderTree className="h-6 w-6" />
            </div>
            <div className="mt-4">
              <h3 className="font-bold text-base text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                Manage Categories
              </h3>
              <p className="mt-1 text-xs text-slate-500 leading-relaxed">
                Organize products into hierarchical parent categories and subcategories.
              </p>
            </div>
          </div>
          <div className="mt-6 flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            Open Categories Center <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
          </div>
        </Link>

        {/* Orders */}
        <Link
          href="/dashboard/admin/orders"
          className="group flex flex-col justify-between rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-[#0A0F1C] p-6 transition-all hover:-translate-y-1 hover:border-purple-400 dark:hover:border-purple-500/40 hover:shadow-lg hover:shadow-purple-500/5"
        >
          <div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 transition-transform group-hover:scale-105">
              <ClipboardList className="h-6 w-6" />
            </div>
            <div className="mt-4">
              <h3 className="font-bold text-base text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                Manage Orders
              </h3>
              <p className="mt-1 text-xs text-slate-500 leading-relaxed">
                Review incoming customer orders, change lifecycle states, and append courier tracking notes.
              </p>
            </div>
          </div>
          <div className="mt-6 flex items-center gap-1 text-xs font-semibold text-purple-600 dark:text-purple-400">
            Open Orders Center <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
          </div>
        </Link>

        {/* Users */}
        <Link
          href="/dashboard/admin/users"
          className="group flex flex-col justify-between rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-[#0A0F1C] p-6 transition-all hover:-translate-y-1 hover:border-blue-400 dark:hover:border-blue-500/40 hover:shadow-lg hover:shadow-blue-500/5"
        >
          <div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 transition-transform group-hover:scale-105">
              <Users className="h-6 w-6" />
            </div>
            <div className="mt-4">
              <h3 className="font-bold text-base text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                Manage Users
              </h3>
              <p className="mt-1 text-xs text-slate-500 leading-relaxed">
                Inspect registered user accounts, unlock locked users, toggle activation status, or remove users.
              </p>
            </div>
          </div>
          <div className="mt-6 flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-blue-400">
            Open User Management <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
          </div>
        </Link>

        {/* Roles */}
        <Link
          href="/dashboard/admin/roles"
          className="group flex flex-col justify-between rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-[#0A0F1C] p-6 transition-all hover:-translate-y-1 hover:border-emerald-400 dark:hover:border-emerald-500/40 hover:shadow-lg hover:shadow-emerald-500/5"
        >
          <div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 transition-transform group-hover:scale-105">
              <Shield className="h-6 w-6" />
            </div>
            <div className="mt-4">
              <h3 className="font-bold text-base text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                Manage Roles
              </h3>
              <p className="mt-1 text-xs text-slate-500 leading-relaxed">
                Define custom roles, assign granular permissions, and bind roles to customer/staff accounts.
              </p>
            </div>
          </div>
          <div className="mt-6 flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            Open Roles Configuration <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
          </div>
        </Link>

        {/* Permissions */}
        <Link
          href="/dashboard/admin/permissions"
          className="group flex flex-col justify-between rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-[#0A0F1C] p-6 transition-all hover:-translate-y-1 hover:border-amber-400 dark:hover:border-amber-500/40 hover:shadow-lg hover:shadow-amber-500/5"
        >
          <div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 transition-transform group-hover:scale-105">
              <Key className="h-6 w-6" />
            </div>
            <div className="mt-4">
              <h3 className="font-bold text-base text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                System Permissions
              </h3>
              <p className="mt-1 text-xs text-slate-500 leading-relaxed">
                Inspect and register security authorities for API authorization rules.
              </p>
            </div>
          </div>
          <div className="mt-6 flex items-center gap-1 text-xs font-semibold text-amber-600 dark:text-amber-400">
            Open Permissions <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
          </div>
        </Link>
      </div>
    </div>
  );
}
