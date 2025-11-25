
import { Route, Routes } from 'react-router-dom';
import { HomePage, PrivateRoutes, PrivateRoutesLoginFallback,  Products, Payments, Login} from './pages';


function App() {
  return (
    <Routes>
      {/* Protected Routes - Requires Authentication */}
      <Route element={<PrivateRoutes />}>
        <Route path='/' element={
          <div className='bg-black w-full mx-auto'>
          <HomePage />
          </div>
          } />
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