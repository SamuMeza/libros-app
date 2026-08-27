interface AuthFormProps {
  title: string
  children: React.ReactNode
}

export default function AuthForm({ title, children }: AuthFormProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-8">
      <h1 className="text-2xl font-bold text-center text-gray-900 mb-6">
        {title}
      </h1>
      {children}
    </div>
  )
}
