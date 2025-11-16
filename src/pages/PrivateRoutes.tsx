import { Navigate, Outlet } from 'react-router-dom'
import { storage } from '../utils/localStorage';
export default function PrivateRoutes() {
  let auth = storage.get('user') as { name: string; email: string } | null; 
    console.log(auth, 'auth')
return (
    auth && auth.name && auth.email ? <Outlet/> : <Navigate to='/login'/>
  )
}