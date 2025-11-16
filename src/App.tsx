import React, { createContext, useContext, useState, useEffect } from 'react';
import { ShoppingCart, LogOut, Lock, CreditCard, Package, Home, Minus, Plus } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './components/ui/card';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import { Label } from './components/ui/label';
import { Alert, AlertDescription } from './components/ui/alert';
import { Badge } from './components/ui/badge';
import { Route, Routes } from 'react-router-dom';
import { HomePage, PrivateRoutes, PrivateRoutesLoginFallback,  Products, Payments, Login} from './pages';

// Auth Context
// const AuthContext = createContext(null);

// const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [cart, setCart] = useState([]);

//   const login = (username, password) => {
//     if (username && password) {
//       setUser({ username, id: Date.now() });
//       return true;
//     }
//     return false;
//   };

//   const logout = () => {
//     setUser(null);
//     setCart([]);
//   };

//   const addToCart = (item) => {
//     setCart(prev => [...prev, item]);
//   };

//   return (
//     <AuthContext.Provider value={{ user, login, logout, cart, addToCart }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// const useAuth = () => useContext(AuthContext);

// // Router Context
// const RouterContext = createContext(null);

// const Router = ({ children }) => {
//   const [route, setRoute] = useState({ path: '/login', params: {} });

//   const navigate = (path, params = {}) => {
//     setRoute({ path, params });
//   };

//   return (
//     <RouterContext.Provider value={{ route, navigate }}>
//       {children}
//     </RouterContext.Provider>
//   );
// };

// const useRouter = () => useContext(RouterContext);

// // Login Page
// const LoginPage = () => {
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');
//   const { login, user } = useAuth();
//   const { navigate } = useRouter();

