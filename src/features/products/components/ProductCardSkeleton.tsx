import { motion } from "framer-motion";

export default function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-md p-3">
      {/* image skeleton */}
      <motion.div
        className="w-full h-[180px] rounded-lg bg-gray-200"
        animate={{ opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 1.2, repeat: Infinity }}
      />

      {/* title */}
      <motion.div
        className="h-4 bg-gray-200 rounded mt-3 w-3/4"
        animate={{ opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 1.2, repeat: Infinity }}
      />

      {/* description */}
      <motion.div
        className="h-3 bg-gray-200 rounded mt-2 w-full"
        animate={{ opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 1.2, repeat: Infinity }}
      />

      {/* price */}
      <motion.div
        className="h-4 bg-gray-200 rounded mt-3 w-1/3"
        animate={{ opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 1.2, repeat: Infinity }}
      />
    </div>
  );
}
