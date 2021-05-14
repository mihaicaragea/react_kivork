import { Observable, of, throwError } from "rxjs";
import { delay, tap } from "rxjs/operators";

/**
 * This service acts as a mock back-end.
 * Please don't edit this file and don't use private methods and fields.
 */

export type User = {
  id: number;
  name: string;
};

export type Ticket = {
  id: number;
  description: string;
  assigneeId: null | number;
  completed: boolean;
};

function randomDelay() {
  return Math.random() * 4000;
}

export class ApiService {
  // mock initial tickets
  private storedTickets: Ticket[] = [
    {
      id: 0,
      description: "Install a monitor arm",
      assigneeId: 111,
      completed: true,
    },
    {
      id: 1,
      description: "Move the desk to the new location",
      assigneeId: 111,
      completed: false,
    },
  ];

  // mock initial users
  private storedUsers: User[] = [
    { id: 111, name: "Victor" },
    { id: 222, name: "Ion" },
  ];

  private lastTicketId = 1;

  private findTicketById(id: number) {
    const found = this.storedTickets.find((ticket) => ticket.id === id);
    if (!found) {
      throw new Error(`Ticket (id=${id}) not found`);
    }

    return { ...found };
  }

  private findUserById(id: number) {
    const user = this.storedUsers.find((user) => user.id === id);
    if (!user) {
      throw new Error(`User (id=${id}) not found`);
    }

    return { ...user };
  }

  tickets() {
    return of(this.storedTickets.map((ticket) => ({ ...ticket }))).pipe(
      delay(randomDelay())
    );
  }

  ticket(id: number): Observable<Ticket> {
    return of(this.findTicketById(id)).pipe(delay(randomDelay()));
  }

  users() {
    return of(this.storedUsers.map((user) => ({ ...user }))).pipe(
      delay(randomDelay())
    );
  }

  user(id: number) {
    return of(this.findUserById(id)).pipe(delay(randomDelay()));
  }

  newTicket(payload: { description: string }) {
    const newTicket: Ticket = {
      id: ++this.lastTicketId,
      description: payload.description,
      assigneeId: null,
      completed: false,
    };

    return of(newTicket).pipe(
      delay(randomDelay()),
      tap((ticket: Ticket) => this.storedTickets.push(ticket))
    );
  }

  assign(ticketId: number, userId: number) {
    const foundTicket = this.findTicketById(ticketId);
    const user = this.findUserById(userId);

    if (!foundTicket || !user) {
      return throwError(new Error("ticket or user not found"));
    }

    return of(foundTicket).pipe(
      delay(randomDelay()),
      tap((ticket: Ticket) => {
        this.storedTickets = this.storedTickets.map((storedTicket) => {
          if (storedTicket.id === ticket.id) {
            return {
              ...ticket,
              assigneeId: userId,
            };
          }
          return storedTicket;
        });
      })
    );
  }

  complete(ticketId: number) {
    const foundTicket = this.findTicketById(ticketId);

    if (!foundTicket) {
      return throwError(new Error("ticket not found"));
    }

    return of(foundTicket).pipe(
      delay(randomDelay()),
      tap((ticket: Ticket) => {
        this.storedTickets = this.storedTickets.map((storedTicket) => {
          if (storedTicket.id === ticket.id) {
            return {
              ...ticket,
              completed: true,
            };
          }
          return storedTicket;
        });
      })
    );
  }
}
