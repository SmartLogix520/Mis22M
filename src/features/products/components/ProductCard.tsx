import { useNavigate } from "react-router-dom";
type ProductCardProps = {
  id: string;
  image: string;
  name: string;
  price?: number;
  description?: string;
};

export default function ProductCard({
  id,
  image,
  name,
  price,
  description,
}: ProductCardProps) {
  const navigate = useNavigate();
  return (
    <div
      onClick={() => navigate(`/product/${id}`)}
      className="bg-white rounded-xl shadow-md p-3"
    >
      <img src={image} className="w-full h-[180px] object-cover rounded-lg" />

      <h3 className="mt-2 font-semibold text-sm">{name}</h3>

      {description && <p className="text-xs text-gray-500">{description}</p>}

      <div className="mt-2 flex justify-between items-center">
        {price && <span className="font-bold">{price} DA</span>}
      </div>
    </div>
  );
}
