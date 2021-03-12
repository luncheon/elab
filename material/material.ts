import ripplet from 'ripplet.js/es/ripplet-declarative'
import { elab } from '../core/core'
import './material.scss'

elab({
  popupTemplate: '<ul><slot></slot></ul>',
  popupItemTemplate: `<li><label class=elab-label data-ripplet="color: var(--elab-color);">
<div class=elab-label-background></div>
<input class=elab-checkbox type=checkbox>
<svg class=elab-checkbox-icon viewBox="0 0 24 24" fill=currentColor data-ripplet="opacity: .2; centered: true;">
  <path class=elab-checkbox-icon-unchecked d="M19,3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3M19,5V19H5V5H19Z" />
  <path class=elab-checkbox-icon-disabled d="M22.11 21.46L2.39 1.73L1.11 3L3 4.9V19C3 20.11 3.9 21 5 21H19.1L20.84 22.73L22.11 21.46M5 19V6.89L17.11 19H5M8.2 5L6.2 3H19C20.1 3 21 3.89 21 5V17.8L19 15.8V5H8.2Z" />
  <path class=elab-checkbox-icon-checked d="M10,17L5,12L6.41,10.58L10,14.17L17.59,6.58L19,8M19,3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3Z" />
  <path class=elab-checkbox-icon-indeterminate d="M17,13H7V11H17M19,3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3Z" />
</svg>
<div class=elab-content><slot></slot></div>
</label></li>`,
})

const clearRipplet = (event: PointerEvent) => {
  const elab = (event.target as Element).closest('.elab')
  elab && ripplet.clear(elab)
}
addEventListener('pointerup', clearRipplet)
addEventListener('pointerout', clearRipplet)
addEventListener('pointercancel', clearRipplet)
addEventListener('pointerdown', event => {
  const elab = (event.target as Element).closest('.elab')
  elab && ripplet({ currentTarget: elab, clientX: event.clientX, clientY: event.clientY }, { clearing: false, color: 'var(--elab-color)' })
})
