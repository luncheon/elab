export interface ElabOptions {
  readonly template: string
}

export const elab = (options: ElabOptions) => {
  let activeTrigger: HTMLElement | undefined
  let activeDropdown: HTMLElement | undefined

  const CLASS_DROP = 'elab-drop'
  const CLASS_DROPUP = 'elab-dropup'
  const CLASS_DROPDOWN = 'elab-dropdown'

  const ATTRIBUTE_VALUE = 'data-value'
  const ATTRIBUTE_SELECTED = 'data-selected'
  const ATTRIBUTE_DISABLED = 'data-disabled'
  const ATTRIBUTE_SELECTED_ALL = 'data-selected-all'
  const ATTRIBUTE_PLACEHOLDER = 'data-placeholder'

  const SELECTOR_TRIGGER = '.elab'
  const SELECTOR_CHECKBOX = 'input[type=checkbox]'
  const SELECTOR_OPTION = 'li.elab-option'

  const optionBase = document.createElement('li')
  optionBase.className = 'elab-option'
  optionBase.innerHTML = options.template

  const nextElementSibling = (element: Element | null | undefined) => element?.nextElementSibling
  const previousElementSibling = (element: Element | null | undefined) => element?.previousElementSibling

  const collectValues = (trigger: Element) => {
    const values = []
    for (const item of trigger.firstElementChild!.children) {
      const value = item.getAttribute(ATTRIBUTE_VALUE)
      if (value && item.hasAttribute(ATTRIBUTE_SELECTED)) {
        values.push(value)
      }
    }
    return values
  }

  const isSelectedAll = (trigger: Element) => {
    let selectedAll = true
    let unselectedAll = true
    for (const item of trigger.firstElementChild!.querySelectorAll(`:not([${ATTRIBUTE_SELECTED_ALL}]):not([${ATTRIBUTE_PLACEHOLDER}])`)) {
      if (!item.hasAttribute(ATTRIBUTE_DISABLED)) {
        const selected = item.hasAttribute(ATTRIBUTE_SELECTED)
        selectedAll &&= selected
        unselectedAll &&= !selected
        if (!selectedAll && !unselectedAll) {
          return undefined
        }
      }
    }
    return selectedAll
  }
  const setSelectedAll = (checkbox: HTMLInputElement, trigger: Element) => {
    const selectedAll = isSelectedAll(trigger)
    checkbox.checked = selectedAll !== false
    checkbox.indeterminate = selectedAll === undefined
  }

  const resizeDropdown = () => {
    if (activeTrigger && activeDropdown) {
      const triggerClientRect = activeTrigger.getBoundingClientRect()
      activeDropdown.style.left = activeTrigger.offsetLeft + 'px'
      activeDropdown.style.width = activeTrigger.offsetWidth + 'px'
      if (activeDropdown.classList.contains(CLASS_DROPUP)) {
        activeDropdown.style.maxHeight = triggerClientRect.top - 8 + 'px'
        activeDropdown.style.top = activeTrigger.offsetTop - activeDropdown.offsetHeight + 'px'
      } else {
        activeDropdown.style.maxHeight = window.innerHeight - triggerClientRect.bottom - 20 + 'px'
        activeDropdown.style.top = activeTrigger.offsetTop + activeTrigger.offsetHeight + 'px'
      }
    }
  }

  const closeDropdown = () => {
    if (
      activeTrigger &&
      !activeTrigger.dispatchEvent(
        new CustomEvent('close', { bubbles: true, cancelable: true, detail: { values: collectValues(activeTrigger) } }),
      )
    ) {
      return
    }
    activeTrigger?.focus()
    activeDropdown?.remove()
    activeTrigger = activeDropdown = undefined
  }

  const onPointerOverOnDropdown = (event: PointerEvent) =>
    (event.target as HTMLElement).closest(SELECTOR_OPTION)?.querySelector<HTMLInputElement>(SELECTOR_CHECKBOX)?.focus()
  const onChangeOnDropdown = (event: Event) => {
    const dropdown = event.currentTarget as HTMLElement
    const checkbox = event.target as HTMLInputElement
    const item =
      checkbox.matches(SELECTOR_CHECKBOX) &&
      activeTrigger?.firstElementChild!.children[[...dropdown.children].indexOf(checkbox.closest(SELECTOR_OPTION)!)]
    if (!item) {
      return
    }
    if (item.hasAttribute(ATTRIBUTE_SELECTED_ALL)) {
      for (const item of activeTrigger!.firstElementChild!.children) {
        if (item.hasAttribute(ATTRIBUTE_VALUE) && !item.hasAttribute(ATTRIBUTE_DISABLED)) {
          item.toggleAttribute(ATTRIBUTE_SELECTED, checkbox.checked)
        }
      }
      for (const _checkbox of dropdown.querySelectorAll<HTMLInputElement>(SELECTOR_CHECKBOX)) {
        if (_checkbox !== checkbox && !_checkbox.disabled) {
          _checkbox.checked = checkbox.checked
        }
      }
    } else {
      item.toggleAttribute(ATTRIBUTE_SELECTED, checkbox.checked)
      const checkboxAll = dropdown.querySelector<HTMLInputElement>(`[${ATTRIBUTE_SELECTED_ALL}] ${SELECTOR_CHECKBOX}`)
      checkboxAll && setSelectedAll(checkboxAll, activeTrigger!)
    }
    resizeDropdown()
    activeTrigger!.dispatchEvent(new CustomEvent('change', { bubbles: true, detail: { values: collectValues(activeTrigger!) } }))
    event.stopPropagation()
  }

  const onKeyDownOnDropdown = (event: KeyboardEvent) => {
    const checkbox = event.target as HTMLElement
    if (!checkbox.matches(SELECTOR_CHECKBOX)) {
      return
    }
    const keyCode = event.keyCode
    if (keyCode === 38 || keyCode === 40) {
      event.preventDefault()
      const next = keyCode === 38 ? previousElementSibling : nextElementSibling
      for (let option = next(checkbox.closest(SELECTOR_OPTION)); option; option = next(option)) {
        const input = option.querySelector<HTMLInputElement>(SELECTOR_CHECKBOX)
        if (!input?.disabled) {
          input?.focus()
          break
        }
      }
    }
  }

  const openDropdown = (trigger: HTMLElement) => {
    if (activeTrigger === trigger) {
      return
    }
    if (activeTrigger) {
      closeDropdown()
    }
    const windowHeight = window.innerHeight
    const { left: triggerLeft, top: triggerTop, bottom: triggerBottom, width: triggerWidth } = trigger.getBoundingClientRect()
    activeDropdown = trigger.parentElement!.insertBefore(document.createElement('ul'), trigger)
    activeTrigger = trigger
    for (const sourceItem of (trigger.firstElementChild!.cloneNode(true) as Element).children) {
      if (sourceItem.hasAttribute(ATTRIBUTE_PLACEHOLDER)) {
        continue
      }
      const dropdownItem = activeDropdown.appendChild(optionBase.cloneNode(true) as typeof optionBase)
      for (const attributeName of sourceItem.getAttributeNames()) {
        dropdownItem.setAttribute(attributeName, sourceItem.getAttribute(attributeName)!)
      }
      const checkbox = dropdownItem.querySelector<HTMLInputElement>(SELECTOR_CHECKBOX)
      if (checkbox) {
        if (sourceItem.hasAttribute(ATTRIBUTE_SELECTED_ALL)) {
          setSelectedAll(checkbox, activeTrigger)
        } else {
          checkbox.value = sourceItem.getAttribute(ATTRIBUTE_VALUE)!
          checkbox.checked = sourceItem.hasAttribute(ATTRIBUTE_SELECTED)
          checkbox.disabled = sourceItem.hasAttribute(ATTRIBUTE_DISABLED)
        }
      }
      dropdownItem.getElementsByTagName('slot')[0]?.replaceWith(...sourceItem.childNodes)
    }
    activeDropdown.addEventListener('pointerover', onPointerOverOnDropdown)
    activeDropdown.addEventListener('change', onChangeOnDropdown)
    activeDropdown.addEventListener('keydown', onKeyDownOnDropdown)
    activeDropdown.className =
      CLASS_DROP +
      ' ' +
      (triggerTop * 1.75 > windowHeight && triggerBottom + activeDropdown.offsetHeight > windowHeight ? CLASS_DROPUP : CLASS_DROPDOWN)
    resizeDropdown()

    // without this, on Mac with preference `Show scrollbars: always`, position of the dropdown becomes wrong when the scrollbar is displayed...
    activeDropdown.style.left = triggerLeft + 'px'
    activeDropdown.style.width = triggerWidth + 'px'

    setTimeout(() => activeDropdown?.getElementsByTagName('input')[0]?.focus())
  }

  addEventListener('resize', resizeDropdown)

  addEventListener('pointerdown', event => {
    const element = event.target as Element
    const trigger = element.closest<HTMLElement>(SELECTOR_TRIGGER)
    if (trigger) {
      trigger === activeTrigger ? closeDropdown() : openDropdown(trigger)
    } else if (activeDropdown && !activeDropdown.contains(element)) {
      closeDropdown()
    }
  })

  addEventListener('keydown', event => {
    const element = event.target as HTMLElement
    const keyCode = event.keyCode
    if (keyCode === 32 && element.matches(SELECTOR_TRIGGER)) {
      event.preventDefault()
      element === activeDropdown ? closeDropdown() : openDropdown(element)
    } else if ((keyCode === 38 || keyCode === 40) && element.matches(SELECTOR_TRIGGER)) {
      event.preventDefault()
      openDropdown(element)
    } else if (keyCode === 27 && activeDropdown) {
      event.preventDefault()
      closeDropdown()
    }
  })
}