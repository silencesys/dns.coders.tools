import React from 'react'

// Store
import { useSelector } from 'react-redux'

// App
import Header from './components/Header'
import Form from './components/Form'
import DomainTab from './components/DomainTab'

function App() {
  const domains = useSelector(state => state.domains.domains)

  const domainList = domains.map(domain => {
    return (
      <DomainTab {...domain} key={`${domain.name}-${domain.type}`} />
    )
  })

  return (
    <div className="dnsc__wrapper">
      <Header />
      <main className="dnsc__main" key={domains.length}>
        <Form />
        <div className="dnsc__domain-grid">
          {domainList}
        </div>
      </main>
    </div>
  )
}

export default App
