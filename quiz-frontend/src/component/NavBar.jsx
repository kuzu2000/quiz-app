import React, { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';
import { toast } from 'react-toastify';
import {
  useFetchNotiQuery,
  useReadNotiMutation,
} from '../features/noti/notiApiSlice';
import { apiSlice } from '../app/api/apiSlice';
import { Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { useDispatch } from 'react-redux';

const NavBar = () => {
  const { _id, username } = useAuth();
  const dispatch = useDispatch();
  const buttonRef = useRef();

  const {
    data: notifications,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useFetchNotiQuery(_id, {
    skip: !_id,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  const [readNoti] = useReadNotiMutation();
  const [showNotifications, setShowNotifications] = useState(false);
  const [notificationCount, setNotificationCount] = useState(
    notifications?.filter((notif) => !notif.read).length
  );

  const [socket, setSocket] = useState(null);

  const handleRead = async () => {
    if (_id) {
      setShowNotifications((prev) => !prev);
      const unreadNotificationIds = notifications
        ?.filter((notif) => !notif.read)
        .map((notif) => notif._id);
      if (unreadNotificationIds.length > 0) {
        await readNoti({ notificationIds: unreadNotificationIds });
        setNotificationCount(0);
      }
    }
  };

  useEffect(() => {
    setNotificationCount(notifications?.filter((notif) => !notif.read).length);
  }, [notifications]);

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 1024);
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (_id) {
      const newSocket = io('https://quiz-app-ty6t.onrender.com', {
        transports: ["websocket"]
      });
      newSocket.emit('registerUser', _id);

      newSocket.on('levelUp', (data) => {
        toast.success(`You leveled up to Level ${data.newLevel}!`);
        setNotificationCount((prevCount) => prevCount + 1);
        dispatch(apiSlice.util.invalidateTags(['NotificationList']));
      });

      return () => {
        newSocket.disconnect();
      };
    }
  }, [_id, dispatch]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (buttonRef.current && !buttonRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    }

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <nav>
      <div className="nav-bar">
        <h1>
          <Link className="link" to="/">
            <i className="fas fa-question-circle"></i>
          </Link>
        </h1>
        <ul>
          <li>
            <Link className="link" to="/leaderboard">
              Leaderboard
            </Link>
          </li>
          <li
            onClick={handleRead}
            ref={buttonRef}
            className="notification-parent"
          >
            {isMobile ? (
              <Link className="link" to="/notification">
                <i className="fa fa-bell">
                  {notificationCount > 0 && <span>{notificationCount}</span>}
                </i>
              </Link>
            ) : (
              <div className="notification-dropdown">
                <i className="fa fa-bell">
                  {notificationCount > 0 && <span>{notificationCount}</span>}
                </i>
                <div
                  className={`dropdown-content ${
                    showNotifications ? 'show-dropdown-content' : ''
                  }`}
                >
                  {notifications?.length > 0 ? (
                    notifications?.map((notif, index) => (
                      <p key={index}>{notif.message}</p>
                    ))
                  ) : (
                    <p>No notifications</p>
                  )}
                </div>
              </div>
            )}
          </li>
          {username && (
            <li>
              <Link className="link" to="/user">
                <span className="nav-round">
                  {username.charAt(0).toUpperCase()}
                </span>
              </Link>
            </li>
          )}
          {!username && (
            <li>
              <Link className="link" to="/login">
                <i className="fas fa-sign-in-alt"></i>
              </Link>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default NavBar;
