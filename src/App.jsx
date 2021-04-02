import React from 'react'

// Store
import { useSelector } from 'react-redux'

// App
import Header from './components/Header'
import Form from './components/Form'
import DomainTab from './components/DomainTab'
import Footer from './components/Footer'

function App() {
  const domains = useSelector(state => state.domains.domains)

  const domainList = domains.map(domain => {
    return (
      <DomainTab {...domain} key={`${domain.name}-${domain.type}`} />
    )
  })

  return (
    <React.Fragment>
      <Header />
      <main className="dnsc__main" key={domains.length}>
        <Form />
        <div className="dnsc__domain-grid">
          {domainList}
        </div>
        <p className="dnsc__paragraph">
          This websites uses Cloudflare's DNS API to check whether your DNS records were updated. This means that the status displayed here may not represent current state of DNS propagation with your DNS server.
        </p>
      </main>
      <Footer />
    </React.Fragment>
  )
}

export default App
