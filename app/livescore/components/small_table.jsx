import React, { useState, useEffect } from 'react';

const API_KEY = '76b6f9472bmshd6c9ad93820dc21p1afd75jsn16871004544f';
const API_HOST = 'livescore6.p.rapidapi.com';
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
            <h3 className="sidebar-title">{title}</h3>
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

export default LeagueTableWidget;