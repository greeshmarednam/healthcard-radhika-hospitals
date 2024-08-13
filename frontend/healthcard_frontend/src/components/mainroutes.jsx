import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Login from "./users/scrrens/Login";
import Dashboard from "./users/scrrens/dashbaord";
import ErrorPage from "./users/scrrens/404";
import CardView from "./users/scrrens/CardView";
import AddCard from "./users/scrrens/AddCard";
import CardListView from "./users/scrrens/CardListView";
import EditCard from "./users/scrrens/EditCard";
import ProfileView from "./users/scrrens/Profile";
import FeatureView from "./users/scrrens/Features";
const MainRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path='/users'>
          <Route path='login' element={<Login />} />
          <Route path='dashboard' element={<Dashboard />} />
          <Route path='view_card/:card_number' element={<CardView />} />
          <Route path='add_card' element={<AddCard />} />
          <Route path='cards_list' element={<CardListView />} />
          <Route path='edit_card/:card_number' element={<EditCard />} />
          <Route path='profile' element={<ProfileView />} />
          <Route path='feature' element={<FeatureView />} />
        </Route>
        <Route path='*' element={<ErrorPage />} />
        <Route path='/' element={<Login />} />
      </Routes>
    </Router>
  );
};

export default MainRoutes;
