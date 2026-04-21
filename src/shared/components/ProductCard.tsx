type Product = {
    image: string;
    name: string;
    price: number | string;
};

export default function ProductCard({ product }: { product: Product }) {
    return (
        <div>
            <img src={product.image} />
            <h3>{product.name}</h3>
            <p>{product.price} DA</p>
        </div>
    );


}