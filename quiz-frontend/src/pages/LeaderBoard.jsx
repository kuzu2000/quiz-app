import React from 'react';
import { useGetLeaderboardQuery } from '../features/user/userApiSlice';

const LeaderBoard = () => {
  const { data, isLoading, isError } = useGetLeaderboardQuery();

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading leaderboard</div>;


  return (
    <main>
      <div className="leaderboard">
        <h1>Leaderboard</h1>
        <div className="leaderboard-list">
          <table>
            <thead>
              <tr>
                <th>No</th>
                <th>Name</th>
                <th>Country</th>
                <th>Points</th>
              </tr>
            </thead>
            <tbody>
              {data && data.length > 0 ? (
                data.map((user, index) => (
                  <tr key={user._id}>
                    <td>{index + 1}</td>
                    <td>{user.username}</td>
                    <td>{user.country}</td> 
                    <td>{user.experience}</td> 
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4">No data available</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
};

export default LeaderBoard;
