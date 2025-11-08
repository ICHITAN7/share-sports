"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import './news.css';

const formatNewsDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
};
const NEWS_API_KEY = 'pub_58ff41c09c7c4b3ba99b5b6f078e61c1';
const API_URL = `https://newsdata.io/api/1/latest?apikey=${NEWS_API_KEY}&q=Football&language=en`;

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
                // We are fetching from the client, so we need to handle CORS.
                // newsdata.io allows client-side requests.
                const response = await fetch(API_URL);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                
                if (data.status === "success") {
                    // Filter out articles without an image for a cleaner look
                    setArticles(data.results.filter(article => article.image_url));
                } else {
                    throw new Error("Failed to fetch news data.");
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
                        key={article.article_id} 
                        article={article} 
                        onClick={() => setSelectedArticle(article)}
                    />
                ))}
            </div>
        </div>
    );
}


// --- Article Card Component ---
function ArticleCard({ article, onClick }) {
    return (
      // onClick={onClick}
        <div className="article-card widget" > 
            {article.image_url && (
                <div 
                    className="article-card-image" 
                    style={{ backgroundImage: `url(${article.image_url})` }}
                ></div>
            )}
            <div className="article-card-content">
                <span className="article-card-source">{article.source_name || "News"}</span>
                <h3 className="article-card-title">{article.title}</h3>
                <span className="article-card-date">{formatNewsDate(article.pubDate)}</span>
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
            
            <h1 className="article-detail-title">{article.title}</h1>
            
            <div className="article-detail-byline">
                <span>By: **{article.source_name || "Unknown Source"}**</span>
                <span>{formatNewsDate(article.pubDate)}</span>
            </div>
            
            {article.image_url && (
                <Image 
                    src={article.image_url}
                    alt={article.title}
                    width={800}
                    height={450}
                    className="article-detail-image"
                    priority={true} // Load this image first
                />
            )}
            
            <p className="article-detail-description">
                {article.description || "No description available."}
            </p>
            
            {article.content === "ONLY AVAILABLE IN PAID PLANS" && (
                <p className="article-detail-description">
                    Full content is only available on a paid plan.
                </p>
            )}

            <a 
                href={article.link} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="article-detail-link"
            >
                Read Full Story at {article.source_name}
            </a>
        </div>
    );
}