import { Box, Menu } from '@mui/material'
import { makeStyles } from '@mui/styles'
import React from 'react'
import ButtonPrimary from '../ButtonPrimary/ButtonPrimary'


const useStyles = makeStyles({
  button: {},
  buttonDropdown: {
    position: 'absolute',
  },
})

type SelectButtonProps = {
  textPrefix?: string
  onChange?: (event: React.ChangeEvent<{ name?: string; value?: unknown }>) => void
  onClick?: (event: React.ChangeEvent<{ name?: string; value?: unknown }>) => void
  value?: string
  children: React.ReactNode
  classes?: any
  placeholder?: string
}

const SelectButton = React.forwardRef<HTMLDivElement, SelectButtonProps>((
  props: SelectButtonProps,
  ref: React.Ref<HTMLDivElement>,
) => {
  const { textPrefix, onChange = () => { }, onClick = () => { }, value: initialValue, children, placeholder } = props

  const classes = useStyles(props)
  const anchorRef = (ref as React.RefObject<HTMLDivElement>) || React.useRef<HTMLDivElement>(null)
  const [isOpen, setOpen] = React.useState(false)
  const valueRef = React.useRef(initialValue)
  valueRef.current = initialValue

  const handleItemClick = (value: string) => (e: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
    setOpen(false)
    Object.defineProperty(e, 'target', { writable: true, value: { value } })
    valueRef.current = value
    onChange(e)
  }

  const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    const value = valueRef.current
    Object.defineProperty(e, 'target', { writable: true, value: { value } })
    valueRef.current = value
    onClick(e)
    setOpen(true)
  }

  const items = React.Children
    .map(children as React.ReactElement, child => {
      if (!child) {
        return null
      }
      const selected = valueRef.current === child.props.value
      const valueReadable = child.props.children
      const item = React.cloneElement(child, {
        'aria-selected': selected ? 'true' : undefined,
        onClick: handleItemClick(child.props.value),
        role: 'option',
        selected,
        value: undefined, // The value is most likely not a valid HTML attribute.
        'data-value': child.props.value, // Instead, we provide it as a data attribute.
        'data-value-readable': valueReadable,
      })
      return item
    })
    .filter(item => item !== null)

  const displayName = (value: any) =>
    (items.find(item => item!.props['data-value'] === value)!).props['data-value-readable']

  return <>
    <ButtonPrimary startIcon={'mdi:flag'} variant='outlined' color="primary" title={placeholder} ref={anchorRef} onClick={handleButtonClick} />
    <Menu
      open={isOpen}
      onClose={() => setOpen(false)}
      getContentAnchorEl={null} // needed for anchorOrigin to work
      anchorEl={anchorRef.current}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      className={classes.buttonDropdown}
    >
      {items}
    </Menu>
  </>
})

SelectButton.displayName = 'SelectButton'

export default SelectButton