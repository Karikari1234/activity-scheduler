// src/app/login/page.tsx
'use client' // This needs to be a client component for form handling

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client' // Use browser client

export default function LogIn() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const router = useRouter()
  const supabase = createClient() // Create client instance

  const handleLogIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setMessage('') // Clear previous messages

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setMessage(`Login failed: ${error.message}`)
      console.error('Login Error:', error)
    } else {
      // Redirect to dashboard on successful login
      // Use router.refresh() to ensure server components reload with new auth state
      router.push('/dashboard')
      router.refresh()
    }
  }

  return (
    <div style={styles.container}>
      <h1>Log In</h1>
      <form onSubmit={handleLogIn} style={styles.form}>
        <label htmlFor="email" style={styles.label}>Email:</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={styles.input}
        />
        <label htmlFor="password" style={styles.label}>Password:</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={styles.input}
        />
        <button type="submit" style={styles.button}>Log In</button>
      </form>
      {message && <p style={styles.message}>{message}</p>}
      <p>
        Need an account? <a href="/signup" style={styles.link}>Sign Up</a>
      </p>
    </div>
  )
}

// Reusing styles from SignUp page for consistency
const styles = {
  container: {
    maxWidth: '400px',
    margin: '50px auto',
    padding: '20px',
    border: '1px solid #ccc',
    borderRadius: '8px',
    textAlign: 'center' as const,
  },
  form: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '15px',
    marginBottom: '20px',
  },
  label: {
    fontWeight: 'bold',
    textAlign: 'left' as const,
  },
  input: {
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '4px',
  },
  button: {
    padding: '10px 15px',
    backgroundColor: '#0070f3',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  message: {
    marginTop: '15px',
    color: 'red',
  },
    link: {
        color: '#0070f3',
        textDecoration: 'none',
    }
};