import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "./app.css";
import { ApiService, Ticket } from "../api";
import TicketsList from "../components /TicketsList";
import TicketDetails from "../components /TicketDetails";
import AddTicket from "../components /AddTicket";

interface AppProps {
  apiService: ApiService;
}

const App = ({ apiService }: AppProps) => {
  const [tickets, setTickets] = useState([] as Ticket[]);
  const [loading, setLoading] = useState<boolean>(false);
  const fetchData = async () => {
    setLoading(true);
    const result = await apiService.tickets().toPromise();
    setTickets(result);
    setLoading(false);
  };
  const handleAddTicket = () => {
    fetchData();
  };

  // The apiService returns observables, but you can convert to promises if
  // that is easier to work with. It's up to you.
  useEffect(() => {
    fetchData();
    // Example of use observables directly
    // const sub = apiService.tickets().subscribe(result => {
    //   setTickets(result);
    // });
    // return () => sub.unsubscribe(); // clean up subscription
  }, []);
  return (
    <Router>
      <div className="app">
        <Switch>
          <Route exact path="/">
            <h2>Tickets</h2>
            <AddTicket
              loading={loading}
              addTicket={handleAddTicket}
              apiService={apiService}
            />
            <TicketsList
              apiService={apiService}
              loading={loading}
              fetch={() => fetchData()}
              tickets={tickets}
            />
          </Route>
          <Route path="/ticket/:id">
            <TicketDetails apiService={apiService} />
          </Route>
        </Switch>
      </div>
    </Router>
  );
};

export default App;
