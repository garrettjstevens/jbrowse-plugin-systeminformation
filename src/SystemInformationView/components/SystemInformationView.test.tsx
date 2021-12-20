import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import SystemInformationView from './SystemInformationView'

describe('<SystemInformationView />', () => {
  it('renders basic info', async () => {
    render(<SystemInformationView />)

    expect(screen.getByText('Basic information')).toBeTruthy()
    expect(screen.getByText('browser')).toBeTruthy()
  })
})
