export default function ProductCard({ product }) {
  return (
    <div>
      <img src={product.image} />
      <h3>{product.name}</h3>
      <p>{product.price} DA</p>
    </div>
  );
}
