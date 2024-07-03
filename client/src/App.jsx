import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from './components/Login.jsx';
import Register from './components/Register.jsx';
import CompleteDetails from './components/CompleteDetails.jsx'; 
import Home from './components/Home.jsx';
import Info from "./components/Info";
import Todos from "./components/Todos";
import PostList from "./components/PostList";
import Albums from "./components/Albums";
import NoPage from "./components/NoPage";
import Redirect from "./components/Redirect";

function App() {
  return (
    <BrowserRouter>
      <Routes>
          <Route index element={<Redirect />} />
          <Route path="Login" element={<Login />} />
          <Route path="Register" element={<Register />} />
          <Route path="CompleteDetails" element={<CompleteDetails />} />
          <Route path="Home" element={<Home />} />

          <Route path="Info" element={<Info />} />
          <Route path="Todos" element={<Todos />} />
          <Route path="PostList" element={<PostList />} />
          <Route path="Albums" element={<Albums />} />

          <Route path="*" element={<NoPage />} /> 
      </Routes>
    </BrowserRouter>
  );
}

export default App;