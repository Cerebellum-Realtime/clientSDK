/* eslint-disable react/prop-types */

const OnlineUserPresence = ({ presenceData }) => {
  return (
    <div className="presence-container">
      <div className="presence-header">
        <p>Online Users</p>
      </div>
      <div className="presence-list">
        {presenceData.map((data) => (
          <div key={data.socketId} className="presence-item">
            {data.user}
          </div>
        ))}
      </div>
    </div>
  );
};

export default OnlineUserPresence;
