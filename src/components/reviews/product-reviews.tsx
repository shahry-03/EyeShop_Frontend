"use client";

import React, { useState, useEffect, useCallback } from "react";
import type { Review } from "@/types/review";
import type { PageResponse } from "@/types/product";
import { reviewsApi } from "@/lib/api/reviews";
import { useAuth } from "@/hooks/useAuth";
import { ReviewModal } from "./review-modal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Star,
  CheckCircle2,
  Trash2,
  Loader2,
  MessageSquare,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  User,
} from "lucide-react";
import { toast } from "sonner";
import { formatDateTime } from "@/lib/format-time";

interface ProductReviewsProps {
  productId: number;
  productName: string;
  averageRating?: number | null;
  totalReviews?: number | null;
  onReviewChanged: () => void;
}

export function ProductReviews({
  productId,
  productName,
  averageRating,
  totalReviews,
  onReviewChanged,
}: ProductReviewsProps) {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [pageInfo, setPageInfo] = useState<PageResponse<Review> | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const isAdmin = user?.roles?.some(
    (r) => r.roleName === "ADMIN" || r.roleName === "ROLE_ADMIN"
  );

  const fetchReviews = useCallback(async (page: number) => {
    try {
      setIsLoading(true);
      const data = await reviewsApi.getProductReviews(productId, page, 8);
      setReviews(data?.content || []);
      setPageInfo(data);
    } catch {
      setReviews([]);
      setPageInfo(null);
    } finally {
      setIsLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    fetchReviews(currentPage);
  }, [currentPage, fetchReviews]);

  const handleDelete = async (reviewId: number) => {
    if (!confirm("Are you sure you want to delete this review?")) return;

    try {
      setDeletingId(reviewId);
      await reviewsApi.deleteReview(productId, reviewId);
      toast.success("Review deleted successfully");
      fetchReviews(currentPage);
      onReviewChanged();
    } catch (err: unknown) {
      const msg =
        err && typeof err === "object" && "response" in err
          ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
          : "Failed to delete review";
      toast.error(msg || "Failed to delete review");
    } finally {
      setDeletingId(null);
    }
  };

  const handleReviewSuccess = () => {
    setCurrentPage(0);
    fetchReviews(0);
    onReviewChanged();
  };

  const avg = averageRating && averageRating > 0 ? averageRating : 0;
  const count = totalReviews ?? reviews.length;

  return (
    <section id="reviews" className="space-y-8 pt-10 border-t border-slate-200 dark:border-slate-800">
      {/* ─── Section Header ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <MessageSquare className="h-6 w-6 text-indigo-600" />
            Customer Reviews & Ratings
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Real feedback from verified purchasers and verified customers.
          </p>
        </div>

        <Button
          onClick={() => setIsModalOpen(true)}
          className="gap-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-md shadow-indigo-600/20 font-semibold self-start sm:self-auto"
        >
          <Sparkles className="h-4 w-4" /> Write a Review
        </Button>
      </div>

      {/* ─── Ratings Summary Card ─── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-[#0A0F1C] p-6 sm:p-8 shadow-xs">
        {/* Overall Score */}
        <div className="flex flex-col items-center justify-center text-center p-4 border-b md:border-b-0 md:border-r border-slate-100 dark:border-slate-800/80">
          <div className="text-5xl font-black text-slate-900 dark:text-white tracking-tight">
            {avg > 0 ? avg.toFixed(1) : "0.0"}
          </div>
          <div className="flex items-center gap-1 mt-2 text-amber-400">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`h-5 w-5 ${
                  star <= Math.round(avg)
                    ? "fill-current"
                    : "text-slate-200 dark:text-slate-700"
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-slate-400 mt-2 font-medium">
            Based on {count} {count === 1 ? "review" : "reviews"}
          </span>
        </div>

        {/* Rating Breakdown */}
        <div className="flex flex-col justify-center space-y-2 px-2 md:px-4">
          {[5, 4, 3, 2, 1].map((ratingVal) => {
            const countForVal = reviews.filter((r) => r.rating === ratingVal).length;
            const percentage = reviews.length > 0 ? (countForVal / reviews.length) * 100 : 0;

            return (
              <div key={ratingVal} className="flex items-center gap-3 text-xs">
                <span className="w-12 font-medium text-slate-600 dark:text-slate-400 flex items-center gap-1">
                  {ratingVal} <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                </span>
                <div className="flex-1 h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-amber-400 transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="w-8 text-right text-slate-400 font-mono text-[11px]">
                  {countForVal}
                </span>
              </div>
            );
          })}
        </div>

        {/* EyeShop Trust Highlights */}
        <div className="flex flex-col justify-center space-y-3 p-4 border-t md:border-t-0 md:border-l border-slate-100 dark:border-slate-800/80 text-xs text-slate-500">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="h-4 w-4 text-emerald-500 shrink-0" />
            <span>100% verified customer purchase authenticity</span>
          </div>
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="h-4 w-4 text-indigo-500 shrink-0" />
            <span>Community moderation to prevent bot spam</span>
          </div>
          <div className="flex items-center gap-2.5">
            <Sparkles className="h-4 w-4 text-amber-500 shrink-0" />
            <span>Help fellow shoppers choose the right optical fit</span>
          </div>
        </div>
      </div>

      {/* ─── Review List ─── */}
      {isLoading ? (
        <div className="flex h-48 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
        </div>
      ) : reviews.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 p-12 text-center bg-white dark:bg-[#0A0F1C]/40">
          <MessageSquare className="mx-auto h-12 w-12 text-slate-300 dark:text-slate-700 mb-3" />
          <h3 className="font-semibold text-lg text-slate-900 dark:text-white">
            No reviews yet
          </h3>
          <p className="mt-1 text-sm text-slate-500 max-w-sm mx-auto">
            Have you purchased or tested these {productName}? Share your experience to help other buyers.
          </p>
          <Button
            onClick={() => setIsModalOpen(true)}
            className="mt-5 gap-2 bg-indigo-600 text-white rounded-xl shadow-xs"
          >
            <Sparkles className="h-4 w-4" /> Be the first to review
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="divide-y divide-slate-100 dark:divide-slate-800/80 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-[#0A0F1C] p-2 shadow-xs">
            {reviews.map((rev) => {
              const canDelete = isAdmin || (user && user.id === rev.userId);
              const isDeleting = deletingId === rev.id;

              return (
                <div key={rev.id} className="p-6 transition-colors hover:bg-slate-50/50 dark:hover:bg-slate-900/30 rounded-2xl">
                  {/* Review Top Row */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      {/* Avatar */}
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-50 dark:bg-indigo-950/60 font-bold text-sm text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/40">
                        {rev.userName ? rev.userName.charAt(0).toUpperCase() : "U"}
                      </div>

                      {/* Name & Badge */}
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-slate-900 dark:text-white">
                            {rev.userName || "Customer"}
                          </span>
                          {rev.isVerifiedPurchase && (
                            <Badge className="bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/50 text-[10px] font-semibold gap-1 py-0 px-2">
                              <CheckCircle2 className="h-3 w-3" /> Verified Purchase
                            </Badge>
                          )}
                        </div>
                        <span className="text-[11px] text-slate-400">
                          {formatDateTime(rev.createdAt)}
                        </span>
                      </div>
                    </div>

                    {/* Delete action if author or admin */}
                    {canDelete && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-xs"
                        disabled={isDeleting}
                        onClick={() => handleDelete(rev.id)}
                        className="text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
                        title="Delete this review"
                      >
                        {isDeleting ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <Trash2 className="h-3.5 w-3.5" />
                        )}
                      </Button>
                    )}
                  </div>

                  {/* Stars */}
                  <div className="flex items-center gap-1 mt-3 text-amber-400">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-4 w-4 ${
                          star <= rev.rating
                            ? "fill-current"
                            : "text-slate-200 dark:text-slate-700"
                        }`}
                      />
                    ))}
                  </div>

                  {/* Comment */}
                  {rev.comment && (
                    <p className="mt-2.5 text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                      {rev.comment}
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          {/* Pagination */}
          {pageInfo && pageInfo.totalPages > 1 && (
            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-slate-500">
                Page {pageInfo.page + 1} of {pageInfo.totalPages}
              </span>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={pageInfo.first || pageInfo.page <= 0}
                  onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
                  className="gap-1 rounded-xl"
                >
                  <ChevronLeft className="h-4 w-4" /> Previous
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={pageInfo.last || !pageInfo.hasNext}
                  onClick={() => setCurrentPage((p) => p + 1)}
                  className="gap-1 rounded-xl"
                >
                  Next <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Write Review Modal */}
      <ReviewModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        productId={productId}
        productName={productName}
        onSuccess={handleReviewSuccess}
      />
    </section>
  );
}
