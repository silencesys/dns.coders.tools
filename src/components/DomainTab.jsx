import React, { useEffect, useState } from 'react'
import axios from 'axios'

// Icons
import { RefreshIcon, BadgeCheckIcon, XCircleIcon, ExternalLinkIcon } from '@heroicons/react/solid'

// Store
import { useDispatch } from 'react-redux'
import { update, remove } from '../store/domainSlice'

// Components
import ErrorBar from './ErrorBar'

function DomainTab (props) {
  const dispatch = useDispatch()
  const [updated, setUpdated] = useState(false)
  const [errorMessage, setErrorMessage] = useState({})
  let updateInterval = 0
  let timeout = 0

  const checkDns = async () => {
    clearTimeout(timeout)
    const url = `https://cloudflare-dns.com/dns-query?name=${props.name}&type=${props.type}`
    try {
      const response = await axios.get(url, {
        headers: {
          accept: 'application/dns-json'
        }
      })
      setUpdated(true)
      timeout = setTimeout(() => {
        setUpdated(false)
      }, 3000)
      setErrorMessage({})
      return response.data.Answer || response.data.Authority
    } catch (error) {
      // @TODO: add proper error handling
      setErrorMessage({
        message: 'Something went wrong'
      })
    }
  }

  const updateStoredDns = async () => {
    try {
      const records = await checkDns()
      const mapedRecords = records.map(answer => answer.data)
      clearInterval(updateInterval)

      if (!mapedRecords.includes(props.expectedValue)) {
        updateInterval = setInterval(async () => {
          console.log(`DEBUG: Checking for ${props.name} s`)
          updateStoredDns()
        }, 300000) // 5 min
      }

      dispatch(update({ ...props, cloudflare: mapedRecords }))
    } catch (error) {
      // @TODO: add proper error handling
      setErrorMessage({
        message: 'Something went wrong'
      })
    }
  }

  const showErrorMessage = () => {
    if (errorMessage.message) {
      return (
        <ErrorBar {...errorMessage} />
      )
    }
  }

  const removeDomain = (e) => {
    e.preventDefault()
    const confirmed = confirm(`Are you sure you want to delete domain ${props.name} from the list? This action can not be undone.`)
    if (confirmed) {
      dispatch(remove(props))
    }
  }

  const renderValues = () => {
    const values = []

    if (props.expectedValue) {
      values.push(<li key="expected">{valuesAreEqual()} {props.expectedValue}</li>)
    }

    if (props.cloudflare && !props.cloudflare?.includes(props.expectedValue)) {
      values.push(<li key="current">{props.cloudflare?.join(', ')}</li>)
    }

    return values
  }

  const valuesAreEqual = () => {
    if (props.cloudflare?.includes(props.expectedValue)) {
      return (<span className="dnsc__updated"><BadgeCheckIcon /></span>)
    } else {
      return (<span className="dnsc__not-updated"><XCircleIcon /></span>)
    }
  }

  const showUpdatedInfo = () => {
    if (updated) {
      return (<span className="dnsc__status-update">Updated!</span>)
    }
  }

  useEffect(async () => {
    if (props.expectedValue) {
      if (!props.cloudflare?.includes(props.expectedValue)) {
        updateInterval = setInterval(async () => {
          console.log(`DEBUG: Checking for ${props.name}`)
          updateStoredDns()
        }, 300000) // 5 min
      }
    } else {
      clearInterval(updateInterval)
    }

    if (props.cloudflare === undefined || props.cloudflare.length === 0) {
      updateStoredDns()
    }

    return function cleanup () {
      clearInterval(updateInterval)
      clearTimeout(timeout)
    }
  }, [])

  return (
    <div className="dnsc__domain-tab">
      <h2 className="dnsc__domain-tab__title">
        {props.name}
        <a className="dnsc__domain-tab__external-link" href={`http://${props.name}`} rel="noopener noreferrer nofollow" target="_blank" aria-label="Open domain in new window">
          <ExternalLinkIcon />
        </a>
      </h2>
      <span className="dnsc__domain-tab__record">
        <strong>Record type: </strong>
        {props.type}
      </span>
      <ul className="dnsc__domain-tab__value-list">
        {renderValues()}
      </ul>
      {showErrorMessage()}
      <button className="dnsc__button dnsc__button__primary" onClick={updateStoredDns}>
        <RefreshIcon />
        update
      </button>
      <button className="dnsc__button__danger" onClick={removeDomain}>remove</button>
      {showUpdatedInfo()}
    </div>
  )
}

export default DomainTab
