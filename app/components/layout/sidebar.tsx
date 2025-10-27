import Link from 'next/link'
import React from 'react'

function Sidebar() {
  return (
<div className="sidebar" id="sidebar">
  <div className="sidebar-inner slimscroll">
    <div id="sidebar-menu" className="sidebar-menu">
       <ul className="nav nav-pills flex-column mb-auto">
        <li className="nav-item">
          <Link href="/dashboard" className="nav-link  text-white" aria-current="page">
            <i data-feather="home" className="me-2" />
            Dashboard
          </Link>
        </li>
        <li>
          <Link href="#" className="nav-link text-white">
            <i data-feather="users" className="me-2" />
            Client
          </Link>
        </li>
        <li>
          <Link href="#" className="nav-link text-white">
            <i data-feather="briefcase" className="me-2" />
            Companies
          </Link>
        </li>
        <li>
          <Link href="#" className="nav-link text-white">
            <i data-feather="clipboard" className="me-2" />
            Plan
          </Link>
        </li>
        <li>
          <Link href="#" className="nav-link text-white">
            <i data-feather="calendar" className="me-2" />
            Subscription
          </Link>
        </li>
        <li>
          <Link href="#" className="nav-link text-white">
            <i data-feather="settings" className="me-2" />
            Settings
          </Link>
        </li>


          <li>
          <Link href="/dashboard/users" className="nav-link text-white">
            <i data-feather="settings" className="me-2" />
            users
          </Link>
        </li>


        <li>
          <Link href="/login" className="nav-link text-white">
            <i data-feather="log-out" className="me-2" />
            Sign Out
          </Link>
        </li>
      </ul>
    </div>
  </div>
</div>

  )
}

export default Sidebar