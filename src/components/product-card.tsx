import { Product } from "@/data/data";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { toMongolianCurrency } from "@/utils/formatter";

export default // Product Card Component
function ProductCard({
  product,
  addToCart,
}: {
  product: any;
  addToCart: (product: Product) => void;
}) {
  console.log(product.title, "product");
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-200 group  p-0">
      <div
        className="aspect-square relative  overflow-hidden"
        onClick={() => addToCart(product)}
      >
        <img
          src={product.image}
          alt={product.title}
          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-black/0 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
          <Button
            className="text-primary shadow-md  dark:bg-black dark:hover:bg-black/90"
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
            <h3 className="font-medium text-lg">{product.title}</h3>
            <p className="text-sm text-gray-500 capitalize">
              {product.code} / {product.brand}
            </p>
          
          </div>
          <p className="text-primary font-bold text-lg">
            {toMongolianCurrency(product.price)}₮
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
