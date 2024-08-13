import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Dashbaord from "./screens/dashbaord";
import AddCard from "./screens/addcard";
import CardView from "./screens/card_view";
import EditCard from "./screens/Editcard";
import Profile from "./screens/Profile";
import Search from "./screens/search";
import Verify from "./screens/Verify";
import Login from "./screens/login";
import ErrorPage from "./screens/404";

const Main_Routes = () => {
  return (
    <Router>
      <Routes>
        <Route path='/admin'>
          <Route path='login' element={<Login />} />
          <Route path='dashboard' element={<Dashbaord />} />
          <Route path='view_card/:card_number' element={<CardView />} />
          <Route path='add_card' element={<AddCard />} />
          <Route path='edit_card/:card_number' element={<EditCard />} />
          <Route path='profile' element={<Profile />} />
          <Route path='search' element={<Search />} />
          <Route path='verify' element={<Verify />} />
        </Route>
        <Route path='*' element={<ErrorPage />} />
        <Route path='/' element={<Login />} />
      </Routes>
    </Router>
  );
};
export default Main_Routes;
