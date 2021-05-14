import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { ApiService, Ticket, User } from "../api";
import { defer } from "rxjs";
import { Config } from "./Config";
import { Link } from "react-router-dom";
import { Spinner } from "react-bootstrap";
import RetryComponent from "./RetryComponent";

interface AppProps {
  apiService: ApiService;
}
export interface ParamsProps {
  id: string;
}

function TicketDetails({ apiService }: AppProps) {
  const { id } = useParams<ParamsProps>();
  const [ticket, setTicket] = useState<Ticket>();
  const [users, setUsers] = useState([] as User[]);
  const [user, setUser] = useState<User>();
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    setLoading(true);
    const ticket_data = defer(() => apiService.ticket(Number(id))).subscribe(
      (result) => {
        setTicket(result);
      }
    );
    const users_data = defer(() => apiService.users()).subscribe((result) => {
      setUsers(result);
      let db_user = users.filter((user) => user.id === ticket?.assigneeId)[0];
      setUser(db_user);
      setLoading(false);
    });
    setTimeout(function () {
      if (!ticket_data.closed || !users_data.closed) {
        setAlert(true);
      }
      ticket_data.unsubscribe();
      users_data.unsubscribe();
      setLoading(false);
    }, Config.timeout);
  };
  const handleRetryClick = () => {
    setAlert(false);
    fetchData();
  };

  const handleChange = async (e: React.FormEvent<HTMLSelectElement>) => {
    if (!isNaN(Number(e.currentTarget.value))) {
      setLoading(true);
      const user_option = await apiService
        .user(Number(e.currentTarget.value))
        .toPromise();
      setUser(user_option);
      const assign = await apiService
        .assign(Number(id), user_option.id)
        .toPromise();
      setLoading(false);
    }
  };

  return (
    <div>
      {ticket ? (
        <div >
          <Link to="/">Ticket list </Link>
          <h1>{ticket.description}</h1>
          <h3>Assigned to:{user?.name}</h3>
          <select defaultValue={user?.name} onChange={handleChange}>
            <option>-</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </select>
        </div>
      ) : (
        ""
      )}
      {loading ? (
        <div>
          <Spinner animation="border" variant="info" role="status">
            <span className="sr-only">Loading...</span>
          </Spinner>
          <span>Loading data...</span>
        </div>
      ) : (
        ""
      )}
      {alert ? (
        <RetryComponent loading={loading} handleRetryClick={handleRetryClick} />
      ) : (
        ""
      )}
    </div>
  );
}

export default TicketDetails;
