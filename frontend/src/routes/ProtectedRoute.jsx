import { Navigate, Outlet } from 'react-router-dom';
import { profile } from '../api/auth';
import { useEffect, useState } from 'react';
import { userInfo } from '../stores/user';
import { useAtom } from 'jotai';

const ProtectedRoute = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useAtom(userInfo)

  useEffect(() => {
    const loadData = async () => {
      try {
        const { data } = await profile();
        setIsAuthenticated(true); // Success, user is authenticated
        setUser({
          id: data.id,
          username: data.username,
          first_name: data.first_name,
          last_name: data.last_name,
          image:data.image,
          phone:data.phone,
          address:data.address,
          role: data.role
        });
      } catch (error) {
        console.error('Error during profile fetch:', error);
        setIsAuthenticated(false); // Failed, user not authenticated
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Display loading state
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
