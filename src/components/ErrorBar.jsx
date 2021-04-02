import React from 'react'

// Icons
import { ExclamationIcon } from '@heroicons/react/solid'

function ErrorBar (props) {
  return (
    <div className="dnsc__error-message">
      <ExclamationIcon /> {props.message}
    </div>
  )
}

export default ErrorBar
