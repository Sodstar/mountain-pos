import { Product } from "@/data/data";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";

export default // Product Card Component
function ProductCard({
  product,
  addToCart,
}: {
  product: Product;
  addToCart: (product: Product) => void;
}) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-200 group border-gray-200 dark:border-gray-900 p-0 dark:bg-gray-900">
      <div
        className="aspect-square relative bg-gray-100 overflow-hidden"
        onClick={() => addToCart(product)}
      >
        <img
          src={product.image}
          alt={product.name}
          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
          <Button
            className="text-primary shadow-md bg-gray-200 dark:bg-gray-900 dark:hover:bg-gray-800"
            variant={"outline"}
            onClick={(e) => {
              e.stopPropagation();
              addToCart(product);
            }}
          >
            Сагсанд нэмэх
          </Button>
        </div>
      </div>
      <CardContent className="p-4 pt-0 ">
        <div className="flex justify-between items-start ">
          <div>
            <h3 className="font-medium text-lg">{product.name}</h3>
            <p className="text-sm text-gray-500 capitalize">
              {product.category}
            </p>
          </div>
          <p className="text-primary font-bold text-lg">
            ${product.price.toFixed(2)}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
