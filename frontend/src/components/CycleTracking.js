  <div className="stats-container">
    <div className="stat-card">
      <h3>Last Cycle</h3>
      <p>Start: {new Date(stats.lastCycleStart).toLocaleDateString()}</p>
      <p>End: {new Date(stats.lastCycleEnd).toLocaleDateString()}</p>
      <p>Length: {stats.lastCycleLength} days</p>
    </div>
    <div className="stat-card">
      <h3>Average Cycle Length</h3>
      <p>{stats.averageLength} days</p>
    </div>
    <div className="stat-card">
      <h3>Total Cycles</h3>
      <p>{stats.totalCycles}</p>
    </div>
  </div> 