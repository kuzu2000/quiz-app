import React from 'react';
import { useFetchNotiQuery } from '../features/noti/notiApiSlice';
import moment from 'moment';
import useAuth from '../hooks/useAuth';
const Notification = () => {
  const { _id } = useAuth();

  const {
    data: notifications,
    isLoading,
    error,
  } = useFetchNotiQuery(_id, {
    skip: !_id,
  });

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading notifications</p>;

  return (
    <main>
      <div className="noti-container">
        <h1>Notifications</h1>
        <ul className="noti-list">
          {notifications && notifications.length > 0 ? (
            notifications?.map((noti) => (
              <li key={noti._id}>
                <i className="fa fa-arrow-up"></i>
                <p>{noti.message}</p>
                <span>{moment(noti.createdAt).fromNow()}</span>
              </li>
            ))
          ) : (
            <p>No notifications available</p>
          )}
        </ul>
      </div>
    </main>
  );
};

export default Notification;
