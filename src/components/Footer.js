import React from 'react'
import "../css/Footer.css"

const Footer = () => {
  const year = new Date().getFullYear()

  return (
    <footer>
      <div className="footer-container">
        <small>
					&copy; Copyright {year}, Ahmed Mohammed, Richard Denton, Steven Weng
				</small>
      </div>
    </footer>
  )
}

export default Footer