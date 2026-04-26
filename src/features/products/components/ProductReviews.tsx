import { useProductStats } from "../../../hooks/useProductStats";

type Review = {
  id: number;
  rating: number;
  comment: string;
  author: string;
  date: string;
};

type Props = {
  reviews: Review[];
};

export default function ProductReviews({ reviews }: Props) {
  const { rating, totalReviews, recommendationPercent, distribution } =
    useProductStats(reviews);

  return (
    <div className="mt-10 px-4 md:px-10">
      <h2 className="text-2xl font-bold mb-6 text-center">Reviews</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* SUMMARY */}
        <div className="bg-gray-100 rounded-xl p-6 text-center">
          <div className="text-green-600 text-2xl font-bold">
            {recommendationPercent}%
          </div>

          <p className="text-xs text-gray-500 uppercase tracking-widest">
            recommandent ce produit
          </p>

          <div className="mt-4">
            <p className="text-xl font-semibold">{rating.toFixed(1)} / 5</p>

            <p className="text-xs text-gray-500 mt-1">({totalReviews} avis)</p>
          </div>
        </div>

        {/* DISTRIBUTION */}
        <div className="space-y-2">
          {distribution.map((item) => {
            const percent =
              totalReviews > 0 ? (item.count / totalReviews) * 100 : 0;

            return (
              <div key={item.stars} className="flex items-center gap-3">
                <span className="text-sm w-12">{item.stars}★</span>

                <div className="flex-1 bg-gray-200 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-red-500 h-full"
                    style={{ width: `${percent}%` }}
                  />
                </div>

                <span className="text-sm w-6">{item.count}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* REVIEWS LIST */}
      <div className="flex justify-center">
        <div className="w-full md:w-[80%]">
          {/* scroll container */}
          <div className="max-h-[300px] overflow-y-auto pr-2 space-y-6 ">
            {reviews.map((review) => (
              <div key={review.id} className="border-t pt-4">
                <div className="flex justify-between items-center mb-1">
                  <p className="font-semibold">{review.author}</p>

                  {/* DATE */}
                  <span className="text-xs text-gray-400">{review.date}</span>
                </div>

                <p className="text-sm text-gray-600">{review.comment}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
