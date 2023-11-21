import React, { useState, useEffect } from "react";
import api from "src/utils/api";
import EventCard from "./event-card";

export const EventList = ({ user }) => {
  const [events, setEvents] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const loadEvents = async (receiverId) => {
    setLoading(true);
    let url = `/events/?limit=10&offset=${(page - 1) * 10}`;
    if (receiverId) {
      url += `&receiver=${receiverId}`;
    }
    const response = await api.get(url);
    setEvents([...events, ...response.data.results]);
    setLoading(false);
  };

  useEffect(() => {
    loadEvents(user ? user.id : null);
  }, [page]);

  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop !==
      document.documentElement.offsetHeight
    )
      return;
    setPage((prevPage) => prevPage + 1);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div>
      {events.map((event) => (
        <EventCard event={event} key={event.id} />
      ))}
      {loading && <p>Loading...</p>}
    </div>
  );
};
