
// Menu.styled.js
import styled from 'styled-components';
import config from '../../../config';

export const StyledMenu = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: start;
  background: ${config.theme.darkColor};
  height: 100vh;
  text-align: left;
  padding: 4.4rem 0rem 4.4rem 0rem;
  position: fixed;
  top: 0;
  left: 0;
  transition: transform 0.3s ease-in-out;
  transform: ${({ open }) => open ? 'translateX(0%)' : 'translateX(-75%)'};
  width: 225px;
  z-index:30;

  a {
    font-size: 2rem;
    text-transform: uppercase;
    padding: 2rem 0;
    font-weight: bold;
    letter-spacing: 0.5rem;
    color: ${({ theme }) => theme.primaryDark};
    text-decoration: none;
    transition: color 0.3s linear;
    
    @media (max-width: ${({ theme }) => theme.mobile}) {
      font-size: 1.5rem;
      text-align: center;
    }

    &:hover {
      color: ${({ theme }) => theme.primaryHover};
    }
  }
`;