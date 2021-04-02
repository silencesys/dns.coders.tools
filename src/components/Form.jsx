import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { add } from '../store/domainSlice'
import ErrorBar from './ErrorBar'

function Form () {
  const [name, setName] = useState('')
  const [type, setType] = useState('A')
  const [expectedValue, setExpectedValue] = useState('')
  const [nameError, setNameError] = useState('')

  const onNameChange = e => setName(e.target.value)
  const onTypeChange = e => setType(e.target.value)
  const onExpectedValueChange = e => setExpectedValue(e.target.value)

  const dispatch = useDispatch()

  const addDomain = (e) => {
    e.preventDefault()
    if (name.match(/^(?!-\:)[-a-zA-Z0-9.]{2,256}\.[a-zA-Z]{2,8}$/g)) {
      setNameError('')
      dispatch(
        add({
          name: name,
          type: type,
          expectedValue: expectedValue
        })
      )
    } else {
      setNameError('Value must be domain name eg. example.com')
    }
  }

  let validatorError = ''
  if (nameError) {
    validatorError = (<ErrorBar message={nameError} />)
  }

  return (
    <div className="dnsc__form__wrapper">
      <form action="https://localhost" method="GET" className="dnsc__form">
        <div className="dnsc__form__input-group">
          <label htmlFor="name" className="dnsc__form__label">
            Query name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            placeholder="example.com"
            className="dnsc__form__input"
            onChange={onNameChange}
          />
          {validatorError}
        </div>
        <div className="dnsc__form__input-group">
          <label htmlFor="target" className="dnsc__form__label">
            Target
          </label>
          <select id="target" name="target" defaultValue="A" className="dnsc__form__input dnsc__form__select" onChange={onTypeChange}>
            <option value="A">A</option>
            <option value="AAAA">AAAA</option>
            <option value="MX">MX</option>
            <option value="CNAME">CNAME</option>
            <option value="TXT">TXT</option>
            <option value="NETLIFY">NETLIFY</option>
            <option value="ALIAS">ALIAS</option>
            <option value="SPF">SPF</option>
            <option value="SRV">SRV</option>
            <option value="CAA">CAA</option>
            <option value="NS">NS</option>
          </select>
        </div>
        <div className="dnsc__form__input-group">
          <label htmlFor="expected-value" className="dnsc__form__label">
            Expected value
          </label>
          <input
            id="expected-value"
            name="expected-value"
            type="text"
            className="dnsc__form__input"
            onChange={onExpectedValueChange}
          />
        </div>
        <button type="submit" className="dnsc__button__primary dnsc__button__primary--spaceous" onClick={addDomain}>
          Add domain
        </button>
      </form>
    </div>
  )
}

export default Form
