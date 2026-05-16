import './Card.css';

export default function Card({ title, description, imageUrl, extraInfo, actions }) {
  return (
    <div className="card">
      {imageUrl && (
        <div className="card-image-container">
          <img src={imageUrl} alt={title} className="card-image" />
        </div>
      )}
      <div className="card-content">
        <h3 className="card-title">{title}</h3>
        <p className="card-description">{description}</p>
        {extraInfo && <div className="card-extra">{extraInfo}</div>}
        {actions && <div className="card-actions">{actions}</div>}
      </div>
    </div>
  );
}

