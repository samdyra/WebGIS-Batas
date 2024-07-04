import React, { memo } from 'react'
import s from "./styles.module.scss"
import layer from "../../assets/layer.png"
import { MAPBOX_STYLE } from '../../constants'

const BaseMapPicker = ({ setBaseMap }) => {
  const [ isHover, setIsHover ] = React.useState(false)
  const [ selected, setSelected ] = React.useState(0)
 
  const onHover = () => {
    setIsHover(true)
  }

  const onLeave = () => {
    setTimeout(() => {
      setIsHover(!isHover)
    }, 100)
  }

  const handleClick = (el, index) => {
    setSelected(index)
    setBaseMap(el)
  }

  return (
    <>
      <div className={s.wrapper} onMouseEnter={onHover} onMouseLeave={onLeave}>
        {!isHover && <img src={layer}/>}
        {isHover && (
          <div className={s.wrapper2}>
            {MAPBOX_STYLE.map((el, index) => {
              const isSelected = index === selected
              return (
                <div className={s.container} onClick={() => handleClick(el, index)}>
                  <img className={isSelected ? s.selected : ''} src={el.image}/>
                  <div>{el.name}</div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </>
  )
}

export default memo(BaseMapPicker)