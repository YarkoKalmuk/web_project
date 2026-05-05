import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <p>&copy; {new Date().getFullYear()} Центр цифрової гуманітаристики. Всі права захищені.</p>
      </div>
    </footer>
  );
}
