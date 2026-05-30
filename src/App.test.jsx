import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import App from './App'
import { ThemeProvider } from './context/ThemeContext'

vi.mock('./tools/registry', () => ({
  tools: [
    {
      id: 'json-formatter',
      name: 'JSON Formatter',
      description: 'Prettify and validate JSON',
      category: 'JSON',
      icon: ['fas', 'file-code'],
      path: '/tools/json-formatter',
      component: () => Promise.resolve({ default: () => <h1>JSON Formatter</h1> }),
      keywords: ['json', 'format'],
    },
    {
      id: 'json-minifier',
      name: 'JSON Minifier',
      description: 'Remove whitespace from JSON',
      category: 'JSON',
      icon: ['fas', 'compress'],
      path: '/tools/json-minifier',
      component: () => Promise.resolve({ default: () => <h1>JSON Minifier</h1> }),
      keywords: ['json', 'minify'],
    },
  ],
  categories: ['JSON'],
}))

function renderApp(initialRoute = '/') {
  return render(
    <MemoryRouter initialEntries={[initialRoute]}>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </MemoryRouter>
  )
}

describe('App routing', () => {
  beforeEach(() => {
    vi.spyOn(window, 'localStorage', 'get').mockReturnValue({
      getItem: vi.fn(() => null),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn(),
      get length() { return 0 },
      key: vi.fn(() => null),
    })
  })

  it('renders home page at root', () => {
    renderApp('/')
    expect(screen.getByText('Welcome to MyDailyNeed')).toBeInTheDocument()
  })

  it('renders tool page when navigating to a tool route', async () => {
    renderApp('/tools/json-formatter')
    const heading = await screen.findByRole('heading', { name: 'JSON Formatter', level: 1 })
    expect(heading).toBeInTheDocument()
  })

  it('switches content when navigating between tool routes', async () => {
    renderApp('/tools/json-formatter')
    expect(await screen.findByRole('heading', { name: 'JSON Formatter', level: 1 })).toBeInTheDocument()

    const secondLink = screen.getByRole('link', { name: 'JSON Minifier' })
    act(() => secondLink.click())

    expect(await screen.findByRole('heading', { name: 'JSON Minifier', level: 1 })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'JSON Formatter', level: 1 })).not.toBeInTheDocument()
  })

  it('navigates to tools via sidebar links', async () => {
    renderApp('/')
    expect(screen.getByText('Welcome to MyDailyNeed')).toBeInTheDocument()

    const link = screen.getAllByRole('link', { name: 'JSON Formatter' })[0]
    act(() => link.click())

    expect(await screen.findByRole('heading', { name: 'JSON Formatter', level: 1 })).toBeInTheDocument()
  })

  it('redirects unknown routes to home', () => {
    renderApp('/nonexistent')
    expect(screen.getByText('Welcome to MyDailyNeed')).toBeInTheDocument()
  })
})