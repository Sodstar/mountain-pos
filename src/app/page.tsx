// app/page.tsx
"use client";

import { useState } from "react";
import {
  ShoppingCart,
  Lock,
  Menu,
  Home,
  Coffee,
  Utensils,
  Cookie,
  Search,
  User,
  Settings,
  ChevronRight,
  LogOut,
  UserCircle,
  HelpCircle,
  X,
  Mountain,
  Link,
  Box,
} from "lucide-react";
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
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CartItem, Product, PRODUCTS } from "@/data/data";

// Categories for sidebar navigation
const CATEGORIES = [
  { id: "all", name: "All Items", icon: <Home className="h-5 w-5" /> },
  { id: "drinks", name: "Drinks", icon: <Coffee className="h-5 w-5" /> },
  { id: "food", name: "Food", icon: <Utensils className="h-5 w-5" /> },
  { id: "desserts", name: "Desserts", icon: <Cookie className="h-5 w-5" /> },
  { id: "desserts2", name: "Desserts", icon: <Cookie className="h-5 w-5" /> },
  { id: "desserts3", name: "Desserts", icon: <Cookie className="h-5 w-5" /> },
];
export default function POS() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCartOpen, setIsCartOpen] = useState(false);

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

  const cartTotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const cartItemsCount = cart.reduce((count, item) => count + item.quantity, 0);

  const filteredProducts = PRODUCTS.filter((product) => {
    const matchesCategory =
      activeCategory === "all" || product.category === activeCategory;
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="md:hidden fixed top-4 left-4 z-30">
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full bg-white shadow-md"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0">
            <div className="flex flex-col h-full">
              <div className=" border-b flex items-center justify-between">
                <SheetHeader>
                  <SheetTitle className="font-bold text-xl">Цэс</SheetTitle>
                </SheetHeader>
              </div>
              <Sidebar
                activeCategory={activeCategory}
                setActiveCategory={(category) => {
                  setActiveCategory(category);
                  setSidebarOpen(true);
                }}
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
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
        />
      </div>

      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <header className="bg-white shadow-sm border-b py-4 px-6 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="hidden md:flex rounded-full"
            >
              <Menu className="h-5 w-5" />
            </Button>
            <h1 className="text-[18px] font-bold bg-gradient-to-r from-primary to-green-600 text-transparent bg-clip-text uppercase">
              Борлуулалтын систем
            </h1>
          </div>

          <div className="hidden md:flex items-center gap-3 max-w-md w-full relative">
            <Search className="h-4 w-4 absolute left-3 text-gray-400" />
            <Input
              placeholder="Хайх барааны нэр эсвэл код оруулна уу..."
              className="pl-10 rounded-full bg-gray-50 border-gray-200 focus-visible:ring-primary"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild className="cursor-pointer">
                <Avatar className="h-9 w-9 hidden md:flex ring-2 ring-primary/10 hover:ring-primary/30 transition-all">
                  <AvatarImage src="/api/placeholder/40/40" alt="User" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">John Doe</p>
                    <p className="text-xs text-gray-500">john@example.com</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer">
                  <UserCircle className="mr-2 h-4 w-4" />
                  <span>Хувийн мэдээлэл</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Тохиргоо</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                  <HelpCircle className="mr-2 h-4 w-4" />
                  <span>Тусламж</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer text-red-600 focus:text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Гарах</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              onClick={() => setIsCartOpen(true)}
              variant="outline"
              size="lg"
              className="relative rounded-full bg-white border-gray-200 shadow-sm hover:shadow-md transition-all"
            >
              <ShoppingCart className="h-5 w-5 mr-2 text-primary" />
              <span className="font-medium">
                {cartTotal > 0 ? `${cartTotal.toFixed(2)}` : "Сагс"}
              </span>
              {cartItemsCount > 0 && (
                <Badge className="absolute -top-2 -right-2 bg-primary">
                  {cartItemsCount}
                </Badge>
              )}
            </Button>
          </div>
        </header>

        <div className="md:hidden px-6 py-3 bg-white border-b">
          <div className="relative">
            <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search products..."
              className="pl-10 rounded-full bg-gray-50 border-gray-200"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="md:hidden bg-white px-6 py-3 border-b overflow-x-auto flex gap-2">
          {CATEGORIES.map((category) => (
            <Button
              key={category.id}
              variant={activeCategory === category.id ? "default" : "outline"}
              className={`rounded-full flex-shrink-0 ${
                activeCategory === category.id ? "" : "bg-white border-gray-200"
              }`}
              onClick={() => setActiveCategory(category.id)}
            >
              <span className="flex items-center gap-2">
                {category.icon}
                {category.name}
              </span>
            </Button>
          ))}
        </div>

        <main className="flex-1 p-6 overflow-auto">
          <div className="md:flex items-center justify-between mb-6 hidden">
            <h2 className="text-xl font-bold">
              {CATEGORIES.find((c) => c.id === activeCategory)?.name ||
                "All Items"}
            </h2>
            <div className="flex items-center text-sm text-gray-500">
              <span>Showing {filteredProducts.length} products</span>
            </div>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <div className="mx-auto w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                <Search className="h-12 w-12 text-gray-300" />
              </div>
              <h3 className="text-lg font-medium mb-2">No products found</h3>
              <p>Try adjusting your search or category filter</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  addToCart={addToCart}
                />
              ))}
            </div>
          )}
        </main>

        {cartItemsCount > 0 && (
          <div className="sticky bottom-0 left-0 right-0 bg-white border-t shadow-md p-4">
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
            <div className="px-6 py-4 border-b flex items-center">
              <SheetHeader>
                <SheetTitle className="font-bold text-xl">Таны сагс</SheetTitle>
              </SheetHeader>
              <Badge
                variant="outline"
                className="text-sm px-3 py-1 rounded-full bg-primary/10 text-primary border-primary/20"
              >
                {cart.length} {cart.length === 1 ? "item" : "items"}
              </Badge>
            </div>

            <Cart
              cart={cart}
              removeFromCart={removeFromCart}
              addToCart={addToCart}
              cartTotal={cartTotal}
            />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

function Sidebar({
  activeCategory,
  setActiveCategory,
}: {
  activeCategory: string;
  setActiveCategory: (category: string) => void;
}) {
  return (
    <div className="h-full border-r bg-white flex flex-col items-center">
      <div className="w-full"> 
      <div className="p-4 border-b flex items-center justify-between hover:scale-105 transition-transform duration-200">
        <a href="/">
          <img src="/logo.png" alt="Logo" className="w-42" />
        </a>
      </div>

      <ScrollArea className="flex-1 px-8 py-6">
        <div className="space-y-1">
          <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider px-3 mb-2">
            Барааны ангилал
          </h3>
          {CATEGORIES.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`w-full flex items-center gap-3 rounded-lg text-left px-3 py-2.5 transition-colors ${
                activeCategory === category.id
                  ? "bg-primary/10 text-primary font-medium"
                  : "hover:bg-gray-100 text-gray-700"
              }`}
            >
              <span
                className={`p-1.5 rounded-lg ${
                  activeCategory === category.id
                    ? "bg-primary/20"
                    : "bg-gray-100"
                }`}
              >
                {category.icon}
              </span>
              <span>{category.name}</span>
              {activeCategory === category.id && (
                <ChevronRight className="h-4 w-4 ml-auto text-primary" />
              )}
            </button>
          ))}
        </div>

        <div className="mt-8 space-y-1">
          <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider px-3 mb-2">
            Админ тохиргоо
          </h3>
          <button className="w-full flex items-center gap-3 rounded-lg text-left px-3 py-2.5 text-gray-700 hover:bg-gray-100">
            <span className="p-1.5 rounded-lg bg-gray-100">
              <Box className="h-5 w-5" />
            </span>
            <span>Бараа</span>
          </button>
          <button className="w-full flex items-center gap-3 rounded-lg text-left px-3 py-2.5 text-gray-700 hover:bg-gray-100">
            <span className="p-1.5 rounded-lg bg-gray-100">
              <User className="h-5 w-5" />
            </span>
            <span>Хэрэглэгч</span>
          </button>
          <button className="w-full flex items-center gap-3 rounded-lg text-left px-3 py-2.5 text-gray-700 hover:bg-gray-100">
            <span className="p-1.5 rounded-lg bg-gray-100">
              <Settings className="h-5 w-5" />
            </span>
            <span>Тохиргоо</span>
          </button>
        </div>
      </ScrollArea>

      <div className="p-4 border-t bg-gray-50 mt-auto">
        <div className="flex items-center gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild className="cursor-pointer">
              <Avatar className="ring-2 ring-primary/10 hover:ring-primary/30 transition-all">
                <AvatarImage src="/api/placeholder/40/40" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">Сод-Од</p>
                  <p className="text-xs text-gray-500">john@example.com</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer">
                <UserCircle className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <HelpCircle className="mr-2 h-4 w-4" />
                <span>Help & Support</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer text-red-600 focus:text-red-600">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm">John Doe</p>
            <p className="text-xs text-gray-500 truncate">john@example.com</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full hover:bg-gray-200"
          >
            <Settings className="h-5 w-5 text-gray-500" />
          </Button>
        </div>
      </div>
    </div></div>
  );
}

