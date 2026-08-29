interface AuthFormProps {
  title: string
  children: React.ReactNode
}

export default function AuthForm({ title, children }: AuthFormProps) {
  return (
    <div
      className="rounded-lg p-8"
      style={{
        backgroundColor: 'var(--bg-card)',
        boxShadow: 'var(--shadow-lg)',
        borderRadius: 'var(--radius-xl)',
        padding: 'var(--space-8)',
      }}
    >
      <h1 className="text-2xl font-bold text-center mb-6" style={{ color: 'var(--text-primary)' }}>
        {title}
      </h1>
      {children}
    </div>
  )
}
