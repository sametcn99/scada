import {
  CContainer,
  CNavbar,
  CNavbarBrand,
  CNavbarToggler,
  CCollapse,
  CNavItem,
  CNavLink,
  CNavbarNav,
} from '@coreui/react'
import { useState } from 'react'
import { useLocation } from 'react-router-dom'

export default function Navbar() {
  const [visible, setVisible] = useState(false)
  const location = useLocation()

  return (
    <CNavbar
      expand='lg'
      colorScheme='dark'
      className='bg-dark mb-2'
    >
      <CContainer fluid>
        <CNavbarBrand
          href='#'
          className='font-extrabold'
        >
          SCADA
        </CNavbarBrand>
        <CNavbarToggler
          aria-label='Toggle navigation'
          aria-expanded={visible}
          onClick={() => setVisible(!visible)}
        />
        <CCollapse
          className='navbar-collapse'
          visible={visible}
        >
          <CNavbarNav>
            <CNavItem>
              <CNavLink
                href='/'
                active={location.pathname === '/'}
              >
                Home
              </CNavLink>
            </CNavItem>
            <CNavItem>
              <CNavLink
                href='/lab'
                active={location.pathname === '/lab'}
              >
                Lab
              </CNavLink>
            </CNavItem>
            <CNavItem>
              <CNavLink
                href='/editor'
                active={location.pathname === '/editor'}
              >
                Editor
              </CNavLink>
            </CNavItem>
          </CNavbarNav>
        </CCollapse>
      </CContainer>
    </CNavbar>
  )
}
