export function createIcon(name: string, options?: {size: string; color: string}) {
  const iconName = 'icon-' + name
  const {size = '1em', color} = options || {}
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
  svg.style.cssText = `width: ${size}; height: ${size};`
  if (color) svg.style.color = color
  svg.setAttribute('class', `custom-icon ${iconName}`)
  const use = document.createElementNS('http://www.w3.org/2000/svg', 'use')
  use.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', `#${iconName}`)
  svg.appendChild(use)
  return svg
}
