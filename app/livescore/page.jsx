"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import './livescore.css';

// --- Helper Functions (Unchanged) ---
const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', hour12: false });
};
const getStatusClass = (shortStatus) => {
    switch (shortStatus) {
        case 'FT': return 'status-ft';
        case 'NS': return 'status-ns';
        case '1H':
        case '2H':
        case 'ET': return 'status-live';
        case 'LIVE': return 'status-live';
        case 'HT': return 'status-ht';
        default: return 'status-ns';
    }
};

// NEW: Helper function to get today's date in YYYY-MM-DD format
const getTodayDate = () => {
    return new Date().toISOString().split('T')[0];
};

// --- Placeholder Components ---

// MODIFIED: MatchOfTheWeek component is REMOVED

const LeagueTable = () => (
    <div className="widget league-table">
        <div className="widget-header">
            <h3>Premier League</h3>
        </div>
        <table>
            <thead>
                <tr>
                    <th>#</th>
                    <th>Team</th>
                    <th>Pts</th>
                </tr>
            </thead>
            <tbody>
                <tr><td>1</td><td>Man City</td><td>73</td></tr>
                <tr><td>2</td><td>Arsenal</td><td>71</td></tr>
                <tr><td>3</td><td>Liverpool</td><td>69</td></tr>
                <tr><td>4</td><td>Aston Villa</td><td>64</td></tr>
                <tr><td>5</td><td>Tottenham</td><td>60</td></tr>
            </tbody>
        </table>
        <a href="#" className="view-full-table">View Full Table</a>
    </div>
);

const Favorites = ({ selectedLeague, onLeagueSelect }) => (
    <div className="widget favorites">
        <h3>Favorites</h3>
        <ul>
            <li
                className={!selectedLeague ? 'active' : ''}
                onClick={() => onLeagueSelect(null)}
            >
                All Leagues
            </li>
            {['England', 'Spain', 'Italy', 'Germany', 'France'].map(league => (
                <li
                    key={league}
                    className={selectedLeague === league ? 'active' : ''}
                    onClick={() => onLeagueSelect(league)}
                >
                    {league}
                </li>
            ))}
        </ul>
    </div>
);

const OurSocial = () => (
    <div className="widget social">
        <h3>🔥 Our Social</h3>
        <ul>
            <li><span>Facebook</span><span>24K followers</span></li>
            <li><span>Instagram</span><span>18K followers</span></li>
            <li><span>Telegram</span><span>12K followers</span></li>
        </ul>
    </div>
);


