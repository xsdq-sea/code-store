export class Checkbox extends HTMLElement {
  private _checked: boolean
  private _root: HTMLLabelElement
  private _input: HTMLInputElement
  private _label: HTMLSpanElement
  private _disabled: boolean = false
  private _value?: string | number
  constructor(options?: {checked?: boolean; value?: string | number; label?: string; disabled?: boolean}) {
    super()

    const {checked = false, label, disabled = false, value} = options || {}

    this._checked = checked
    this._disabled = disabled
    this._value = value
    this.className = 'custom-checkbox'

    this.innerHTML = `
			<label>
				<span class="custom-checkbox_input">
					<span class="custom-checkbox_inner"></span>
					<input type="checkbox" />
				</span>
				<span class="custom-checkbox_label"></span>
			</label>
		`

    this._root = this.querySelector('label') as HTMLLabelElement

    const input = this.querySelector('input') as HTMLInputElement
    input.addEventListener('change', () => {
      this._checked = input.checked
      this.updateChecked()
    })
    this._input = input

    const checkboxLabel = this.querySelector('.custom-checkbox_label') as HTMLSpanElement
    if (label) checkboxLabel.textContent = label
    this._label = checkboxLabel

    this.updateChecked()
    this.updateDisabled()
  }
  set checked(checked: boolean) {
    this._checked = checked
    this.updateChecked()
  }
  get checked() {
    return this._checked
  }
  set label(label: string) {
    this._label.textContent = label
  }
  set disabled(disabled: boolean) {
    this._disabled = disabled
    this.updateDisabled()
  }
  get value() {
    return this._value
  }
  static get observedAttributes() {
    return ['checked', 'label', 'disabled']
  }
  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    if (name === 'checked') this.checked = newValue === 'true'
    else if (name === 'label') this.label = newValue
    else if (name === 'disabled') this.disabled = newValue === 'true'
  }

  updateChecked() {
    this._input.checked = this._checked
    const hasChecked = this._root.classList.contains('checked')
    if (this._checked && !hasChecked) {
      this._root.classList.add('checked')
    } else if (!this._checked && hasChecked) {
      this._root.classList.remove('checked')
    }
  }
  updateDisabled() {
    this._input.disabled = this._disabled
    const hasDisabled = this._root.classList.contains('disabled')
    if (this._disabled && !hasDisabled) {
      this._root.classList.add('disabled')
    } else if (!this._disabled && hasDisabled) {
      this._root.classList.remove('disabled')
    }
  }
}
customElements.define('custom-checkbox', Checkbox)