//   useEffect(() => {
//     if (user) {
//       navigate('/');
//     }
//   }, [user, navigate]);

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (login(username, password)) {
//       navigate('/');
//     } else {
//       setError('Please enter valid credentials');
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4">
//       <Card className="w-full max-w-md">
//         <CardHeader className="space-y-1">
//           <div className="flex justify-center mb-2">
//             <div className="bg-blue-100 p-4 rounded-full">
//               <Lock className="w-8 h-8 text-blue-600" />
//             </div>
//           </div>
//           <CardTitle className="text-3xl font-bold text-center">Welcome Back</CardTitle>
//           <CardDescription className="text-center">
//             Sign in to your account to continue
//           </CardDescription>
//         </CardHeader>
//         <CardContent className="space-y-4">
//           {error && (
//             <Alert variant="destructive">
//               <AlertDescription>{error}</AlertDescription>
//             </Alert>
//           )}
          
//           <div className="space-y-2">
//             <Label htmlFor="username">Username</Label>
//             <Input
//               id="username"
//               type="text"
//               placeholder="Enter your username"
//               value={username}
//               onChange={(e) => setUsername(e.target.value)}
//             />
//           </div>
          
//           <div className="space-y-2">
//             <Label htmlFor="password">Password</Label>
//             <Input
//               id="password"
//               type="password"
//               placeholder="Enter your password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//             />
//           </div>
//         </CardContent>
//         <CardFooter className="flex flex-col space-y-4">
//           <Button className="w-full" size="lg" onClick={handleSubmit}>
//             Sign In
//           </Button>
//           <p className="text-center text-sm text-muted-foreground">
//             Demo: Use any username and password to login
//           </p>
//         </CardFooter>
//       </Card>
//     </div>
//   );
// };

// // Home Page
// const HomePage = () => {
//   const { user, logout } = useAuth();
//   const { navigate } = useRouter();

//   const products = [
//     { id: 1, name: 'Wireless Headphones', price: 99.99, image: '🎧', description: 'Premium sound quality' },
//     { id: 2, name: 'Smart Watch', price: 249.99, image: '⌚', description: 'Track your fitness' },
//     { id: 3, name: 'Laptop Stand', price: 49.99, image: '💻', description: 'Ergonomic design' },
//     { id: 4, name: 'Mechanical Keyboard', price: 129.99, image: '⌨️', description: 'RGB backlight' },
//     { id: 5, name: 'Webcam HD', price: 79.99, image: '📷', description: '1080p streaming' },
//     { id: 6, name: 'USB-C Hub', price: 39.99, image: '🔌', description: '7-in-1 adapter' },
//   ];

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <nav className="bg-white shadow-md border-b">
//         <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
//           <div className="flex items-center space-x-2">
//             <ShoppingCart className="w-6 h-6 text-blue-600" />
//             <h1 className="text-2xl font-bold text-gray-800">TechStore</h1>
//           </div>
//           <div className="flex items-center space-x-4">
//             <span className="text-sm text-muted-foreground">Welcome, <span className="font-semibold text-foreground">{user?.username}</span>!</span>
//             <Button variant="destructive" size="sm" onClick={logout}>
//               <LogOut className="w-4 h-4 mr-2" />
//               Logout
//             </Button>
//           </div>
//         </div>
//       </nav>

//       <div className="max-w-7xl mx-auto px-4 py-8">
//         <h2 className="text-3xl font-bold text-gray-800 mb-8">Featured Products</h2>
        
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {products.map(product => (
//             <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
//               <div className="bg-gradient-to-br from-blue-100 to-purple-100 p-12 flex items-center justify-center">
//                 <span className="text-6xl">{product.image}</span>
//               </div>
//               <CardHeader>
//                 <CardTitle>{product.name}</CardTitle>
//                 <CardDescription>{product.description}</CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <div className="text-3xl font-bold text-blue-600">${product.price}</div>
//               </CardContent>
//               <CardFooter>
//                 <Button 
//                   className="w-full" 
//                   onClick={() => navigate('/user', { item: product.id })}
//                 >
//                   Buy Now
//                 </Button>
//               </CardFooter>
//             </Card>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// // Buy Item Page
// const BuyItemPage = () => {
//   const { route, navigate } = useRouter();
//   const { user, addToCart } = useAuth();
//   const itemId = route.params.item;

//   const products = [
//     { id: 1, name: 'Wireless Headphones', price: 99.99, image: '🎧', description: 'Premium sound quality with noise cancellation' },
//     { id: 2, name: 'Smart Watch', price: 249.99, image: '⌚', description: 'Track your fitness and health metrics' },
//     { id: 3, name: 'Laptop Stand', price: 49.99, image: '💻', description: 'Ergonomic aluminum design' },
//     { id: 4, name: 'Mechanical Keyboard', price: 129.99, image: '⌨️', description: 'RGB backlight with tactile switches' },
//     { id: 5, name: 'Webcam HD', price: 79.99, image: '📷', description: '1080p streaming quality' },
//     { id: 6, name: 'USB-C Hub', price: 39.99, image: '🔌', description: '7-in-1 multiport adapter' },
//   ];

//   const product = products.find(p => p.id === itemId);

//   if (!product) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <Card className="max-w-md">
//           <CardHeader>
//             <CardTitle>Product Not Found</CardTitle>
//             <CardDescription>The product you're looking for doesn't exist.</CardDescription>
//           </CardHeader>
//           <CardFooter>
//             <Button onClick={() => navigate('/')} className="w-full">
//               <Home className="w-4 h-4 mr-2" />
//               Return to Home
//             </Button>
//           </CardFooter>
//         </Card>
//       </div>
//     );
//   }

//   const [quantity, setQuantity] = useState(1);

//   const handleProceedToPayment = () => {
//     addToCart({ ...product, quantity });
//     navigate('/user', { item: itemId, payment: true });
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <nav className="bg-white shadow-md border-b">
//         <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
//           <button 
//             onClick={() => navigate('/')}
//             className="flex items-center space-x-2 hover:opacity-80"
//           >
//             <ShoppingCart className="w-6 h-6 text-blue-600" />
//             <h1 className="text-2xl font-bold text-gray-800">TechStore</h1>
//           </button>
//           <span className="text-sm text-muted-foreground">Welcome, <span className="font-semibold text-foreground">{user?.username}</span>!</span>
//         </div>
//       </nav>

//       <div className="max-w-5xl mx-auto px-4 py-12">
//         <Card className="overflow-hidden">
//           <div className="grid md:grid-cols-2 gap-8 p-8">
//             <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg p-16 flex items-center justify-center">
//               <span className="text-9xl">{product.image}</span>
//             </div>

//             <div className="flex flex-col justify-between space-y-6">
//               <div className="space-y-4">
//                 <div className="flex items-center space-x-2">
//                   <Badge variant="success" className="bg-green-500">
//                     <Package className="w-3 h-3 mr-1" />
//                     In Stock
//                   </Badge>
//                 </div>
//                 <div>
//                   <h1 className="text-4xl font-bold mb-2">{product.name}</h1>
//                   <p className="text-muted-foreground text-lg">{product.description}</p>
//                 </div>
                
//                 <Card className="bg-blue-50 border-blue-200">
//                   <CardContent className="pt-6">
//                     <div className="text-4xl font-bold text-blue-600 mb-2">${product.price}</div>
//                     <p className="text-sm text-muted-foreground">Free shipping on orders over $50</p>
//                   </CardContent>
//                 </Card>

//                 <div className="space-y-2">
//                   <Label>Quantity</Label>
//                   <div className="flex items-center space-x-4">
//                     <Button
//                       variant="outline"
//                       size="icon"
//                       onClick={() => setQuantity(Math.max(1, quantity - 1))}
//                     >
//                       <Minus className="w-4 h-4" />
//                     </Button>
//                     <span className="text-2xl font-bold w-12 text-center">{quantity}</span>
//                     <Button
//                       variant="outline"
//                       size="icon"
//                       onClick={() => setQuantity(quantity + 1)}
//                     >
//                       <Plus className="w-4 h-4" />
//                     </Button>
//                   </div>
//                 </div>
//               </div>

//               <div className="space-y-4">
//                 <div className="flex justify-between text-lg border-t pt-4">
//                   <span className="text-muted-foreground">Subtotal:</span>
//                   <span className="font-bold text-xl">${(product.price * quantity).toFixed(2)}</span>
//                 </div>
//                 <Button
//                   className="w-full"
//                   size="lg"
//                   onClick={handleProceedToPayment}
//                 >
//                   <CreditCard className="w-5 h-5 mr-2" />
//                   Proceed to Payment
//                 </Button>
//                 <Button
//                   variant="outline"
//                   className="w-full"
//                   size="lg"
//                   onClick={() => navigate('/')}
//                 >
//                   Continue Shopping
//                 </Button>
//               </div>
//             </div>
//           </div>
//         </Card>
//       </div>
//     </div>
//   );
// };

// // Payment Gateway Page
// const PaymentPage = () => {
//   const { route, navigate } = useRouter();
//   const { user, cart } = useAuth();
//   const itemId = route.params.item;

//   const [cardNumber, setCardNumber] = useState('');
//   const [expiry, setExpiry] = useState('');
//   const [cvv, setCvv] = useState('');
//   const [name, setName] = useState('');
//   const [processing, setProcessing] = useState(false);
//   const [success, setSuccess] = useState(false);

//   const products = [
//     { id: 1, name: 'Wireless Headphones', price: 99.99 },
//     { id: 2, name: 'Smart Watch', price: 249.99 },
//     { id: 3, name: 'Laptop Stand', price: 49.99 },
//     { id: 4, name: 'Mechanical Keyboard', price: 129.99 },
//     { id: 5, name: 'Webcam HD', price: 79.99 },
//     { id: 6, name: 'USB-C Hub', price: 39.99 },
//   ];

//   const product = products.find(p => p.id === itemId);
//   const cartItem = cart.find(item => item.id === itemId);

//   useEffect(() => {
//     if (!product || !cartItem) {
//       navigate('/');
//     }
//   }, [product, cartItem, navigate]);

//   if (!product || !cartItem) {
//     return null;
//   }

//   const total = (product.price * cartItem.quantity).toFixed(2);

//   const handleSubmit = () => {
//     if (!cardNumber || !expiry || !cvv || !name) {
//       return;
//     }
    
//     setProcessing(true);
    
//     setTimeout(() => {
//       setProcessing(false);
//       setSuccess(true);
//       setTimeout(() => {
//         navigate('/');
//       }, 3000);
//     }, 2000);
//   };

//   if (success) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
//         <Card className="max-w-md text-center">
//           <CardHeader>
//             <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
//               <span className="text-5xl">✓</span>
//             </div>
//             <CardTitle className="text-3xl">Payment Successful!</CardTitle>
//             <CardDescription>Your order has been confirmed.</CardDescription>
//           </CardHeader>
//           <CardContent>
//             <p className="text-muted-foreground">Redirecting to home...</p>
//           </CardContent>
//         </Card>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <nav className="bg-white shadow-md border-b">
//         <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
//           <button 
//             onClick={() => navigate('/')}
//             className="flex items-center space-x-2 hover:opacity-80"
//           >
//             <ShoppingCart className="w-6 h-6 text-blue-600" />
//             <h1 className="text-2xl font-bold text-gray-800">TechStore</h1>
//           </button>
//           <span className="text-sm text-muted-foreground">Welcome, <span className="font-semibold text-foreground">{user?.username}</span>!</span>
//         </div>
//       </nav>

//       <div className="max-w-5xl mx-auto px-4 py-12">
//         <h1 className="text-3xl font-bold mb-8">Payment Gateway</h1>

//         <div className="grid md:grid-cols-3 gap-8">
//           <div className="md:col-span-2">
//             <Card>
//               <CardHeader>
//                 <CardTitle>Card Details</CardTitle>
//                 <CardDescription>Enter your payment information</CardDescription>
//               </CardHeader>
//               <CardContent className="space-y-4">
//                 <div className="space-y-2">
//                   <Label htmlFor="cardNumber">Card Number</Label>
//                   <Input
//                     id="cardNumber"
//                     type="text"
//                     placeholder="1234 5678 9012 3456"
//                     value={cardNumber}
//                     onChange={(e) => setCardNumber(e.target.value)}
//                     maxLength={19}
//                   />
//                 </div>

//                 <div className="grid grid-cols-2 gap-4">
//                   <div className="space-y-2">
//                     <Label htmlFor="expiry">Expiry Date</Label>
//                     <Input
//                       id="expiry"
//                       type="text"
//                       placeholder="MM/YY"
//                       value={expiry}
//                       onChange={(e) => setExpiry(e.target.value)}
//                       maxLength={5}
//                     />
//                   </div>
//                   <div className="space-y-2">
//                     <Label htmlFor="cvv">CVV</Label>
//                     <Input
//                       id="cvv"
//                       type="text"
//                       placeholder="123"
//                       value={cvv}
//                       onChange={(e) => setCvv(e.target.value)}
//                       maxLength={3}
//                     />
//                   </div>
//                 </div>

//                 <div className="space-y-2">
//                   <Label htmlFor="name">Cardholder Name</Label>
//                   <Input
//                     id="name"
//                     type="text"
//                     placeholder="John Doe"
//                     value={name}
//                     onChange={(e) => setName(e.target.value)}
//                   />
//                 </div>
//               </CardContent>
//               <CardFooter>
//                 <Button
//                   className="w-full"
//                   size="lg"
//                   onClick={handleSubmit}
//                   disabled={processing}
//                 >
//                   {processing ? 'Processing...' : `Pay $${total}`}
//                 </Button>
//               </CardFooter>
//             </Card>
//           </div>

//           <div>
//             <Card>
//               <CardHeader>
//                 <CardTitle>Order Summary</CardTitle>
//               </CardHeader>
//               <CardContent className="space-y-4">
//                 <div className="space-y-2 pb-4 border-b">
//                   <div className="flex justify-between text-sm">
//                     <span className="text-muted-foreground">{product.name}</span>
//                     <span className="font-semibold">${product.price}</span>
//                   </div>
//                   <div className="flex justify-between text-sm">
//                     <span className="text-muted-foreground">Quantity</span>
//                     <span className="font-semibold">{cartItem.quantity}</span>
//                   </div>
//                   <div className="flex justify-between text-sm">
//                     <span className="text-muted-foreground">Shipping</span>
//                     <span className="font-semibold text-green-600">FREE</span>
//                   </div>
//                 </div>
//                 <div className="flex justify-between text-lg font-bold">
//                   <span>Total</span>
//                   <span className="text-blue-600">${total}</span>
//                 </div>
//               </CardContent>
//             </Card>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// // Main App with Custom Router
// function App() {
//   const { route, navigate } = useRouter();
//   const { user } = useAuth();

//   // Protected route logic
//   useEffect(() => {
//     if (!user && route.path !== '/login') {
//       navigate('/login');
//     }
//   }, [user, route.path, navigate]);

//   let component;
  
//   if (route.path === '/login') {
//     component = <LoginPage />;
//   } else if (route.path === '/' && user) {
//     component = <HomePage />;
//   } else if (route.path === '/user' && user) {
//     if (route.params.payment) {
//       component = <PaymentPage />;
//     } else {
//       component = <BuyItemPage />;
//     }
//   } else {
//     component = <LoginPage />;
//   }

//   return component;
// }

// // Root wrapper
// export default function Root() {
//   return (
//     <AuthProvider>
//       <Router>
//         <App />
//       </Router>
//     </AuthProvider>
//   );
// }

function App() {
  return (
    <Routes>
      {/* Protected Routes - Requires Authentication */}
      <Route element={<PrivateRoutes />}>
        <Route path='/' element={<HomePage />} />
        <Route path='/products' element={<Products />} />
        <Route path='/payments' element={<Payments />} />
      </Route>

      {/* Login Route - Redirects if Already Authenticated */}
      <Route element={<PrivateRoutesLoginFallback />}>
        <Route path='/login' element={<Login />} />
      </Route>
    </Routes>
 )
}


export default App; 