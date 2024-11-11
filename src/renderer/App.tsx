import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Pages/Home';
import AddSubscription from './Pages/AddSubscription';
import ViewSubscriptions from './Pages/ViewSubscriptions';
import EditSubscription from './Pages/EditSubscription';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/add-subscription" element={<AddSubscription />} />
        <Route path="/view-subscriptions" element={<ViewSubscriptions />} />
        <Route path="/edit-subscription/:id" element={<EditSubscription />} />
      </Routes>
    </Router>
  );
};

export default App;
