"use client";
import React, { useState, useEffect } from 'react';
import './livescore.css';

// --- API Config ---
// IMPORTANT: Move API keys to .env.local for production
const API_KEY = '76b6f9472bmshd6c9ad93820dc21p1afd75jsn16871004544f';
const API_HOST = 'livescore6.p.rapidapi.com';

// --- Helper Functions ---
function getTeamImage(team) {
    if (!team || !team.Img) return 'https://placehold.co/40x40/555/FFF?text=?';
    return `https://lsm-static-prod.livescore.com/medium/${team.Img}`;
}

function getTeamName(team) {
    return team?.Nm || 'TBC';
}

function getMatchScore(event, teamKey) {
    return event[teamKey] || '0';
}

function getMatchTime(event) {
    if (event.Eps === 'NS') {
        // Format YYYYMMDDHHMMSS to HH:MM
        const s = event.Esd.toString();
        const hour = s.substring(8, 10);
        const minute = s.substring(10, 12);
        return `${hour}:${minute}`;
    }
    if (event.Eps === 'FT') return 'FT';
    return event.Eps; // e.g., "42'"
}

function getStatusClass(event) {
    if (event.Eps === 'NS') return 'status-time';
    if (event.Eps === 'FT') return 'status-finished';
    if (event.Eps.includes("'")) return 'status-live'; // e.g., "42'"
    return 'status-time';
}