// Product Card Component
function ProductCard({
  product,
  addToCart,
}: {
  product: Product;
  addToCart: (product: Product) => void;
}) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-200 group border-gray-200">
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
            className="bg-white text-primary hover:bg-white/90 shadow-md"
            onClick={(e) => {
              e.stopPropagation();
              addToCart(product);
            }}
          >
            Add to Cart
          </Button>
        </div>
      </div>
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
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

// Cart Component
function Cart({
  cart,
  removeFromCart,
  addToCart,
  cartTotal,
}: {
  cart: CartItem[];
  removeFromCart: (productId: string) => void;
  addToCart: (product: Product) => void;
  cartTotal: number;
}) {
  return (
    <>
      <ScrollArea
        className="flex-1 px-6 py-4"
        style={{ height: "calc(100vh - 180px)" }}
      >
        {cart.length === 0 ? (
          <div className="text-center py-16 flex flex-col items-center">
            <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <ShoppingCart className="h-12 w-12 text-gray-300" />
            </div>
            <h3 className="text-lg font-medium text-gray-800 mb-1">
              Your cart is empty
            </h3>
            <p className="text-gray-500 max-w-sm">
              Add items from the menu to start your order
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {cart.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-4 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <div className="w-16 h-16 rounded-lg bg-white shadow-sm overflow-hidden flex-shrink-0">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium">{item.name}</h3>
                  <p className="text-sm text-gray-500">
                    ${item.price.toFixed(2)} per item
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 rounded-full bg-white"
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
                    className="h-8 w-8 rounded-full bg-white"
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

      <div className="border-t p-6 bg-gray-50">
        <div className="space-y-3 mb-4">
          <div className="flex justify-between">
            <span className="text-gray-600">Subtotal</span>
            <span>${cartTotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Tax (8%)</span>
            <span>${(cartTotal * 0.08).toFixed(2)}</span>
          </div>
          <Separator className="my-2" />
          <div className="flex justify-between font-bold text-lg">
            <span>Total</span>
            <span>${(cartTotal * 1.08).toFixed(2)}</span>
          </div>
        </div>
        <Button
          className="w-full font-medium text-base h-12"
          size="lg"
          disabled={cart.length === 0}
        >
          <Lock className="mr-2 h-4 w-4" /> Secure Checkout
        </Button>
      </div>
    </>
  );
}

function CartSummary({
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
            {itemCount} {itemCount === 1 ? "item" : "items"}
          </p>
          <p className="font-bold text-xl">${cartTotal.toFixed(2)}</p>
        </div>
        <div className="hidden md:flex items-center border-l border-gray-200 pl-6 gap-2">
          {cart.slice(0, 3).map((item) => (
            <div
              key={item.id}
              className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 ring-2 ring-white"
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
          {cart.length > 3 && (
            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-sm font-medium">
              +{cart.length - 3}
            </div>
          )}
        </div>
      </div>
      <Button
        size="lg"
        className="font-medium text-base rounded-full px-8"
        onClick={openCart}
      >
        <ShoppingCart className="mr-2 h-4 w-4" /> View Order
      </Button>
    </div>
  );
}
