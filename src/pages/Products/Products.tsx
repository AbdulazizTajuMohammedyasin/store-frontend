import ProductCard from "../../components/ProductCard";
import useProducts from "../../hooks/useProducts";
import RecommendedProducts from "../../components/RecommendedProducts";

export const Products = () => {
  const { data, isLoading, error } = useProducts();

  if (isLoading) return <p>Loading...</p>;

  if (error) {
    console.log(error);
    return <p>Error</p>;
  }

  return (
    <div className="container">
      <RecommendedProducts />
      <h2 className="mb-4">All Products</h2>
      <div className="row">
        {data?.data.map((product) => (
          <div className="col-md-4 mb-4" key={product.id}>
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  );
};