// NEW: Helper to get today's date in YYYY-MM-DD format for the input
function getTodayInputFormat() {
    const today = new Date();
    const y = today.getFullYear();
    const m = String(today.getMonth() + 1).padStart(2, '0');
    const d = String(today.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
}

// NEW: Helper to convert YYYY-MM-DD to YYYYMMDD for the API
function formatDateForApi(dateString) {
    return dateString.replace(/-/g, '');
}

// --- React Components ---

/**
 * Left Sidebar for Pinned Leagues
 */
const LeftSidebar = () => (
    <aside className="left-sidebar-glass widget">
        <h3 className='table-league-title'>Pinned Leagues</h3>
        <ul className="pinned-leagues-list">
            <li>Premier League</li>
            <li>Ligue 1</li>
            <li>Serie A</li>
            <li>Eredivisie</li>
            <li>LaLiga</li>
            <li>Africa Cup of Nations</li>
            <li>Euro</li>
            <li>Champions League</li>
            <li>Europa League</li>
        </ul>
    </aside>
);

/**
 * NEW: Reusable League Table Component
 */
const LeagueTableWidget = ({ title, Ccd, Scd }) => {
    const [table, setTable] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTable = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch(`https://livescore6.p.rapidapi.com/leagues/v2/get-table?Category=soccer&Ccd=${Ccd}&Scd=${Scd}`, {
                    method: 'GET',
                    headers: {
                        'x-rapidapi-key': API_KEY,
                        'x-rapidapi-host': API_HOST
                    }
                });
                if (!response.ok) throw new Error(`Failed to fetch ${title} table`);
                
                const data = await response.json();
                
                // Find the first available table (e.g., "All")
                if (data.LeagueTable && data.LeagueTable.L && data.LeagueTable.L[0] && data.LeagueTable.L[0].Tables) {
                    setTable(data.LeagueTable.L[0].Tables[0]);
                } else {
                    throw new Error('Table data not found in response');
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchTable();
    }, [title, Ccd, Scd]); // Re-fetch if props change

    return (
        <React.Fragment> 
            <h3 className="table-league-title">{title}</h3>
            {loading && <p>Loading table...</p>}
            {error && <p className="error-text">{error}</p>}
            {table && (
                <table className="league-table-glass">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th className="team-name-header">Team</th>
                            <th>Pl</th>
                            <th>GD</th>
                            <th>Pts</th>
                        </tr>
                    </thead>
                    <tbody>
                        {table.team?.map((team) => (
                            <tr key={team.Tid}>
                                <td>{team.rnk}</td>
                                <td className="team-cell">
                                    {/* <img 
                                        src={`https://lsm-static-prod.livescore.com/medium/${team.Img}`} 
                                        alt={team.Tnm} 
                                        className="table-team-logo"
                                        onError={(e) => e.currentTarget.src = 'https://placehold.co/20x20/555/FFF?text=?'}
                                    /> */}
                                    {team.Tnm}
                                </td>
                                <td>{team.pld}</td>
                                <td>{team.gd}</td>
                                <td>{team.pts}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </React.Fragment>
    );
};


/**
 * Right Sidebar for League Table
 * MODIFIED: Uses the new reusable component
 */
const RightSidebar = () => {
    return (
        <aside className="right-sidebar-glass widget">
            <LeagueTableWidget 
                title="Premier League" 
                Ccd="england" 
                Scd="premier-league" 
            />
            
            {/* Here is the second league table */}
            <div style={{ marginTop: '24px' }}>
                <LeagueTableWidget 
                    title="La Liga" 
                    Ccd="spain" 
                    Scd="laliga" 
                />
            </div>
            <div style={{ marginTop: '24px' }}>
                <LeagueTableWidget 
                    title="League 1" 
                    Ccd="france" 
                    Scd="ligue-1" 
                />
            </div>
            {/* <div style={{ marginTop: '24px' }}>
                <LeagueTableWidget 
                    title="Bundesliga" 
                    Ccd="germany" 
                    Scd="bundesliga" 
                />
            </div> */}
            <div style={{ marginTop: '24px' }}>
                <LeagueTableWidget 
                    title="Serie A" 
                    Ccd="italy" 
                    Scd="serie-a" 
                />
            </div>

        </aside>
    );
};

/**
 * Main Content: Live Match List
 */
const MainContent = () => {
    // MODIFIED: Added state for selectedDate
    const [selectedDate, setSelectedDate] = useState(getTodayInputFormat());
    const [stages, setStages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // MODIFIED: useEffect now fetches by date and depends on selectedDate
    useEffect(() => {
        if (!selectedDate) return; // Don't fetch if date is not set

        const fetchMatches = async () => {
            setLoading(true);
            setError(null);
            const apiDate = formatDateForApi(selectedDate); // Convert date for API
            try {
                // MODIFIED: Updated API endpoint
                const response = await fetch(`https://livescore6.p.rapidapi.com/matches/v2/list-by-date?Category=soccer&Date=${apiDate}&Timezone=-7`, {
                    method: 'GET',
                    headers: {
                        'x-rapidapi-key': API_KEY,
                        'x-rapidapi-host': API_HOST
                    }
                });
                if (!response.ok) throw new Error('Failed to fetch matches for selected date');
                
                const data = await response.json();
                setStages(data.Stages || []);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchMatches();
    }, [selectedDate]); // Re-run when selectedDate changes

    return (
        <main className="main-content-glass">
            {/* MODIFIED: Replaced tabs with date picker */}
            <div className="main-content-header">
                <input 
                    type="date" 
                    className="glass-datepicker"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                />
            </div>
            
            {loading && <div className="loading-container glass">Loading matches...</div>}
            {error && <div className="error-container glass">Error: {error}</div>}
            
            {!loading && stages.length === 0 && (
                <div className="error-container glass">
                    {/* MODIFIED: Updated "no matches" text */}
                    No matches found for {selectedDate}.
                </div>
            )}

            {stages.map(stage => (
                <div key={stage.Sid} className="league-group-glass">
                    <div className="league-header-glass">
                        <span>{stage.Cnm}: {stage.Snm}</span>
                        <a href="#" className="standings-link">Standings {'>'}</a>
                    </div>
                    <div className="match-list">
                        {stage.Events.map(event => (
                            <div key={event.Eid} className="match-row">
                                <div className="match-status">
                                    <span className="star-icon">☆</span>
                                    <span className={getStatusClass(event)}>{getMatchTime(event)}</span>
                                </div>
                                <div className="match-teams">
                                    <div className="team-row">
                                        <img src={getTeamImage(event.T1[0])} alt={getTeamName(event.T1[0])} className="team-logo-small" />
                                        <span>{getTeamName(event.T1[0])}</span>
                                    </div>
                                    <div className="team-row">
                                        <img src={getTeamImage(event.T2[0])} alt={getTeamName(event.T2[0])} className="team-logo-small" />
                                        <span>{getTeamName(event.T2[0])}</span>
                                    </div>
                                </div>
                                <div className="match-score">
                                    <span>{getMatchScore(event, 'Tr1')}</span>
                                    <span>{getMatchScore(event, 'Tr2')}</span>
                                </div>
                                <div className="match-links">
                                    {event.Eps === 'NS' ? (
                                        <span className="preview-tag">PREVIEW</span>
                                    ) : (
                                        <span className="match-icon-live">LIVE</span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </main>
    );
};

/**
 * Main Page Component
 */
export default function LiveMatchesPage() {
    return (
        <div className="livescore-layout-glass">
            <LeftSidebar />
            <MainContent />
            <RightSidebar />
        </div>
    );
}