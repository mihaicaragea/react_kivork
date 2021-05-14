import React, { useState } from "react";
import { Ticket as TicketType, ApiService } from "../api";
import Ticket from "./Ticket";
import { Link } from "react-router-dom";
import { defer } from "rxjs";
import { Config } from "./Config";
import { Spinner } from "react-bootstrap";
import "./TicketsList.css";

export interface TicketsListProps {
  tickets: TicketType[];
  loading: boolean;
  apiService: ApiService;
  fetch: () => void;
}
function TicketsList({
  fetch,
  apiService,
  tickets,
  loading,
}: TicketsListProps) {
  const [query, setQuery] = useState("");
  const [completing, setCompleting] = useState(false);

  const handleClick = (ticket: TicketType) => {
    setCompleting(true);
    const result = defer(() => apiService.complete(ticket.id)).subscribe(
      (result) => {
        setCompleting(false);
        fetch();
      }
    );
    setTimeout(function () {
      if (!result.closed) {
      }
      result.unsubscribe();
      setCompleting(false);
    }, Config.timeout);
  };

  const handleChange = (e: React.FormEvent<HTMLSelectElement>) => {
    setQuery(e.currentTarget.value);
  };

  return (
    <div className="ticket-container">
      <form>
        <select onChange={handleChange}>
          <option value="all">All</option>
          <option value="completed">Completed</option>
          <option value="uncompleted">Uncompleted</option>
        </select>
      </form>

      {!loading ? (
        <>
          {query === "uncompleted" ? (
            <ul>
              {tickets
                .filter((ticket) => ticket.completed === false)
                .map((t) => (
                  <div className="ticket-card" key={t.id}>
                    <Link to={`/ticket/` + t.id}>
                      <Ticket ticket={t} />
                    </Link>
                    <button key={t.id + 1} onClick={() => handleClick(t)}>
                      Complete
                    </button>
                  </div>
                ))}
            </ul>
          ) : query === "completed" ? (
            <ul>
              {tickets
                .filter((ticket) => ticket.completed === true)
                .map((t) => (
                  <div className="ticket-card" key={t.id}>
                    <Link to={`/ticket/` + t.id}>
                      <Ticket ticket={t} />
                    </Link>
                    {!t.completed ? (
                      <button key={t.id + 1} onClick={() => handleClick(t)}>
                        Complete
                      </button>
                    ) : (
                      ""
                    )}
                  </div>
                ))}
            </ul>
          ) : (
            <ul>
              {tickets.map((t) => (
                <div className="ticket-card" key={t.id}>
                  <Link to={`/ticket/` + t.id}>
                    <Ticket ticket={t} />
                  </Link>
                  {!t.completed ? (
                    <button key={t.id + 1} onClick={() => handleClick(t)}>
                      Complete
                    </button>
                  ) : (
                    ""
                  )}
                </div>
              ))}
            </ul>
          )}
        </>
      ) : (
        <div>
          <Spinner animation="border" variant="info" role="status">
            <span className="sr-only">Loading...</span>
          </Spinner>
          <span>Loading data...</span>
        </div>
      )}
      {completing ? (
        <div>
          <Spinner animation="border" variant="info" role="status">
            <span className="sr-only">Loading...</span>
          </Spinner>
          <span>Loading data...</span>
        </div>
      ) : (
        ""
      )}
    </div>
  );
}

export default TicketsList;
