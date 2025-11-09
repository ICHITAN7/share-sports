"use client";
import React, { useState, useEffect } from 'react';
import './news.css';

// --- Helper: Format Date ---
// (Converts timestamp like 1762661407444 to a readable format)
const formatNewsDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
};

// --- API Config ---
// IMPORTANT: Move API keys to .env.local files for production
const API_URL = 'https://livescore6.p.rapidapi.com/news/v3/list?countryCode=US&locale=en&bet=true&competitionIds=65%2C77%2C60&participantIds=2810%2C3340%2C2773';
const API_KEY = '76b6f9472bmshd6c9ad93820dc21p1afd75jsn16871004544f';
const API_HOST = 'livescore6.p.rapidapi.com';


// --- Main Page Component ---
export default function NewsPage() {
    const [articles, setArticles] = useState([]);
    const [selectedArticle, setSelectedArticle] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchNews = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch(API_URL, {
                    method: 'GET',
                    headers: {
                        'x-rapidapi-key': API_KEY,
                        'x-rapidapi-host': API_HOST
                    }
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                const data = await response.json();
                
                // Access data from the new structure: cmb.art.itms
                if (data && data.cmb && data.cmb.art && data.cmb.art.itms) {
                    // Filter out articles without a thumbnail for a cleaner look
                    setArticles(data.cmb.art.itms.filter(article => article.tnUrl));
                } else {
                    throw new Error("Failed to fetch news: Invalid data structure.");
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchNews();
    }, []); // Runs once on component mount

    if (loading) {
        return <div className="loading-container glass">Loading news...</div>;
    }

    if (error) {
        return <div className="error-container glass">Error: {error}</div>;
    }

    // --- Detail View ---
    if (selectedArticle) {
        return (
            <ArticleDetail 
                article={selectedArticle} 
                onBack={() => setSelectedArticle(null)} // Pass back function
            />
        );
    }

    // --- List View ---
    return (
        <div className="news-page">
            <h1 className="news-page-title">Football News</h1>
            <div className="article-list">
                {articles.map((article) => (
                    <ArticleCard 
                        key={article.id} 
                        article={article} 
                        onClick={() => setSelectedArticle(article)} // Set selected article
                    />
                ))}
            </div>
        </div>
    );
}


// --- Article Card Component ---
function ArticleCard({ article, onClick }) {
    // This is a CSS style object
    const cardImageStyle = {
        backgroundImage: `url(${article.tnUrl})`,
    };

    return (
        <div className="article-card widget" onClick={onClick}>
            {article.tnUrl && (
                <div 
                    className="article-card-image" 
                    style={cardImageStyle} // Set the CSS style
                    referrerPolicy="no-referrer" // Set the HTML attribute directly
                ></div>
            )}
            <div className="article-card-content">
                <span className="article-card-source">{article.oTtl || "News"}</span>
                <h3 className="article-card-title">{article.ttl}</h3>
                <span className="article-card-date">{formatNewsDate(article.pbAt)}</span>
            </div>
        </div>
    );
}

// --- Article Detail Component ---
function ArticleDetail({ article, onBack }) {
    return (
        <div className="article-detail widget">
            <button onClick={onBack} className="article-back-button">
                &larr; Back to News
            </button>
            
            <h1 className="article-detail-title">{article.ttl}</h1>
            
            <div className="article-detail-byline">
                <span>By: **{article.oTTtl || "Unknown Source"}**</span>
                <span>{formatNewsDate(article.pbAt)}</span>
            </div>
            
            {article.tnUrl && (
                <img 
                    src={article.tnUrl}
                    alt={article.ttl}
                    className="article-detail-image"
                    referrerPolicy="no-referrer" // This might help load images
                    onError={(e) => e.currentTarget.src = 'https://placehold.co/800x450/eee/ccc?text=Image+Not+Available'}
                />
            )}
            
            <p className="article-detail-description">
                {article.sum || "No description available."}
            </p>

            <a 
                href={article.cnUrl} // Use cnUrl (Content URL) for the link
                target="_blank" 
                rel="noopener noreferrer" 
                className="article-detail-link"
            >
                Read Full Story at {article.oTtl}
            </a>
        </div>
    );
}