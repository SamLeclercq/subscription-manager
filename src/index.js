import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home/Home';
import AddSubscription from './pages/AddSubscription/AddSubscription';
import ViewSubscriptions from './pages/ViewSubscription/ViewSubscriptions';
import EditSubscription from './pages/EditSubscription/EditSubscription';

const App = () => (
  <Router>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/add-subscription" element={<AddSubscription />} />
      <Route path="/view-subscriptions" element={<ViewSubscriptions />} />
      <Route path="/edit-subscription/:id" element={<EditSubscription />} /> {/* Ajout de la route d'édition */}
    </Routes>
  </Router>
);

ReactDOM.render(<App />, document.getElementById('root'));
