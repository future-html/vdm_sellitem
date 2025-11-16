import { storage } from "../utils/localStorage"
import { Navigate, Outlet } from "react-router-dom"
export default function PrivateRoutesLoginFallback() {
  const auth = storage.get('user') as { name?: string; email?: string } | null
  
  console.log('PrivateRoutesLoginFallback - auth:', auth)
  
  // Check if user is authenticated
  const isAuthenticated = auth && auth.name && auth.email
  
  // If authenticated, redirect to home page
  // If not authenticated, allow access to login page
  return isAuthenticated ? <Navigate to='/' /> : <Outlet />
}
