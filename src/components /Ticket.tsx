import React from "react";
import { Ticket as TicketType } from "../api";
import "./Ticket.css";

export interface TicketProps {
  ticket: TicketType;
}

function Ticket({ ticket }: TicketProps) {
  return (
    <div >
      <li key={ticket.id}>{ticket.description}</li>
    </div>
  );
}

export default Ticket;
