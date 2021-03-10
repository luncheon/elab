import { elab } from '../core/core'
import './simple.scss'

elab({
  popupItemTemplate: '<label class=elab-label><input class=elab-checkbox type=checkbox><div class=elab-content><slot></slot></div></label>',
})
