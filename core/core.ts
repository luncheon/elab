export interface ElabOptions {
  readonly popupTemplate: string
  readonly popupItemTemplate: string
  readonly onOpen?: (popup: ElabPopup) => void
}

interface ElabItem {
  barItem: HTMLElement
  popupItem: HTMLElement
  checkbox: HTMLInputElement
}

interface ElabPopup {
  readonly bar: HTMLElement
  readonly popup: HTMLElement
  readonly items: ElabItem[]
  readonly itemSelectedAll?: ElabItem
}

const createTemplatedElementFactory = <T extends Element>(html: string, className: string) => {
  const template = document.createElement('template')
  template.innerHTML = html
  const element = template.content.firstElementChild as T
  element.classList.add(className)
  return () => element.cloneNode(true) as T
}

const collectValues = (items: ElabItem[]) =>
  items.map(item => item.checkbox.checked && item.barItem.getAttribute('data-value')).filter(Boolean) as string[]

export const elab = (options: ElabOptions) => {
  let activePopup: ElabPopup | undefined

  const CLASS_BAR_OPEN = 'elab-open'
  const CLASS_POPUP_DROPUP = 'elab-popup-dropup'
  const CLASS_POPUP_DROPDOWN = 'elab-popup-dropdown'

  const ATTRIBUTE_SELECTED = 'data-selected'
  const ATTRIBUTE_DISABLED = 'data-disabled'
  const ATTRIBUTE_SELECTED_ALL = 'data-selected-all'
  const ATTRIBUTE_PLACEHOLDER = 'data-placeholder'

  const SELECTOR_BAR = '.elab'
  const SELECTOR_CHECKBOX = 'input[type=checkbox]'
  const SELECTOR_POPUP_ITEM = '.elab-popup-item'

  const createPopupElement = createTemplatedElementFactory<HTMLElement>(options.popupTemplate, 'elab-popup')
  const createPopupItemElement = createTemplatedElementFactory<HTMLElement>(options.popupItemTemplate, 'elab-popup-item')

  const setCheckState = (item: ElabItem, checked: boolean) => {
    if (!item.checkbox.disabled) {
      item.checkbox.checked = checked
      item.barItem.toggleAttribute(ATTRIBUTE_SELECTED, checked)
      item.popupItem.toggleAttribute(ATTRIBUTE_SELECTED, checked)
    }
  }
  const updateSelectedAllCheckState = (itemSelectedAll: ElabItem | undefined, items: readonly ElabItem[]) => {
    if (itemSelectedAll) {
      const uncheckedAll = items.every(({ checkbox }) => checkbox.disabled || !checkbox.checked)
      itemSelectedAll.checkbox.checked = !uncheckedAll
      itemSelectedAll.checkbox.indeterminate = !uncheckedAll && !items.every(({ checkbox }) => checkbox.disabled || checkbox.checked)
    }
  }

  const layoutPopup = (popup: HTMLElement, bar: HTMLElement) => {
    const barClientRect = bar.getBoundingClientRect()
    popup.style.left = barClientRect.left + 'px'
    popup.style.width = barClientRect.width + 'px'
    if (popup.classList.contains(CLASS_POPUP_DROPUP)) {
      popup.style.maxHeight = barClientRect.top - 8 + 'px'
      popup.style.top = barClientRect.top - popup.offsetHeight + 'px'
    } else {
      popup.style.maxHeight = window.innerHeight - barClientRect.bottom - 20 + 'px'
      popup.style.top = barClientRect.top + bar.offsetHeight + 'px'
    }
  }

  const closeActivePopup = () => {
    if (
      activePopup?.bar.dispatchEvent(
        new CustomEvent('close', { bubbles: true, cancelable: true, detail: { values: collectValues(activePopup.items) } }),
      )
    ) {
      activePopup.bar.classList.remove(CLASS_BAR_OPEN)
      activePopup.bar.focus()
      activePopup.popup.remove()
      activePopup = undefined
    }
  }

  const createPopupItems = (bar: HTMLElement, appendTo: Element) => {
    const items: ElabItem[] = []
    let itemSelectedAll: ElabItem | undefined
    for (const barItem of bar.firstElementChild!.children as Iterable<HTMLElement>) {
      if (barItem.hasAttribute(ATTRIBUTE_PLACEHOLDER)) {
        continue
      }
      const popupItem = appendTo.appendChild(createPopupItemElement())
      for (const attributeName of barItem.getAttributeNames()) {
        popupItem.setAttribute(attributeName, barItem.getAttribute(attributeName)!)
      }
      popupItem.querySelector('slot')!.replaceWith(...barItem.cloneNode(true).childNodes)

      const checkbox = popupItem.querySelector<HTMLInputElement>(SELECTOR_CHECKBOX)
      if (checkbox) {
        if (barItem.hasAttribute(ATTRIBUTE_SELECTED_ALL)) {
          itemSelectedAll = { barItem, popupItem, checkbox }
        } else {
          checkbox.checked = barItem.hasAttribute(ATTRIBUTE_SELECTED)
          checkbox.disabled = barItem.hasAttribute(ATTRIBUTE_DISABLED)
          items.push({ barItem, popupItem, checkbox })
        }
      }
    }
    updateSelectedAllCheckState(itemSelectedAll, items)
    return [items, itemSelectedAll] as const
  }

  const openPopup = (bar: HTMLElement) => {
    if (activePopup?.bar === bar) {
      return
    }
    if (activePopup) {
      closeActivePopup()
    }
    const barRect = bar.getBoundingClientRect()
    const popup = createPopupElement()
    const slot = popup.querySelector('slot')!
    const [items, itemSelectedAll] = createPopupItems(bar, slot.parentElement!)
    slot.remove()
    activePopup = { bar, popup, items, itemSelectedAll }
    bar.classList.add(CLASS_BAR_OPEN)
    popup.className = (popup.className + ' ' + (bar.getAttribute('data-popup-class') || '')).trim()
    popup.style.cssText = bar.getAttribute('data-popup-style') || ''

    bar.parentElement!.insertBefore(popup, bar)
    popup.classList.add(
      barRect.top * 1.75 > window.innerHeight && barRect.bottom + popup.offsetHeight > window.innerHeight
        ? CLASS_POPUP_DROPUP
        : CLASS_POPUP_DROPDOWN,
    )
    layoutPopup(popup, bar)

    const setSelected = (checkbox: HTMLElement, checked: boolean) => {
      if (checkbox === itemSelectedAll?.checkbox) {
        for (const item of items) {
          setCheckState(item, checked)
        }
        itemSelectedAll.checkbox.checked = checked
        itemSelectedAll.checkbox.indeterminate = false
      } else {
        const item = items.find(item => item.checkbox === checkbox)
        if (!item) {
          return
        }
        setCheckState(item, checked)
        updateSelectedAllCheckState(itemSelectedAll, items)
      }
      layoutPopup(popup, bar)
      bar.dispatchEvent(new CustomEvent('change', { bubbles: true, detail: { values: collectValues(items) } }))
    }

    popup.addEventListener('pointerover', event =>
      (event.target as HTMLElement).closest(SELECTOR_POPUP_ITEM)?.querySelector<HTMLInputElement>(SELECTOR_CHECKBOX)?.focus(),
    )
    popup.addEventListener('change', event => {
      const checkbox = event.target as HTMLInputElement
      if (checkbox.matches(SELECTOR_CHECKBOX)) {
        setSelected(checkbox, checkbox.checked)
        event.stopPropagation()
      }
    })
    popup.addEventListener('keydown', event => {
      const checkbox = event.target as HTMLInputElement
      if (!checkbox.matches(SELECTOR_CHECKBOX)) {
        return
      }
      const keyCode = event.keyCode
      if (keyCode === 38 || keyCode === 40) {
        event.preventDefault()
        const next = keyCode === 38 ? ('previousElementSibling' as const) : ('nextElementSibling' as const)
        for (let popupItem = checkbox.closest(SELECTOR_POPUP_ITEM)?.[next]; popupItem; popupItem = popupItem[next]) {
          const input = popupItem.querySelector<HTMLInputElement>(SELECTOR_CHECKBOX)
          if (!input?.disabled) {
            input?.focus()
            break
          }
        }
      } else if (keyCode === 13) {
        event.preventDefault()
        setSelected(checkbox, !checkbox.checked)
      }
    })
    setTimeout(() => popup.getElementsByTagName('input')[0]?.focus())
    options.onOpen?.(activePopup)
  }

  addEventListener('resize', () => activePopup && layoutPopup(activePopup.popup, activePopup.bar))
  addEventListener('scroll', () => activePopup && layoutPopup(activePopup.popup, activePopup.bar))

  addEventListener('pointerdown', event => {
    const element = event.target as Element
    const bar = element.closest<HTMLElement>(SELECTOR_BAR)
    if (bar) {
      bar === activePopup?.bar ? closeActivePopup() : openPopup(bar)
    } else if (activePopup) {
      if (activePopup.popup.contains(element)) {
        // prevent labels from becoming active
        event.preventDefault()
      } else {
        closeActivePopup()
      }
    }
  })

  addEventListener('keydown', event => {
    const element = event.target as HTMLElement
    const keyCode = event.keyCode
    if (keyCode === 27 && activePopup) {
      event.preventDefault()
      closeActivePopup()
    } else if (keyCode === 32 && element.matches(SELECTOR_BAR)) {
      event.preventDefault()
      element === activePopup?.popup ? closeActivePopup() : openPopup(element)
    } else if ((keyCode === 38 || keyCode === 40) && element.matches(SELECTOR_BAR)) {
      event.preventDefault()
      openPopup(element)
    }
  })
}
