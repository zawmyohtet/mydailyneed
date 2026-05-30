import { useState } from 'react'
import ToolLayout from '../../components/ToolLayout'
import CopyButton from '../../components/CopyButton'
import { hexToRgb, rgbToHex, hslToRgb, rgbToHsl } from '../../utils/misc'

export default function ColorConverter() {
  const [input, setInput] = useState('')
  const [inputFormat, setInputFormat] = useState('hex')
  const [results, setResults] = useState(null)
  const [error, setError] = useState(null)

  const handleConvert = () => {
    setError(null)
    setResults(null)

    try {
      let rgb, hex, hsl

      if (inputFormat === 'hex') {
        rgb = hexToRgb(input)
        hex = input.toUpperCase()
        hsl = rgbToHsl(rgb.r, rgb.g, rgb.b)
      } else if (inputFormat === 'rgb') {
        const match = input.match(/(\d+),\s*(\d+),\s*(\d+)/)
        if (!match) {
          setError('Invalid RGB format. Use R,G,B (e.g., 255,0,0)')
          return
        }
        const r = parseInt(match[1])
        const g = parseInt(match[2])
        const b = parseInt(match[3])
        rgb = { r, g, b }
        hex = rgbToHex(r, g, b)
        hsl = rgbToHsl(r, g, b)
      } else if (inputFormat === 'hsl') {
        const match = input.match(/(\d+),\s*(\d+),\s*(\d+)/)
        if (!match) {
          setError('Invalid HSL format. Use H,S,L (e.g., 0,100,50)')
          return
        }
        const h = parseInt(match[1])
        const s = parseInt(match[2])
        const l = parseInt(match[3])
        rgb = hslToRgb(h, s, l)
        hex = rgbToHex(rgb.r, rgb.g, rgb.b)
        hsl = { h, s, l }
      }

      setResults({ rgb, hex, hsl })
    } catch (e) {
      setError(e.message)
    }
  }

  const handleClear = () => {
    setInput('')
    setResults(null)
    setError(null)
  }

  return (
    <ToolLayout
      title="Color Converter"
      icon={["fas", "palette"]}
      description="Convert colors between HEX, RGB, and HSL formats"
      path="/tools/color-converter"
      keywords={["color", "hex", "rgb", "hsl", "convert"]}
    >
      <div className="space-y-4">
        <div>
          <label htmlFor="input" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Color value
          </label>
          <div className="flex gap-2">
            <input
              id="input"
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={
                inputFormat === 'hex' ? '#RRGGBB' :
                inputFormat === 'rgb' ? 'R,G,B' : 'H,S,L'
              }
              className="flex-1 p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 dark:placeholder-gray-500"
            />
            {results && (
              <div
                data-testid="color-preview"
                className="w-16 h-10 rounded border border-gray-300 dark:border-gray-600"
                style={{ backgroundColor: results.hex }}
              />
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Input format
          </label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="format"
                checked={inputFormat === 'hex'}
                onChange={() => setInputFormat('hex')}
                className="text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">HEX</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="format"
                checked={inputFormat === 'rgb'}
                onChange={() => setInputFormat('rgb')}
                className="text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">RGB</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="format"
                checked={inputFormat === 'hsl'}
                onChange={() => setInputFormat('hsl')}
                className="text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">HSL</span>
            </label>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleConvert}
            data-action="run"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
          >
            Convert
          </button>
          <button
            onClick={handleClear}
            data-action="clear"
            className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition font-medium"
          >
            Clear
          </button>
        </div>

        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-red-800 dark:text-red-400 text-sm font-medium">Error</p>
            <p className="text-red-700 dark:text-red-400 text-sm mt-1">{error}</p>
          </div>
        )}

        {results && (
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                HEX
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={results.hex}
                  readOnly
                  className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800/50 font-mono text-sm text-gray-900 dark:text-gray-100"
                />
                <CopyButton text={results.hex} />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                RGB
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={`rgb(${results.rgb.r}, ${results.rgb.g}, ${results.rgb.b})`}
                  readOnly
                  className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800/50 font-mono text-sm text-gray-900 dark:text-gray-100"
                />
                <CopyButton text={`rgb(${results.rgb.r}, ${results.rgb.g}, ${results.rgb.b})`} />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                HSL
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={`hsl(${results.hsl.h}, ${results.hsl.s}%, ${results.hsl.l}%)`}
                  readOnly
                  className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800/50 font-mono text-sm text-gray-900 dark:text-gray-100"
                />
                <CopyButton text={`hsl(${results.hsl.h}, ${results.hsl.s}%, ${results.hsl.l}%)`} />
              </div>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
