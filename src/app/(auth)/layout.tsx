export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--bg-secondary)' }}>
      <main className="w-full px-4" style={{ maxWidth: '440px' }}>
        {children}
      </main>
    </div>
  )
}
