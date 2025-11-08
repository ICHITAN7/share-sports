function RightSidebar({ selectedCategory }) {
  // Mock data for league table
  const tables = {
    'Premier League': [
      { pos: 1, name: 'Man Utd', p: 10, gd: 15, pts: 28 },
      { pos: 2, name: 'Liverpool', p: 10, gd: 12, pts: 25 },
      { pos: 3, name: 'Chelsea', p: 10, gd: 10, pts: 22 },
    ],
    'La Liga': [
      { pos: 1, name: 'Real Madrid', p: 10, gd: 20, pts: 30 },
      { pos: 2, name: 'Barcelona', p: 10, gd: 18, pts: 27 },
    ],
  };

  const currentTable = tables[selectedCategory];

  return (
    <aside className="news-sidebar news-sidebar--right">
      <div className="sidebar-widget">
        <h3 className="widget-title">League Table</h3>
        {currentTable ? (
          <table className="league-table">
            <thead>
              <tr>
                <th>Pos</th>
                <th>Team</th>
                <th>P</th>
                <th>GD</th>
                <th>Pts</th>
              </tr>
            </thead>
            <tbody>
              {currentTable.map((team) => (
                <tr key={team.pos}>
                  <td>{team.pos}</td>
                  <td>{team.name}</td>
                  <td>{team.p}</td>
                  <td>{team.gd}</td>
                  <td>{team.pts}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No table available for {selectedCategory}.</p>
        )}
      </div>
    </aside>
  );
}
export default RightSidebar;