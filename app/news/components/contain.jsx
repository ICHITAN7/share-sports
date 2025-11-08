function MainContent({ selectedCategory }) {
  // Mock data that changes based on the selected category
  const articles = {
    'Top News': [
      { id: 1, title: 'Global Sports Highlights', category: 'General', img: 'https://placehold.co/600x400/5566DD/FFF?text=Top+News+1' },
      { id: 2, title: 'The Rise of eSports', category: 'Gaming', img: 'https://placehold.co/600x400/66aabb/FFF?text=eSports' },
    ],
    'Premier League': [
      { id: 3, title: 'Manchester United Wins Derby', category: 'Premier League', img: 'https://placehold.co/600x400/DD5555/FFF?text=Man+Utd' },
      { id: 4, title: 'Liverpool Signs New Striker', category: 'Premier League', img: 'https://placehold.co/600x400/AA3333/FFF?text=Liverpool' },
    ],
  };

  const currentArticles = articles[selectedCategory] || articles['Top News'];
  const featuredArticle = currentArticles[0];
  const otherArticles = currentArticles.slice(1);

  return (
    <main className="news-content">
      <section className="featured-article">
        <div className="featured-image-wrapper">
          <img src={featuredArticle.img} alt={featuredArticle.title} width={600} height={400} className="featured-image" />
          <span className="featured-category-tag">{featuredArticle.category}</span>
        </div>
        <div className="featured-text">
          <h2 className="featured-title">{featuredArticle.title}</h2>
          <p className="featured-description">This is a short description of the featured article, enticing users to click.</p>
        </div>
      </section>

      <section className="more-articles">
        <h3 className="widget-title">More in {selectedCategory}</h3>
        <div className="article-list">
          {otherArticles.map((article) => (
            <div key={article.id} className="article-card-small">
              <img src={article.img} alt={article.title} width={100} height={80} className="article-small-image" />
              <div className="article-small-text">
                <h4 className="article-small-title">{article.title}</h4>
                <span className="article-small-category">{article.category}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
export default MainContent;