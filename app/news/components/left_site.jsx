import Image from 'next/image';

function LeftSidebar({ selectedCategory, onSelectCategory }) {
  const categories = ['Top News', 'Premier League', 'La Liga', 'Serie A', 'Bundesliga'];
  const socialLinks = [
    { name: 'Telegram', icon: '/icons/telegram.png' },
    { name: 'Facebook', icon: '/icons/facebook.png' },
  ];

  return (
    <aside className="news-sidebar news-sidebar--left">
      <div className="sidebar-widget">
        <h3 className="widget-title">Topic</h3>
        <nav className="category-nav">
          {categories.map((category) => (
            <a
              key={category}
              className={`category-link ${selectedCategory === category ? 'is-active' : ''}`}
              onClick={() => onSelectCategory(category)}
            >
              {category}
            </a>
          ))}
        </nav>
      </div>
      <div className="sidebar-widget">
        <h3 className="widget-title">Follow Us</h3>
        <div className="social-links">
          {socialLinks.map((link) => (
            <a key={link.name} href="#" className="social-link" aria-label={link.name}>
              <Image src={link.icon} alt={link.name} width={35} height={35} />
            </a>
          ))}
        </div>
      </div>
    </aside>
  );
}
export default LeftSidebar;