// --- UPDATED: LiveAndUpcoming Component ---
// MODIFIED: Now receives `selectedDate` as a prop
const LiveAndUpcoming = ({ selectedLeague, selectedDate }) => {
    const [fixtures, setFixtures] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // useEffect (data-fetching) is unchanged...
    useEffect(() => {
        if (!selectedDate) return; 
        const fetchFixtures = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch(`https://v3.football.api-sports.io/fixtures?date=${selectedDate}`, {
                    "method": "GET",
                    "headers": {
                        "x-rapidapi-host": "v3.football.api-sports.io",
                        "x-apisports-key": "a7dbe36a38d9a82ac403f2256c910a2b"
                    }
                });
                if (!response.ok) throw new Error("Failed to fetch data.");
                const data = await response.json();
                if (data.errors && Object.keys(data.errors).length > 0) {
                    throw new Error(`API Error: ${Object.values(data.errors)[0]}`);
                }
                setFixtures(data.response || []);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchFixtures();
    }, [selectedDate]);

    // Filtering logic (unchanged)
    const filteredFixtures = selectedLeague
        ? fixtures.filter(fixture => fixture.league.country === selectedLeague)
        : fixtures; 

    const groupedFixtures = filteredFixtures.reduce((acc, fixture) => {
        const leagueName = fixture.league.name;
        if (!acc[leagueName]) {
            acc[leagueName] = { league: fixture.league, fixtures: [] };
        }
        acc[leagueName].fixtures.push(fixture);
        return acc;
    }, {});

    // Render logic
    if (loading) return <div className="live-upcoming-widget"><div className="loading-container glass">Loading scores...</div></div>;
    if (error) return <div className="live-upcoming-widget"><div className="error-container glass">Error: {error}</div></div>;

    return (
        <div className="live-upcoming-widget"> 
            <div className="widget-header">
                <h3>{selectedLeague ? `🔥 ${selectedLeague}` : '🔥 Live & Upcoming'}</h3>
            </div>

            {filteredFixtures.length === 0 ? (
                <div className="error-container glass">
                    {selectedLeague 
                        ? `No fixtures found for ${selectedLeague} on ${selectedDate}.`
                        : `No fixtures found for ${selectedDate}.`}
                </div>
            ) : (
                Object.values(groupedFixtures).map(({ league, fixtures }) => (
                    // NEW: This league-group gets the yellow background
                    <div key={league.id} className="league-group yellow-bg"> 
                        <div className="league-header-new">
                            <Image
                                src={league.flag || 'https://placehold.co/24x24/eee/ccc?text=?'}
                                alt={`${league.country} flag`}
                                width={22} height={22}
                                onError={(e) => e.currentTarget.src = 'https://placehold.co/22x22/eee/ccc?text=?'}
                            />
                            <span>{league.name}</span>
                        </div>
                        
                        <div className="matches-grid">
                            {fixtures.map((game) => (
                                <div key={game.fixture.id} className="match-card-v3">
                                    <div className="card-body">
                                        <div className="team team-home">
                                            <Image
                                                src={game.teams.home.logo}
                                                alt={`${game.teams.home.name} logo`}
                                                className="team-logo"
                                                width={40} height={40}
                                                onError={(e) => e.currentTarget.src = 'https://placehold.co/40x40/eee/ccc?text=?'}
                                            />
                                            <span className="team-name">{game.teams.home.name}</span>
                                        </div>

                                        <div className="match-score">
                                            {game.fixture.status.short === 'NS' ? (
                                                <div className="match-time">{formatTime(game.fixture.date)}</div>
                                            ) : (
                                                <div className="score-line">
                                                    {game.goals.home ?? 0}
                                                    <span>-</span>
                                                    {game.goals.away ?? 0}
                                                </div>
                                            )}
                                        </div>
                                        
                                        <div className="team team-away">
                                            <Image
                                                src={game.teams.away.logo}
                                                alt={`${game.teams.away.name} logo`}
                                                className="team-logo"
                                                width={40} height={40}
                                                onError={(e) => e.currentTarget.src = 'https://placehold.co/40x40/eee/ccc?text=?'}
                                            />
                                            <span className="team-name">{game.teams.away.name}</span>
                                        </div>
                                    </div>
                                    
                                    <div className="card-footer">
                                        {game.fixture.status.short === '1H' || game.fixture.status.short === '2H' ? 
                                            `${game.fixture.status.elapsed}'` : 
                                            game.fixture.status.long}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};


// --- Main Page Component ---
export default function LivescorePage() {
    const [selectedLeague, setSelectedLeague] = useState(null);
    // NEW: State for the selected date, initialized to today
    const [selectedDate, setSelectedDate] = useState(getTodayDate()); 

    return (
        <div className="dashboard-layout">
            <aside className="sidebar">
                <Favorites 
                    selectedLeague={selectedLeague} 
                    onLeagueSelect={setSelectedLeague} 
                />
                <OurSocial />
            </aside>
            <main className="main-content">
                
                {/* NEW: Date Picker Input */}
                <div className="widget date-selector">
                    <label htmlFor="date-picker">Select Date:</label>
                    <input
                        type="date"
                        id="date-picker"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                    />
                </div>

                {/* MODIFIED: Pass selectedDate prop */}
                <LiveAndUpcoming 
                    selectedLeague={selectedLeague} 
                    selectedDate={selectedDate}
                />

            </main>
            <aside className="right-sidebar">
                <LeagueTable />
            </aside>
        </div>
    );
}