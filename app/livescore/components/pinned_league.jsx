
function LeftSidebar() {
    // Placeholder data from screenshot
    const pinnedLeagues = [
        "Premier League", "Ligue 1", "Serie A", "Eredivisie", "LaLiga",
        "Africa Cup of Nations", "Euro", "Champions League", "Europa League",
        "Conference League", "UEFA Nations League", "Euro U21", "World Cup",
        "FIFA Club World Cup"
    ];

    return (
        <aside className="left-sidebar-glass widget">
            <h3 className="sidebar-title">PINNED LEAGUES</h3>
            <ul className="pinned-leagues-list">
                {pinnedLeagues.map(league => (
                    <li key={league} className='league-name'>
                        {/* Placeholder for flag */}
                        <span className="league-flag">
                        
                        </span> 
                        {league}
                    </li>
                ))}
            </ul>
        </aside>
    );
}
export default LeftSidebar;