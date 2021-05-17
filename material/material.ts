import { mdiCheckboxBlankOffOutline, mdiCheckboxBlankOutline, mdiCheckboxMarked, mdiMinusBox } from '@mdi/js'
import 'ripplet.js/es/ripplet-declarative'
import { elab } from '../core/core'
import './material.scss'

elab({
  popupTemplate: '<ul><slot></slot></ul>',
  popupItemTemplate: `<li><label class=elab-label data-ripplet="color:var(--elab-color)">
<div class=elab-label-background></div>
<input class=elab-checkbox type=checkbox>
<svg class=elab-checkbox-icon viewBox="0 0 24 24" data-ripplet="opacity:.2;centered:true">
  <path class=elab-checkbox-icon-unchecked d="${mdiCheckboxBlankOutline}" />
  <path class=elab-checkbox-icon-disabled d="${mdiCheckboxBlankOffOutline}" />
  <path class=elab-checkbox-icon-checked d="${mdiCheckboxMarked}" />
  <path class=elab-checkbox-icon-indeterminate d="${mdiMinusBox}" />
</svg>
<div class=elab-content><slot></slot></div>
</label></li>`,
  onOpen: ({ bar, popup }) => popup.style.setProperty('--elab-color', getComputedStyle(bar).getPropertyValue('--elab-color')),
})
