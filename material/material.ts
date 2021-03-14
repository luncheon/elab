import { mdiCheckboxBlankOffOutline, mdiCheckboxBlankOutline, mdiCheckboxMarked, mdiMinusBox } from '@mdi/js'
import ripplet from 'ripplet.js/es/ripplet-declarative'
import { elab } from '../core/core'
import './material.scss'

elab({
  popupTemplate: '<ul><slot></slot></ul>',
  popupItemTemplate: `<li><label class=elab-label data-ripplet="append-to:parent;color:var(--elab-color);">
<div class=elab-label-background></div>
<input class=elab-checkbox type=checkbox>
<svg class=elab-checkbox-icon viewBox="0 0 24 24" data-ripplet="append-to:parent;opacity:.2;centered:true;">
  <path class=elab-checkbox-icon-unchecked d="${mdiCheckboxBlankOutline}" />
  <path class=elab-checkbox-icon-disabled d="${mdiCheckboxBlankOffOutline}" />
  <path class=elab-checkbox-icon-checked d="${mdiCheckboxMarked}" />
  <path class=elab-checkbox-icon-indeterminate d="${mdiMinusBox}" />
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
  elab &&
    ripplet(
      { currentTarget: elab, clientX: event.clientX, clientY: event.clientY },
      { appendTo: 'parent', clearing: false, color: 'var(--elab-color)' },
    )
})
