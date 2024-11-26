import clsx from 'clsx'
import React from 'react'

const Button = ({ buttonType = 'button', type, text, color, action, isBtnDisabled }) => {
  return (
    <button type={buttonType} onClick={() => action()} className={clsx(['custom-button', type, color])} disabled={isBtnDisabled}>
      {text}
    </button>
  )
}

export default Button