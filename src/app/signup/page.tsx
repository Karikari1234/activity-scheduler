// src/app/signup/page.tsx
'use client' // This needs to be a client component for form handling

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client' // Use browser client

export default function SignUp() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const router = useRouter()
  const supabase = createClient() // Create client instance

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setMessage('') // Clear previous messages

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        // Optional: email redirect URL for email confirmation
        emailRedirectTo: `${location.origin}/auth/callback`,
      },
    })

    if (error) {
      setMessage(`Signup failed: ${error.message}`)
      console.error('Signup Error:', error)
    } else {
      setMessage('Signup successful! Check your email for confirmation.')
      // Optionally redirect to login or show message
      // For now, just show message. Login is separate.
      // router.push('/login'); // Or redirect if email confirmation is off
    }
  }

  return (
    <div style={styles.container}>
      <h1>Sign Up</h1>
      <form onSubmit={handleSignUp} style={styles.form}>
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
          minLength={6} // Supabase default minimum password length
          style={styles.input}
        />
        <button type="submit" style={styles.button}>Sign Up</button>
      </form>
      {message && <p style={styles.message}>{message}</p>}
      <p>
        Already have an account? <a href="/login" style={styles.link}>Log In</a>
      </p>
    </div>
  )
}

// Basic inline styles for demonstration
const styles = {
  container: {
    maxWidth: '400px',
    margin: '50px auto',
    padding: '20px',
    border: '1px solid #ccc',
    borderRadius: '8px',
    textAlign: 'center' as const, // Added type assertion for textAlign
  },
  form: {
    display: 'flex',
    flexDirection: 'column' as const, // Added type assertion for flexDirection
    gap: '15px',
    marginBottom: '20px',
  },
  label: {
    fontWeight: 'bold',
    textAlign: 'left' as const, // Added type assertion for textAlign
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
    color: 'red', // Default to red for errors, adjust color based on message type if needed
  },
    link: {
        color: '#0070f3',
        textDecoration: 'none',
    }
};