"use client";

import React, { useState } from "react";
import { reviewsApi } from "@/lib/api/reviews";
import type { ReviewRequest } from "@/types/review";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Star, Loader2, Sparkles, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

interface ReviewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  productId: number;
  productName: string;
  onSuccess: () => void;
}

const RATING_LABELS: Record<number, string> = {
  1: "Poor",
  2: "Fair",
  3: "Good",
  4: "Very Good",
  5: "Excellent - Highly Recommended",
};

export function ReviewModal({
  open,
  onOpenChange,
  productId,
  productName,
  onSuccess,
}: ReviewModalProps) {
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const activeRating = hoverRating || rating;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!rating || rating < 1 || rating > 5) {
      toast.error("Please select a star rating from 1 to 5");
      return;
    }

    const payload: ReviewRequest = {
      rating,
      comment: comment.trim() || undefined,
    };

    try {
      setIsSubmitting(true);
      await reviewsApi.addReview(productId, payload);
      toast.success("Thank you! Your review has been posted.");
      setComment("");
      setRating(5);
      onSuccess();
      onOpenChange(false);
    } catch (err: unknown) {
      const status =
        err && typeof err === "object" && "response" in err
          ? (err as { response?: { status?: number } }).response?.status
          : undefined;

      const errorMsg =
        err && typeof err === "object" && "response" in err
          ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
          : undefined;

      if (status === 409) {
        toast.error("You have already reviewed this product.");
      } else {
        toast.error(errorMsg || "Failed to submit review. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-indigo-600" />
            Write a Review
          </DialogTitle>
          <p className="text-xs text-slate-500 font-medium">
            Sharing your experience for <span className="text-slate-800 dark:text-slate-200 font-semibold">{productName}</span>
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 pt-3">
          {/* Star Rating Picker */}
          <div className="space-y-2">
            <Label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Your Rating *
            </Label>
            <div className="flex items-center gap-2">
              <div
                className="flex items-center gap-1.5"
                onMouseLeave={() => setHoverRating(0)}
              >
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    className="p-1 rounded-lg transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-amber-400"
                  >
                    <Star
                      className={`h-7 w-7 transition-colors ${
                        star <= activeRating
                          ? "fill-amber-400 text-amber-400 drop-shadow-xs"
                          : "text-slate-200 dark:text-slate-700"
                      }`}
                    />
                  </button>
                ))}
              </div>
              <span className="text-xs font-bold text-amber-600 dark:text-amber-400 ml-2">
                {RATING_LABELS[activeRating] || ""}
              </span>
            </div>
          </div>

          {/* Comment */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="review-comment" className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Your Review (Optional)
              </Label>
              <span className="text-[11px] text-slate-400">
                {comment.length}/1000
              </span>
            </div>
            <Textarea
              id="review-comment"
              rows={4}
              maxLength={1000}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="How do the frames fit? How is the optical clarity? What did you like most?"
              className="resize-none"
            />
          </div>

          {/* Verified Purchase Hint */}
          <div className="flex items-start gap-2 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 p-3 text-[11px] text-slate-500">
            <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
            <span>
              If you purchased this item with your EyeShop account, your review will automatically feature a <strong>Verified Purchase</strong> badge.
            </span>
          </div>

          {/* Dialog Actions */}
          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              disabled={isSubmitting}
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || rating < 1}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Post Review"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
