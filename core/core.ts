export interface ElabOptions {
  readonly popupTemplate: string
  readonly popupItemTemplate: string
}

const createTemplatedElementFactory = <T extends Element>(html: string, className: string) => {
  const template = document.createElement('template')
  template.innerHTML = html
  const element = template.content.firstElementChild as T
  element.classList.add(className)
  return () => element.cloneNode(true) as T
}

export const elab = (options: ElabOptions) => {
  let activeBar: HTMLElement | undefined
  let activePopup: HTMLElement | undefined

  const CLASS_POPUP_DROPUP = 'elab-popup-dropup'
  const CLASS_POPUP_DROPDOWN = 'elab-popup-dropdown'

  const ATTRIBUTE_VALUE = 'data-value'
  const ATTRIBUTE_SELECTED = 'data-selected'
  const ATTRIBUTE_DISABLED = 'data-disabled'
  const ATTRIBUTE_SELECTED_ALL = 'data-selected-all'
  const ATTRIBUTE_PLACEHOLDER = 'data-placeholder'

  const SELECTOR_BAR = '.elab'
  const SELECTOR_CHECKBOX = 'input[type=checkbox]'
  const SELECTOR_POPUP_ITEM = '.elab-popup-item'

  const createPopup = createTemplatedElementFactory<HTMLElement>(options.popupTemplate, 'elab-popup')
  const createPopupItem = createTemplatedElementFactory<HTMLElement>(options.popupItemTemplate, 'elab-popup-item')

  const nextElementSibling = (element: Element | null | undefined) => element?.nextElementSibling
  const previousElementSibling = (element: Element | null | undefined) => element?.previousElementSibling

  const collectValues = (bar: Element) => {
    const values = []
    for (const barItem of bar.firstElementChild!.children) {
      const value = barItem.getAttribute(ATTRIBUTE_VALUE)
      if (value && barItem.hasAttribute(ATTRIBUTE_SELECTED)) {
        values.push(value)
      }
    }
    return values
  }

  const setSelectedAll = (checkbox: HTMLInputElement, bar: Element) => {
    const selectedCount = bar.querySelectorAll(`[${ATTRIBUTE_SELECTED}]`).length
    checkbox.checked = selectedCount !== 0
    checkbox.indeterminate = selectedCount !== bar.querySelectorAll(`[${ATTRIBUTE_VALUE}]:not([${ATTRIBUTE_DISABLED}])`).length
  }

  const resizeActivePopup = () => {
    if (activeBar && activePopup) {
      const barClientRect = activeBar.getBoundingClientRect()
      activePopup.style.left = activeBar.offsetLeft + 'px'
      activePopup.style.width = activeBar.offsetWidth + 'px'
      if (activePopup.classList.contains(CLASS_POPUP_DROPUP)) {
        activePopup.style.maxHeight = barClientRect.top - 8 + 'px'
        activePopup.style.top = activeBar.offsetTop - activePopup.offsetHeight + 'px'
      } else {
        activePopup.style.maxHeight = window.innerHeight - barClientRect.bottom - 20 + 'px'
        activePopup.style.top = activeBar.offsetTop + activeBar.offsetHeight + 'px'
      }
    }
  }

  const closeActivePopup = () => {
    if (
      activeBar &&
      !activeBar.dispatchEvent(new CustomEvent('close', { bubbles: true, cancelable: true, detail: { values: collectValues(activeBar) } }))
    ) {
      return
    }
    activeBar?.focus()
    activePopup?.remove()
    activeBar = activePopup = undefined
  }

  const onPointerOverOnPopup = (event: PointerEvent) =>
    (event.target as HTMLElement).closest(SELECTOR_POPUP_ITEM)?.querySelector<HTMLInputElement>(SELECTOR_CHECKBOX)?.focus()
  const onChangeOnPopup = (event: Event) => {
    const popup = event.currentTarget as HTMLElement
    const checkbox = event.target as HTMLInputElement
    const barItem =
      checkbox.matches(SELECTOR_CHECKBOX) &&
      activeBar?.firstElementChild!.children[[...popup.children].indexOf(checkbox.closest(SELECTOR_POPUP_ITEM)!)]
    if (!barItem) {
      return
    }
    if (barItem.hasAttribute(ATTRIBUTE_SELECTED_ALL)) {
      for (const barItem of activeBar!.firstElementChild!.children) {
        if (barItem.hasAttribute(ATTRIBUTE_VALUE) && !barItem.hasAttribute(ATTRIBUTE_DISABLED)) {
          barItem.toggleAttribute(ATTRIBUTE_SELECTED, checkbox.checked)
        }
      }
      for (const _checkbox of popup.querySelectorAll<HTMLInputElement>(SELECTOR_CHECKBOX)) {
        if (_checkbox !== checkbox && !_checkbox.disabled) {
          _checkbox.checked = checkbox.checked
        }
      }
    } else {
      barItem.toggleAttribute(ATTRIBUTE_SELECTED, checkbox.checked)
      const checkboxAll = popup.querySelector<HTMLInputElement>(`[${ATTRIBUTE_SELECTED_ALL}] ${SELECTOR_CHECKBOX}`)
      checkboxAll && setSelectedAll(checkboxAll, activeBar!)
    }
    resizeActivePopup()
    activeBar!.dispatchEvent(new CustomEvent('change', { bubbles: true, detail: { values: collectValues(activeBar!) } }))
    event.stopPropagation()
  }

  const onKeyDownOnPopup = (event: KeyboardEvent) => {
    const checkbox = event.target as HTMLElement
    if (!checkbox.matches(SELECTOR_CHECKBOX)) {
      return
    }
    const keyCode = event.keyCode
    if (keyCode === 38 || keyCode === 40) {
      event.preventDefault()
      const next = keyCode === 38 ? previousElementSibling : nextElementSibling
      for (let popupItem = next(checkbox.closest(SELECTOR_POPUP_ITEM)); popupItem; popupItem = next(popupItem)) {
        const input = popupItem.querySelector<HTMLInputElement>(SELECTOR_CHECKBOX)
        if (!input?.disabled) {
          input?.focus()
          break
        }
      }
    }
  }

  const openPopup = (bar: HTMLElement) => {
    if (activeBar === bar) {
      return
    }
    if (activeBar) {
      closeActivePopup()
    }
    const barRect = bar.getBoundingClientRect()
    const popup = createPopup()
    const popupItemsSlot = popup.querySelector('slot')!
    const popupItemsContainer = popupItemsSlot.parentElement!
    popupItemsSlot.remove()
    for (const barItem of (bar.firstElementChild!.cloneNode(true) as Element).children) {
      if (barItem.hasAttribute(ATTRIBUTE_PLACEHOLDER)) {
        continue
      }
      const popupItem = popupItemsContainer.appendChild(createPopupItem())
      for (const attributeName of barItem.getAttributeNames()) {
        popupItem.setAttribute(attributeName, barItem.getAttribute(attributeName)!)
      }
      const checkbox = popupItem.querySelector<HTMLInputElement>(SELECTOR_CHECKBOX)
      if (checkbox) {
        if (barItem.hasAttribute(ATTRIBUTE_SELECTED_ALL)) {
          setSelectedAll(checkbox, bar)
        } else {
          checkbox.value = barItem.getAttribute(ATTRIBUTE_VALUE)!
          checkbox.checked = barItem.hasAttribute(ATTRIBUTE_SELECTED)
          checkbox.disabled = barItem.hasAttribute(ATTRIBUTE_DISABLED)
        }
      }
      popupItem.getElementsByTagName('slot')[0]?.replaceWith(...barItem.childNodes)
    }
    popup.addEventListener('pointerover', onPointerOverOnPopup)
    popup.addEventListener('change', onChangeOnPopup)
    popup.addEventListener('keydown', onKeyDownOnPopup)

    activePopup = bar.parentElement!.insertBefore(popup, bar)
    activeBar = bar
    activePopup.classList.add(
      barRect.top * 1.75 > window.innerHeight && barRect.bottom + activePopup.offsetHeight > window.innerHeight
        ? CLASS_POPUP_DROPUP
        : CLASS_POPUP_DROPDOWN,
    )
    resizeActivePopup()

    // without this, on Mac with preference `Show scrollbars: always`, position of the dropdown becomes wrong when the scrollbar is displayed...
    activePopup.style.left = barRect.left + 'px'
    activePopup.style.width = barRect.width + 'px'

    setTimeout(() => activePopup?.getElementsByTagName('input')[0]?.focus())
  }

  addEventListener('resize', resizeActivePopup)

  addEventListener('pointerdown', event => {
    const element = event.target as Element
    const bar = element.closest<HTMLElement>(SELECTOR_BAR)
    if (bar) {
      bar === activeBar ? closeActivePopup() : openPopup(bar)
    } else if (activePopup && !activePopup.contains(element)) {
      closeActivePopup()
    }
  })

  addEventListener('keydown', event => {
    const element = event.target as HTMLElement
    const keyCode = event.keyCode
    if (keyCode === 32 && element.matches(SELECTOR_BAR)) {
      event.preventDefault()
      element === activePopup ? closeActivePopup() : openPopup(element)
    } else if ((keyCode === 38 || keyCode === 40) && element.matches(SELECTOR_BAR)) {
      event.preventDefault()
      openPopup(element)
    } else if (keyCode === 27 && activePopup) {
      event.preventDefault()
      closeActivePopup()
    }
  })
}
