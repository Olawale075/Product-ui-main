import React from 'react'
import { Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import styles from './my-style.module.css'; 
const ButtonType = () => {

  
  return (
    <div m-3 className={styles.body}>
     <a href="/shoes">     
      <Button size='sm' variant="outline-secondary">SHOE</Button>{' '}
      </a>
      <a href="/posts">
      <Button size='sm' variant="outline-secondary">SHIRT</Button>{' '}
      </a>
      <a href="/shoes">
      <Button size='sm' variant="outline-secondary">BEACH W</Button>{' '}
      </a>
      <a href="/posts">
      <Button size='sm' variant="outline-secondary">BOXER</Button>{' '}
      </a>
      <a href="/posts">
      <Button size='sm' variant="outline-secondary">TOP</Button>{' '}
      </a>
      <a href="/cross">
      <Button size='sm' variant="outline-secondary">CROSS</Button>{' '}
     </a>
     <a href="/posts">
      <Button size='sm' variant="outline-secondary">WATCH</Button>{' '}
    </a>
    </div>
  )
}

export default ButtonType 
