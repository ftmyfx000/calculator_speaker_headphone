import { describe, it, expect } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from './App'

describe('App', () => {
  it('renders the application title', () => {
    render(<App />)
    expect(screen.getByText('スピーカー計算WEBアプリケーション')).toBeInTheDocument()
  })

  it('renders navigation menu with all calculators', () => {
    render(<App />)
    expect(screen.getByText('TSパラメータ計算')).toBeInTheDocument()
    expect(screen.getByText('音圧レベル計算')).toBeInTheDocument()
    expect(screen.getByText('クロスオーバーネットワーク計算')).toBeInTheDocument()
  })

  it('redirects to TS Parameters calculator by default', async () => {
    render(<App />)
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'TSパラメータ計算' })).toBeInTheDocument()
    })
  })

  it('navigates to SPL calculator when clicked', async () => {
    const user = userEvent.setup()
    render(<App />)
    
    const splLink = screen.getByText('音圧レベル計算')
    await user.click(splLink)
    
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: '音圧レベル計算' })).toBeInTheDocument()
    })
  })

  it('navigates to Crossover calculator when clicked', async () => {
    const user = userEvent.setup()
    render(<App />)
    
    const crossoverLink = screen.getByText('クロスオーバーネットワーク計算')
    await user.click(crossoverLink)
    
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'クロスオーバーネットワーク計算' })).toBeInTheDocument()
    })
  })

  it('navigates back to TS Parameters calculator', async () => {
    const user = userEvent.setup()
    render(<App />)
    
    // Navigate to SPL
    const splLink = screen.getByText('音圧レベル計算')
    await user.click(splLink)
    
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: '音圧レベル計算' })).toBeInTheDocument()
    })
    
    // Navigate back to TS Parameters
    const tsLink = screen.getByText('TSパラメータ計算')
    await user.click(tsLink)
    
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'TSパラメータ計算' })).toBeInTheDocument()
    })
  })
})
