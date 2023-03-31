import { createRouter, createWebHistory } from "vue-router";

import DashboardLayout from "@/layout/DashboardLayout";
import AuthLayout from "@/layout/AuthLayout";

import Dashboard from "../views/Dashboard.vue";

import Login from "../views/Login.vue";
import Teachers from "@/views/Teachers/Teachers";
import EditTeacher from "@/views/Teachers/Edit-teacher";
import Courses from "@/views/Courses/Courses";
import EditCourse from "@/views/Courses/Edit-course";
import Tests from "@/views/Tests/Tests";
import EditTest from "@/views/Tests/Edit-test";
import Users from "@/views/Users/Users";
import EditUser from "@/views/Users/Edit-user";
import Settings from "@/views/Settings/Settings";
import Icons from "@/views/Icons";
import Shop from "@/views/Shop/Shop";
import EditProduct from "@/views/Shop/Edit-product";
import EditSettings from "@/views/Settings/Edit-settings";
import Promos from "@/views/Promos/Promos";
import Gifts from "@/views/Gifts/Gifts";
import EditPromos from "@/views/Promos/Edit-Promo";

const routes = [
  {
    path: "/",
    redirect: "/dashboard",
    component: DashboardLayout,
    meta: {
      onlyAdmin: true,
    },
    children: [
      {
        path: "/dashboard",
        name: "dashboard",
        components: { default: Dashboard },
      },
      {
        path: "/teachers",
        name: "teachers",
        components: { default: Teachers },
      },
      {
        path: "/teachers/:id",
        name: "edit-teacher",
        components: { default: EditTeacher },
      },
      {
        path: "/courses",
        name: "courses",
        components: { default: Courses },
      },
      {
        path: "/courses/:id",
        name: "edit-course",
        components: { default: EditCourse },
      },
      {
        path: "/tests",
        name: "tests",
        components: { default: Tests },
      },
      {
        path: "/tests/:id",
        name: "edit-test",
        components: { default: EditTest },
      },
      {
        path: "/users",
        name: "users",
        components: { default: Users },
      },
      {
        path: "/users/:id",
        name: "edit-user",
        components: { default: EditUser },
      },
      {
        path: "/shop",
        name: "shop",
        components: { default: Shop },
      },
      {
        path: "/shop/:id",
        name: "edit-product",
        components: { default: EditProduct },
      },
      {
        path: "/settings",
        name: "settings",
        components: { default: Settings },
      },
      {
        path: "/promos",
        name: "promos",
        components: { default: Promos },
      },
      {
        path: "/promos/:id",
        name: "edit-promos",
        components: { default: EditPromos },
      },
      {
        path: "/orders",
        name: "orders",
        components: { default: Gifts },
      },
      {
        path: "/settings/:id",
        name: "edit-settings",
        components: { default: EditSettings },
      },
      {
        path: "/icons",
        name: "icons",
        components: { default: Icons },
      },
    ],
  },
  {
    path: "/auth",
    redirect: "login",
    component: AuthLayout,
    children: [
      {
        path: "/login",
        name: "login",
        components: { default: Login },
        meta: {
          onlyAuth: true,
        },
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  linkActiveClass: "active",
  routes,
});

export default router;
