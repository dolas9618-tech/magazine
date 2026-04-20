function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-content">
        <div className="footer-brand">
          <div className="logo">BAHANDI</div>
          <p>©️ 2024 TOO Баханди. Все права защищены</p>
        </div>
        <div className="footer-links">
          <h3>Компания</h3>
          <ul>
            {/* Заменили # на / чтобы деплой не падал */}
            <li><a href="/">Франшиза</a></li>
            <li><a href="/">Вакансии</a></li>
            <li><a href="/">Оферта</a></li>
          </ul>
        </div>
      </div>
    </footer>
  );
}

export default Footer;