"use client";
import { CartItem, Product } from "@/data/data";
import { ScrollArea } from "./ui/scroll-area";
import { Box, Gift, Plane, ShoppingCart } from "lucide-react";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog"; // Import DialogClose

import { toMongolianCurrency } from "@/utils/formatter";

const deliveryPrice = 6000;
const deliveryOptions = [
  { id: "option0", label: "0₮", value: 0 },
  { id: "option1", label: "4,000₮", value: 4000 },
  { id: "option2", label: "6,000₮", value: 6000 },
  { id: "option3", label: "8,000₮", value: 8000 },
  { id: "option4", label: "10,000₮", value: 10000 },
  { id: "option5", label: "12,000₮", value: 12000 },
  { id: "option6", label: "15,000₮", value: 15000 },
];

export default function Cart({
  cart,
  removeFromCart,
  addToCart,
  cartTotal,
  setPriceToZero = (productId: string) => {}, // Add default implementation
}: {
  cart: CartItem[];
  removeFromCart: (productId: string) => void;
  addToCart: (product: Product) => void;
  cartTotal: number;
  setPriceToZero?: (productId: string) => void; // Make this optional for backward compatibility
}) {

  return (
    <>
      <ScrollArea
        className="flex-1 px-6 py-4"
        style={{ height: "calc(100vh - 460px)" }}
      >
        {cart.length === 0 ? (
          <div className="text-center py-16 flex flex-col items-center">
            <div className="w-24 h-24 rounded-full flex items-center justify-center mb-4">
              <ShoppingCart className="h-12 w-12 text-gray-300" />
            </div>
            <h3 className="text-lg font-medium mb-1">Таны сагс хоосон байна</h3>
            <p className="max-w-sm">
              Та борлуулалт бүртгэхээс өмнө бараа сонгоно уу
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {cart.map((item: any) => (
              <div
                key={item.id}
                className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors"
              >
                  <Button
                    variant="destructive"
                    size="icon"
                    className="h-8 w-8 rounded-full cursor-pointer"
                    onClick={() => setPriceToZero(item.id)}
                    title="Үнийг 0 болгох"
                    disabled={item.price === 0}
                    aria-label="Set price to zero"
                  >
                    <Gift />
                  </Button>
                <div className="w-16 h-16 rounded-lg  shadow-sm overflow-hidden flex-shrink-0">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium">{item.name}</h3>
                  <p className="text-sm text-gray-500">
                    {toMongolianCurrency(item.price)}₮ / нэгж үнэ
                  </p>
                </div>
                <div className="flex items-center gap-2">
                
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 rounded-full "
                    onClick={() => removeFromCart(item.id)}
                  >
                    -
                  </Button>
                  <span className="w-6 text-center font-medium">
                    {item.quantity}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 rounded-full "
                    onClick={() => addToCart(item)}
                  >
                    +
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
      <div className="border-t p-6 ">
        <div className="space-y-3 mb-4">
          <div className="flex justify-between font-bold text-lg">
            <span>Нийт дүн</span>
            <span>{toMongolianCurrency(cartTotal)}₮</span>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <Button
            className="w-full font-medium text-base h-12 cursor-pointer"
            size="lg"
            disabled={cart.length === 0}
            onClick={() => {
              console.log(cart);
            }}
          >
            <Box className="mr-2 h-4 w-4" /> Борлуулалт бүртгэх
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button
                className="w-full font-medium text-base h-12 cursor-pointer"
                variant={"outline"}
                size="lg"
                disabled={cart.length === 0}
              >
                <Plane className="mr-2 h-4 w-4" /> Захиалга бүртгэх
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Захиалга баталгаажуулах</DialogTitle>
                <DialogDescription>
                  Та энэ захиалгыг бүртгэхдээ итгэлтэй байна уу?
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline" size="lg">
                    Болих
                  </Button>
                </DialogClose>
                <Button type="submit" size="lg">
                  Тийм
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </>
  );
}
