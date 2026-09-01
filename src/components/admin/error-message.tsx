interface ErrorMessageProps {
  title?: string;
  message: string;
  onRetry?: () => void;
}

export default function ErrorMessage({ title = 'Error', message, onRetry }: ErrorMessageProps) {
  return (
    <div className="admin-card border-l-4 border-[var(--admin-danger)]">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-[var(--admin-danger)]"
          >
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
        </div>
        <div className="flex-1">
          <h3 className="font-medium text-[var(--admin-text)]">{title}</h3>
          <p className="text-sm text-[var(--admin-text-muted)] mt-1">{message}</p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="admin-button admin-button-primary mt-3 text-sm"
            >
              Reintentar
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
