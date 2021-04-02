import React, { useEffect } from 'react'
import axios from 'axios'

// Store
import { useDispatch } from 'react-redux'
import { update, remove } from '../store/domainSlice'

function DomainTab (props) {
  const dispatch = useDispatch()

  const checkDns = async () => {
    const url = `https://cloudflare-dns.com/dns-query?name=${props.name}&type=${props.type}`
    const response = await axios.get(url, {
      headers: {
        accept: 'application/dns-json'
      }
    })
    return response.data.Answer || response.data.Authority
  }

  const updateStoredDns = async () => {
    console.log('spamming')
    const records = await checkDns()
    const mapedRecords = records.map(answer => answer.data)
    dispatch(update({ ...props, cloudflare: mapedRecords }))
  }

  const removeDomain = (e) => {
    e.preventDefault()
    dispatch(remove(props))
  }

  const renderValues = () => {
    const values = []

    if (props.expectedValue) {
      values.push(<li key="expected">Expected value: {props.expectedValue}</li>)
    }

    if (props.cloudflare) {
      values.push(<li key="current">Current value: {props.cloudflare?.join(', ')}</li>)
    }

    return values
  }

  const valuesAreEqual = () => {
    if (props.cloudflare?.includes(props.expectedValue)) {
      return (
        <span className="dns__badge__updated">
          Updated
        </span>
      )
    }
  }

  useEffect(async () => {
    if (props.expectedValue) {
      let interval = 0
      if (!props.cloudflare?.includes(props.expectedValue)) {
        console.log('start spamming')
        interval = setInterval(async () => {
          updateStoredDns()
        }, 300000) // 5 min
      } else {
        clearInterval(interval)
      }
    }

    if (props.cloudflare === undefined || props.cloudflare.length === 0) {
      updateStoredDns()
    }

    return () => {
      clearInterval(interval)
    }
  }, [])

  return (
    <div className="dnsc__domain-tab">
      <h2 className="dnsc__domain-tab__title">{props.name}</h2>
      <span className="dnsc__domain-tab__record">Record type: {props.type}</span>
      <ul className="dnsc__domain-tab__value-list">
        {renderValues()}
      </ul>
      <button className="dnsc__button__primary" onClick={updateStoredDns}>update</button>
      <button className="dnsc__button__danger" onClick={removeDomain}>remove</button>
      {valuesAreEqual()}
    </div>
  )
}

export default DomainTab
