import './Card.css';

export default function Card({ title, description, imageUrl, extraInfo, actions }) {
  return (
    <div className="card">
      <div className="card-image-container">
        {imageUrl ? (
          <img src={imageUrl} alt={title} className="card-image" />
        ) : (
          <div className="card-image-placeholder">
            <span>ЦЦГ</span>
          </div>
        )}
      </div>
      <div className="card-content">
        <h3 className="card-title">{title}</h3>
        <p className="card-description">{description}</p>
        {extraInfo && <div className="card-extra">{extraInfo}</div>}
        {actions && <div className="card-actions">{actions}</div>}
      </div>
    </div>
  );
}

