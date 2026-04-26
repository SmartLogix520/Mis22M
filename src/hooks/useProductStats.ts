import type { Review } from "../features/products/constants/products";

export function useProductStats(reviews: Review[] = []) {
  const safeReviews = Array.isArray(reviews) ? reviews : [];

  const totalReviews = safeReviews.length;

  // ⭐ rating depuis reviews (PAS distribution)
  const rating =
    totalReviews === 0
      ? 0
      : safeReviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews;

  // ⭐ distribution recalculée depuis reviews
  const distribution = [5, 4, 3, 2, 1].map((star) => ({
    stars: star,
    count: safeReviews.filter((r) => r.rating === star).length,
  }));

  // ⭐ % recommandation
  const recommendationPercent =
    totalReviews === 0
      ? 0
      : Math.round(
          (safeReviews.filter((r) => r.rating >= 3).length / totalReviews) *
            100,
        );

  return {
    reviews: safeReviews,
    totalReviews,
    rating,
    distribution,
    recommendationPercent,
  };
}
