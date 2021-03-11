import { elab } from '../core/core'
import './simple.scss'

elab({
  popupTemplate: '<ul><slot></slot></ul>',
  popupItemTemplate:
    '<li><label class=elab-label><input class=elab-checkbox type=checkbox><div class=elab-content><slot></slot></div></label></li>',
})
