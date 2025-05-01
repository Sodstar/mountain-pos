import { CartItem, Product } from "@/data/data";
import { Button } from "./ui/button";
import { ShoppingCart } from "lucide-react";

export default function CartSummary({
    cartTotal,
    itemCount,
    cart,
    removeFromCart,
    addToCart,
    openCart,
  }: {
    cartTotal: number;
    itemCount: number;
    cart: CartItem[];
    removeFromCart: (productId: string) => void;
    addToCart: (product: Product) => void;
    openCart: () => void;
  }) {
    return (
      <div className="container mx-auto max-w-6xl flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div>
            <p className="text-sm text-gray-500">
              {itemCount} {itemCount === 1 ? "бүтээгдэхүүн" : "бүтээгдэхүүн"}
            </p>
            <p className="font-bold text-xl">${cartTotal.toFixed(2)}</p>
          </div>
          <div className="hidden md:flex items-center border-l  pl-6 gap-2">
            {cart.slice(0, 3).map((item) => (
              <div
                key={item.id}
                className="w-10 h-10 rounded-full overflow-hidden "
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
            {cart.length > 3 && (
              <div className="w-10 h-10 rounded-full  flex items-center justify-center text-sm font-medium">
                +{cart.length - 3}
              </div>
            )}
          </div>
        </div>
        <Button
          size="lg"
          className="font-medium text-base rounded-full cursor-pointer"
          onClick={openCart}
        >
          <ShoppingCart className=" h-4 w-4" /> <span className="pr-2">Сагс нээх </span>
        </Button>
      </div>
    );
  }
  