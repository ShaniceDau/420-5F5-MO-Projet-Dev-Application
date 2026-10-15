import { createBrowserRouter, RouterProvider } from "react-router-dom";
import RootLayout from "../Containers/Roots";
import ErrorPage from "../Containers/ErrorPage";


const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      
    ],
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
