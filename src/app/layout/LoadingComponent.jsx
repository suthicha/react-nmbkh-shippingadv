import React from 'react'
import { Dimmer, Loader  } from 'semantic-ui-react'

// const style = {
//   position: 'fixed',
//   backgroundColor: 'rgba(0,0,0,0.8);',
//   width: '100%',
//   height: '100%',
//   top: '0',
//   bottom: '0',
//   left: '0',
//   right: '0'
// }

const LoadingComponent = ({inverted, content}) => {
  return (
    <Dimmer inverted={inverted} active={true}>
      <Loader content={content ? content : 'Loading...'} />
    </Dimmer>
  )
}

export default LoadingComponent
