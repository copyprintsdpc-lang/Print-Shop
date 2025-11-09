'use client'

import { useState } from 'react'
import { BookOpen, ChevronDown, ChevronUp, Info, Ruler } from 'lucide-react'

export default function PaperSizeGuide() {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedSeries, setSelectedSeries] = useState<'A' | 'B' | 'C' | null>(null)

  const aSeries = [
    { size: 'A0', mm: '841 x 1189', cm: '84.1 x 118.9', inches: '33.1 x 46.8', use: 'Technical drawings, posters' },
    { size: 'A1', mm: '594 x 841', cm: '59.5 x 84.1', inches: '23.4 x 33.1', use: 'Technical drawings, advertising' },
    { size: 'A2', mm: '420 x 594', cm: '42 x 59.4', inches: '16.5 x 23.4', use: 'Large posters, flyers' },
    { size: 'A3', mm: '297 x 420', cm: '29.7 x 42', inches: '11.7 x 16.5', use: 'Presentations, posters' },
    { size: 'A4', mm: '210 x 297', cm: '21 x 29.7', inches: '8.3 x 11.7', use: 'Documents, letters, forms' },
    { size: 'A5', mm: '148 x 210', cm: '14.8 x 21', inches: '5.8 x 8.3', use: 'Notebooks, flyers' },
    { size: 'A6', mm: '105 x 148', cm: '10.5 x 14.8', inches: '4.1 x 5.8', use: 'Postcards, photos' },
    { size: 'A7', mm: '74 x 105', cm: '7.4 x 10.5', inches: '2.9 x 4.1', use: 'Stickers, leaflets' },
    { size: 'A8', mm: '52 x 74', cm: '5.2 x 7.4', inches: '2.0 x 2.9', use: 'Business cards' },
    { size: 'A9', mm: '37 x 52', cm: '3.7 x 5.3', inches: '1.5 x 2.0', use: 'Labels' },
    { size: 'A10', mm: '26 x 37', cm: '2.6 x 3.7', inches: '1.0 x 1.5', use: 'Coupons, stamps' },
  ]

  const bSeries = [
    { size: 'B0', mm: '1000 x 1414', cm: '100.1 x 141.4', inches: '39.4 x 55.7', use: 'Large posters' },
    { size: 'B1', mm: '707 x 1000', cm: '70.7 x 100.0', inches: '27.8 x 39.4', use: 'Posters, brochures' },
    { size: 'B2', mm: '500 x 707', cm: '50.0 x 70.7', inches: '19.7 x 27.8', use: 'Calendars, posters' },
    { size: 'B3', mm: '353 x 500', cm: '35.3 x 50.0', inches: '13.9 x 19.7', use: 'Booklets' },
    { size: 'B4', mm: '250 x 353', cm: '25.0 x 35.3', inches: '9.8 x 13.9', use: 'Newspapers, catalogs' },
    { size: 'B5', mm: '176 x 250', cm: '17.6 x 25.0', inches: '6.9 x 9.8', use: 'Paperback books' },
    { size: 'B6', mm: '125 x 176', cm: '12.5 x 17.6', inches: '4.9 x 6.8', use: 'Paperback books' },
    { size: 'B7', mm: '88 x 125', cm: '8.8 x 12.5', inches: '3.5 x 4.9', use: 'Passports' },
    { size: 'B8', mm: '62 x 88', cm: '6.2 x 8.8', inches: '2.4 x 3.5', use: 'Visiting cards' },
    { size: 'B9', mm: '44 x 62', cm: '4.4 x 6.2', inches: '1.7 x 2.4', use: 'Labels' },
    { size: 'B10', mm: '31 x 44', cm: '3.1 x 4.4', inches: '1.2 x 1.7', use: 'Tickets' },
  ]

  const cSeries = [
    { size: 'C0', mm: '917 x 1297', cm: '91.7 × 129.7', inches: '36.1 × 51.1', use: 'Large envelopes' },
    { size: 'C1', mm: '648 x 917', cm: '64.8 × 91.7', inches: '25.5 × 36.1', use: 'Posters in envelopes' },
    { size: 'C2', mm: '458 x 648', cm: '45.8 × 64.8', inches: '18 × 25.5', use: 'Envelopes' },
    { size: 'C3', mm: '324 x 458', cm: '32.4 × 45.8', inches: '12.8 × 18', use: 'Envelopes' },
    { size: 'C4', mm: '229 x 324', cm: '22.9 × 32.4', inches: '9 × 12.8', use: 'A4 documents' },
    { size: 'C5', mm: '162 x 229', cm: '16.2 × 22.9', inches: '6.4 × 9', use: 'A5 documents' },
    { size: 'C6', mm: '114 x 162', cm: '11.4 × 16.2', inches: '4.5 × 6.4', use: 'Postcards' },
    { size: 'C7', mm: '81 x 114', cm: '8.1 × 11.4', inches: '3.2 × 4.5', use: 'DL envelopes' },
    { size: 'C8', mm: '57 x 81', cm: '5.7 × 8.1', inches: '2.2 × 3.2', use: 'Invitation cards' },
    { size: 'C9', mm: '40 x 57', cm: '4.0 × 5.7', inches: '1.6 × 2.2', use: 'Wallet cards' },
    { size: 'C10', mm: '28 x 40', cm: '2.8 × 4.0', inches: '1.1 × 1.6', use: 'Mini invitations' },
  ]

  const getSeriesData = (series: 'A' | 'B' | 'C') => {
    switch (series) {
      case 'A': return aSeries
      case 'B': return bSeries
      case 'C': return cSeries
      default: return []
    }
  }

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden bg-white">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 bg-gradient-to-r from-blue-50 to-purple-50 hover:from-blue-100 hover:to-purple-100 transition-colors flex items-center justify-between text-left"
      >
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-blue-500 to-purple-600 w-10 h-10 rounded-lg flex items-center justify-center">
            <Ruler className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              Paper Size Guide
              <Info className="w-4 h-4 text-gray-500" />
            </h3>
            <p className="text-sm text-gray-600">ISO 216 standard sizes (A, B, C series)</p>
          </div>
        </div>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-gray-600" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-600" />
        )}
      </button>

      {isOpen && (
        <div className="p-4 space-y-4">
          {/* Series Selection */}
          <div className="grid grid-cols-3 gap-2 mb-4">
            {(['A', 'B', 'C'] as const).map((series) => (
              <button
                key={series}
                onClick={() => setSelectedSeries(selectedSeries === series ? null : series)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  selectedSeries === series
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {series} Series
              </button>
            ))}
          </div>

          {/* Information Note */}
          {!selectedSeries && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <BookOpen className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-blue-800">
                  <p className="font-semibold mb-1">International Standard (ISO 216)</p>
                  <p className="mb-2">
                    The A series is the most commonly used for general printing. Each number represents half the size of the previous one (A1 is half of A0, A2 is half of A1, etc.)
                  </p>
                  <p>
                    <strong>A series:</strong> General printing and documents<br />
                    <strong>B series:</strong> Printing press sizes and larger formats<br />
                    <strong>C series:</strong> Envelopes designed to contain A/B series
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Size Tables */}
          {selectedSeries && (
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-3 mb-4">
                <h4 className="font-semibold text-gray-900 mb-2">
                  {selectedSeries} Series Sizes
                </h4>
                <p className="text-sm text-gray-700">
                  {selectedSeries === 'A' && 'Most common for documents, letters, and everyday printing'}
                  {selectedSeries === 'B' && 'Used for larger formats, calendars, and publishing'}
                  {selectedSeries === 'C' && 'Designed for envelopes to perfectly fit A series documents'}
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-4 py-3 font-semibold text-gray-700 border-b border-gray-200">Size</th>
                      <th className="px-4 py-3 font-semibold text-gray-700 border-b border-gray-200">Dimensions (mm)</th>
                      <th className="px-4 py-3 font-semibold text-gray-700 border-b border-gray-200">Dimensions (inches)</th>
                      <th className="px-4 py-3 font-semibold text-gray-700 border-b border-gray-200">Common Uses</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {getSeriesData(selectedSeries).map((item, index) => (
                      <tr key={item.size} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="px-4 py-3 font-semibold text-blue-600 border-b border-gray-200">
                          {item.size}
                        </td>
                        <td className="px-4 py-3 text-gray-700 border-b border-gray-200">
                          {item.mm} mm
                        </td>
                        <td className="px-4 py-3 text-gray-700 border-b border-gray-200">
                          {item.inches} in
                        </td>
                        <td className="px-4 py-3 text-gray-600 border-b border-gray-200">
                          {item.use}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-3">
                <p className="text-sm text-green-800">
                  <strong>💡 Pro Tip:</strong> When designing for print, add a{' '}
                  <strong>3mm bleed margin</strong> around your artwork to avoid cutting into important elements.
                </p>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="pt-4 border-t border-gray-200 text-center">
            <p className="text-xs text-gray-500">
              Reference: ISO 216 International Standard |{' '}
              <a 
                href="https://www.adobe.com/uk/creativecloud/design/discover/guide-paper-sizes.html" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-700 underline"
              >
                Learn more from Adobe
              </a>
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

