
import React from 'react'
import styles from './AppLoader.module.scss'

type AppLoaderProps = { 
  isActive: boolean,
  mode: 'block' | 'screen' 
}
function AppLoader({ isActive, mode = 'block' }: AppLoaderProps): JSX.Element {

  return (
    <div className={`${styles.loaderOverlay} ${isActive ? styles.active : ''} ${mode==='block' ? styles.blockLoader : styles.screeLoader }`}>
      <img className={styles.loader} src={require('../../../assets/img/loading.svg').default} width="40" alt="Loading"/>
    </div>
  )
}

export default AppLoader