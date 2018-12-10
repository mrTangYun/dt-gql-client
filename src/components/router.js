import React  from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import HomePage from '../pages/home';

const About = () => <h2>About</h2>;
const Users = () => <h2>Users</h2>;

const AppRouter = () => (
        <div>
            <Route path="/" exact component={HomePage} />
            <Route path="/about/" component={About} />
            <Route path="/users/" component={Users} />
        </div>
);

export default AppRouter;