"use client";
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

export interface EventData {
  id: number;
  name: string;
  dateTimestamp: number;
  location: string;
  imageCoverUri: string;
  ticketLimit: number;
  ticketsIssued: number;
  ticketPrice: number;
  isClosed: boolean;
}

interface EventsContextType {
  events: EventData[];
  setEvents: React.Dispatch<React.SetStateAction<EventData[]>>;
}

const EventsContext = createContext<EventsContextType | undefined>(undefined);

export function useEvents(): EventsContextType {
  const context = useContext(EventsContext);
  if (context === undefined) {
    throw new Error("useEvents must be used within an EventsProvider");
  }
  return context;
}

interface EventsProviderProps {
  children: ReactNode;
}

export function EventsProvider({ children }: EventsProviderProps) {
  const [isEventFetched, setIsEventFetched] = useState(false);
  const [events, setEvents] = useState<EventData[]>([]);

  useEffect(() => {
    // Update local storage when events change
    if (typeof window !== "undefined" && !isEventFetched) {
      // Access localStorage
      const localData = localStorage.getItem("events");
      const data = localData ? JSON.parse(localData) : [];
      setEvents(data);
      setIsEventFetched(true);
    }
    if (typeof window !== "undefined" && isEventFetched) {
      localStorage.setItem("events", JSON.stringify(events));
    }
  }, [events, isEventFetched]);

  const value = {
    events,
    setEvents,
  };

  return (
    <EventsContext.Provider value={value}>{children}</EventsContext.Provider>
  );
}
