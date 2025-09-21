export default function Home() {
  return (
    <div className="container">
      {/* Header */}
      <header className="header">
        <div className="header-section header-left">
          <h1>Lluís Canovas</h1>
          <p>Photography and Graphic Design</p>
        </div>
        
        <div className="header-section header-center">
          <button className="filter-link active">Photography</button>
          <button className="filter-link">Graphic Design</button>
          <button className="filter-link">All</button>
        </div>
        
        <div className="header-section header-right">
          <p>info@lluiscanovas.com</p>
          <p>ES +34 682 665 624</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="main">
        <div>
          <p>Image slider will go here</p>
        </div>
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="slide-counter">01</div>
      </footer>
    </div>
  );
}