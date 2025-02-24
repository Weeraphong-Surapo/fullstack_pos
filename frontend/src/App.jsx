import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Product from './pages/Product'
import Size from './pages/Size'
import Topping from './pages/Topping'
import DefaultLayout from './layouts/DefaultLayout'
import Pos from './pages/Pos'
import Type from './pages/Type'
import Order from './pages/Order'
import User from './pages/User'
import ReportProduct from './pages/ReportProduct'
import Login from './pages/Login'
import ProtectedRoute from './routes/ProtectedRoute'
import Profile from './pages/Profile'

const App = () => {
  return (
    <Routes>
      <Route path='/*' element={<ProtectedRoute />}>
        <Route index element={
          <DefaultLayout >
            <Dashboard />
          </DefaultLayout>
        } />
        <Route path='pos' element={
          <DefaultLayout >
            <Pos />
          </DefaultLayout>
        } />
        <Route path='products' element={
          <DefaultLayout >
            <Product />
          </DefaultLayout>
        } />
        <Route path='sizes' element={
          <DefaultLayout >
            <Size />
          </DefaultLayout>
        } />
        <Route path='types' element={
          <DefaultLayout >
            <Type />
          </DefaultLayout>
        } />
        <Route path='toppings' element={
          <DefaultLayout >
            <Topping />
          </DefaultLayout>
        } />
        <Route path='orders' element={
          <DefaultLayout >
            <Order />
          </DefaultLayout>
        } />
        <Route path='users' element={
          <DefaultLayout >
            <User />
          </DefaultLayout>
        } />
        <Route path='report-product' element={
          <DefaultLayout >
            <ReportProduct />
          </DefaultLayout>
        } />
        <Route path='profile' element={
          <DefaultLayout >
            <Profile />
          </DefaultLayout>
        } />
      </Route>
      <Route path='/login' element={
        <Login />
      } />
    </Routes>
  )
}

export default App
