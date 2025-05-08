// app/page.tsx
"use client";

import { use, useEffect, useState } from "react";
import { Menu, Search, X, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { CartItem, Product } from "@/data/data";
import { Skeleton } from "@/components/ui/skeleton";
import Header from "@/components/header";
import Cart from "@/components/cart";
import Sidebar from "@/components/sidebar";
import ProductCard from "@/components/product-card";
import CartSummary from "@/components/cart-summary";
import { TBrand } from "@/models/Brand";
import { getAllBrands } from "@/actions/brand-action";
import { fetchFilteredProducts } from "@/actions/product-action";
import { toast } from "sonner";

export default function POS() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [activeBrand, setActiveBrand] = useState("all");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [brands, setBrands] = useState<TBrand[] | null>([]);
  const [products, setProducts] = useState<any | null>([]);
  const ProductListing = 20;
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        // Create filters object
        const filters: any = {};

        filters.orderBy = "views_desc";
        const result = await fetchFilteredProducts(filters);
        if (result && Array.isArray(result)) {
          setProducts(result);
        } else {
          setProducts([]);
        }
      } catch (error) {
        toast.error("Failed to load products");
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);
  useEffect(() => {
    const fetchBrands = async () => {
      const result = await getAllBrands();
      if (Array.isArray(result)) {
        setBrands(result as TBrand[]);
      } else {
        console.error("Invalid data format for brands:", result);
        setBrands(null);
      }
    };
    fetchBrands();
  }, []);

  const addToCart = (product: Product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);

      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === productId);

      if (existingItem && existingItem.quantity > 1) {
        return prevCart.map((item) =>
          item.id === productId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        );
      }

      return prevCart.filter((item) => item.id !== productId);
    });
  };

  // Add a new function to set a product's price to zero
  const setPriceToZero = (productId: string) => {
    setCart((prevCart) => {
      return prevCart.map((item) =>
        item.id === productId ? { ...item, price: 0 } : item
      );
    });
  };

  const cartTotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const cartItemsCount = cart.reduce((count, item) => count + item.quantity, 0);

  const filteredProducts = products.filter((product: any) => {
    // Make sure product and its properties exist before filtering
    if (!product) return false;
    const matchesCategory =
      activeBrand === "all" ||
      (product.brand && product.brand._id === activeBrand);

    const matchesSearch =
      (product.title &&
        product.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (product.code &&
        product.code.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (product.barcode &&
        product.barcode.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="flex h-screen">
      <div className="md:hidden fixed top-4 left-4 z-30">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full ">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0">
            <div className="flex flex-col h-full">
              <div className="hidden">
                <SheetHeader>
                  <SheetTitle className="font-bold text-xl">Цэс</SheetTitle>
                  <SheetClose asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-full"
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  </SheetClose>
                </SheetHeader>
              </div>
              <Sidebar
                activeBrand={activeBrand}
                setActiveBrand={(brand) => {
                  setActiveBrand(brand);
                  setSidebarOpen(true);
                }}
                BRANDS={brands || []}
              />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <div
        className={`hidden md:block ${
          sidebarOpen ? "w-72" : "w-0"
        } transition-all duration-300 ease-in-out overflow-hidden`}
      >
        <Sidebar
          activeBrand={activeBrand}
          setActiveBrand={setActiveBrand}
          BRANDS={brands || []}
        />
      </div>

      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <Header
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          cartTotal={cartTotal}
          cartItemsCount={cartItemsCount}
          setSidebarOpen={setSidebarOpen}
          sidebarOpen={sidebarOpen}
          setIsCartOpen={setIsCartOpen}
        />

        <div className="md:hidden px-6 py-3  border-b">
          <div className="relative">
            <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Хайх барааны нэр эсвэл код оруулна уу..."
              className="pl-10 rounded-full "
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="md:hidden px-6 py-3 border-b overflow-x-auto flex gap-2">
          {brands?.map((brand) => (
            <Button
              key={brand._id}
              variant={activeBrand === brand._id ? "default" : "outline"}
              className={`rounded-full flex-shrink-0 ${
                activeBrand === brand._id ? "" : "bg-white border-gray-200"
              }`}
              onClick={() => setActiveBrand(brand._id)}
            >
              <span className="flex items-center gap-2">
                {brand.name}
                <Tag className="h-5 w-5" />
              </span>
            </Button>
          ))}
        </div>

        <main className="flex-1 p-6 overflow-auto">
          <div className="md:flex items-center justify-between mb-6 hidden">
            <h2 className="text-xl font-bold">
              {brands?.find((c) => c._id === activeBrand)?.name || "Бүх бараа"}
            </h2>
            <div className="flex items-center text-sm ">
              <span>Илэрц: {filteredProducts.length} бүтээгдэхүүн</span>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-2  xs:grid-cols-1  md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4  2xl:grid-cols-5 gap-6">
              {Array.from({ length: 8 }).map((_, index) => (
                <Skeleton
                  key={index}
                  className="h-82 w-full rounded-lg bg-gray-200 dark:bg-primary/10"
                />
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <div className="mx-auto w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                <Search className="h-12 w-12 text-gray-300" />
              </div>
              <h3 className="text-lg font-medium mb-2">
                Бүтээгдэхүүн олдсонгүй
              </h3>
              <p>Та хайлтын шүүлтүүрээ өөрчлөөд үзнэ үү</p>
            </div>
          ) : (
            <div className="grid grid-cols-2  xs:grid-cols-1  md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4  2xl:grid-cols-5 gap-6">
              {filteredProducts.slice(0, ProductListing).map((product: any) => {
                // Make sure we extract only the needed values for the ProductCard component
                const adaptedProduct = {
                  id: product._id || "",
                  code: product.code || "", // Map title correctly
                  title: product.title || "", // Map title correctly
                  price: product.price || 0,
                  image: product.image || "/product.png",
                  // Extract string values from potential objects
                  category:
                    typeof product.category === "object"
                      ? product.category?.name || ""
                      : product.category || "",
                  brand:
                    typeof product.brand === "object"
                      ? product.brand?.name || ""
                      : product.brand || "",
                };

                return (
                  <ProductCard
                    key={product._id}
                    product={adaptedProduct}
                    addToCart={() => addToCart(adaptedProduct)}
                  />
                );
              })}
            </div>
          )}
        </main>

        {cartItemsCount > 0 && (
          <div className="sticky bottom-0 left-0 right-0  border-t shadow-md p-4">
            <CartSummary
              cartTotal={cartTotal}
              itemCount={cartItemsCount}
              cart={cart}
              removeFromCart={removeFromCart}
              addToCart={addToCart}
              openCart={() => setIsCartOpen(true)}
            />
          </div>
        )}
      </div>

      <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
        <SheetContent className="w-full sm:max-w-md p-0">
          <div className="flex-1 flex flex-col h-full">
            <div className="px-6 py-2 border-b flex items-center">
              <SheetHeader>
                <SheetTitle className="font-bold text-xl">Таны сагс</SheetTitle>
              </SheetHeader>
              <Badge
                variant="outline"
                className="text-sm px-3 py-1 rounded-full bg-primary/10 text-primary border-primary/20"
              >
                {cart.length}{" "}
                {cart.length === 1 ? "бүтээгдэхүүн" : "бүтээгдэхүүн"}
              </Badge>
            </div>

            <Cart
              cart={cart}
              removeFromCart={removeFromCart}
              addToCart={addToCart}
              cartTotal={cartTotal}
              setPriceToZero={setPriceToZero}
            />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
