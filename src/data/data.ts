// Types
export interface Product {
  id: string;
  title: string;
  price: number;
  image: string;
  category: string;
  brand?: string;
}

export interface CartItem extends Product {
  quantity: number;
}

// // Sample products
// export const PRODUCTS: Product[] = [
//   {
//     id: "1",
//     name: "Cappuccino",
//     price: 4.50,
//     image: "https://www.seriouseats.com/thmb/nXNRk-XzGCfGrffLICBjT9i-6_0=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/__opt__aboutcom__coeus__resources__content_migration__serious_eats__seriouseats.com__images__2017__02__20170210-barbajada-milanese-coffee-cocoa-vicky-wasik-6-cddd037c955c4b0bb2f72bad5bca0c50.jpg",
//     category: "drinks",
//     brand: "nobana"
//   },
//   {
//     id: "2",
//     name: "Avocado Toast",
//     price: 8.99,
//     image: "https://www.seriouseats.com/thmb/nXNRk-XzGCfGrffLICBjT9i-6_0=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/__opt__aboutcom__coeus__resources__content_migration__serious_eats__seriouseats.com__images__2017__02__20170210-barbajada-milanese-coffee-cocoa-vicky-wasik-6-cddd037c955c4b0bb2f72bad5bca0c50.jpg",
//     category: "food",
//     brand: "Coffee"
//   },
//   {
//     id: "3",
//     name: "Caesar Salad",
//     price: 7.50,
//     image: "https://www.seriouseats.com/thmb/nXNRk-XzGCfGrffLICBjT9i-6_0=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/__opt__aboutcom__coeus__resources__content_migration__serious_eats__seriouseats.com__images__2017__02__20170210-barbajada-milanese-coffee-cocoa-vicky-wasik-6-cddd037c955c4b0bb2f72bad5bca0c50.jpg",
//     category: "food",
//     brand: "Coffee"
//   },
//   {
//     id: "4",
//     name: "Berry Smoothie",
//     price: 5.99,
//     image: "https://www.seriouseats.com/thmb/nXNRk-XzGCfGrffLICBjT9i-6_0=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/__opt__aboutcom__coeus__resources__content_migration__serious_eats__seriouseats.com__images__2017__02__20170210-barbajada-milanese-coffee-cocoa-vicky-wasik-6-cddd037c955c4b0bb2f72bad5bca0c50.jpg",
//     category: "drinks",
//     brand: "Coffee"
//   },
//   {
//     id: "5",
//     name: "Margherita Pizza",
//     price: 11.99,
//     image: "https://www.seriouseats.com/thmb/nXNRk-XzGCfGrffLICBjT9i-6_0=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/__opt__aboutcom__coeus__resources__content_migration__serious_eats__seriouseats.com__images__2017__02__20170210-barbajada-milanese-coffee-cocoa-vicky-wasik-6-cddd037c955c4b0bb2f72bad5bca0c50.jpg",
//     category: "food",
//     brand: "Coffee"
//   },
//   {
//     id: "6",
//     name: "Fettuccine Alfredo",
//     price: 12.99,
//     image: "https://www.seriouseats.com/thmb/nXNRk-XzGCfGrffLICBjT9i-6_0=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/__opt__aboutcom__coeus__resources__content_migration__serious_eats__seriouseats.com__images__2017__02__20170210-barbajada-milanese-coffee-cocoa-vicky-wasik-6-cddd037c955c4b0bb2f72bad5bca0c50.jpg",
//     category: "food",
//     brand: "Coffee"
//   },
//   {
//     id: "7",
//     name: "Tiramisu",
//     price: 6.50,
//     image: "https://www.seriouseats.com/thmb/nXNRk-XzGCfGrffLICBjT9i-6_0=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/__opt__aboutcom__coeus__resources__content_migration__serious_eats__seriouseats.com__images__2017__02__20170210-barbajada-milanese-coffee-cocoa-vicky-wasik-6-cddd037c955c4b0bb2f72bad5bca0c50.jpg",
//     category: "desserts",
//     brand: "Coffee"
//   },
//   {
//     id: "8",
//     name: "Iced Latte",
//     price: 3.99,
//     image: "https://www.seriouseats.com/thmb/nXNRk-XzGCfGrffLICBjT9i-6_0=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/__opt__aboutcom__coeus__resources__content_migration__serious_eats__seriouseats.com__images__2017__02__20170210-barbajada-milanese-coffee-cocoa-vicky-wasik-6-cddd037c955c4b0bb2f72bad5bca0c50.jpg",
//     category: "drinks",
//     brand: "Coffee"
//   },
//   {
//     id: "9",
//     name: "Iced Latte",
//     price: 3.99,
//     image: "https://www.seriouseats.com/thmb/nXNRk-XzGCfGrffLICBjT9i-6_0=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/__opt__aboutcom__coeus__resources__content_migration__serious_eats__seriouseats.com__images__2017__02__20170210-barbajada-milanese-coffee-cocoa-vicky-wasik-6-cddd037c955c4b0bb2f72bad5bca0c50.jpg",
//     category: "drinks",
//     brand: "Coffee"
//   },
//   {
//     id: "10",
//     name: "Iced Latte",
//     price: 3.99,
//     image: "https://www.seriouseats.com/thmb/nXNRk-XzGCfGrffLICBjT9i-6_0=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/__opt__aboutcom__coeus__resources__content_migration__serious_eats__seriouseats.com__images__2017__02__20170210-barbajada-milanese-coffee-cocoa-vicky-wasik-6-cddd037c955c4b0bb2f72bad5bca0c50.jpg",
//     category: "drinks",
//     brand: "Coffee"
//   },
// ];
