export type SizeSystem = 'BR' | 'EU' | 'US' | 'CN' | 'AU' | 'cm'

export type ShoeSizeOption = {
  value: string
  BR: string
  EU: string
  US: string
  CN: string
  AU: string
  cm: string
}

export const SIZE_TABLE: ShoeSizeOption[] = [
  { value: 'BR33', BR: '33/34', EU: '35/36', US: '5W', CN: '33', AU: '3', cm: '21.5-22.5cm' },
  { value: 'BR35', BR: '35/36', EU: '37/38', US: '6W / 5M', CN: '35', AU: '4/5', cm: '23-24cm' },
  { value: 'BR37', BR: '37/38', EU: '39/40', US: '7-8W / 6-7M', CN: '37', AU: '5.5/6', cm: '24-25cm' },
  { value: 'BR39', BR: '39/40', EU: '41/42', US: '9-10W / 8M', CN: '39', AU: '7/7.5', cm: '25.5-26.5cm' },
  { value: 'BR41', BR: '41/42', EU: '43/44', US: '11-12W / 9-10M', CN: '41', AU: '8/9', cm: '27-28cm' },
  { value: 'BR43', BR: '43/44', EU: '45/46', US: '11-12M', CN: '43', AU: '10/11', cm: '28-29cm' },
  { value: 'BR45', BR: '45/46', EU: '47/48', US: '13M', CN: '45', AU: '12', cm: '29-30cm' },
]

export const CHILDREN_SIZE_TABLE: ShoeSizeOption[] = [
  { value: 'EU17', BR: '17/18', EU: '19/20', US: '4C', CN: '17', AU: '2', cm: '11.5-12.5cm' },
  { value: 'EU19', BR: '19', EU: '20', US: '5C', CN: '19', AU: '3', cm: '12-13cm' },
  { value: 'EU20', BR: '20', EU: '21', US: '6C', CN: '20', AU: '3.5', cm: '12.5-13.5cm' },
  { value: 'EU21', BR: '21', EU: '22', US: '7C', CN: '21', AU: '4', cm: '13.5-14.5cm' },
  { value: 'EU22', BR: '22', EU: '23', US: '8C', CN: '22', AU: '4.5', cm: '14-15cm' },
  { value: 'EU23', BR: '23/24', EU: '25/26', US: '9C', CN: '23', AU: '5/6', cm: '15-16cm' },
  { value: 'EU25', BR: '25/26', EU: '27/28', US: '10C', CN: '25', AU: '7', cm: '16-17cm' },
  { value: 'EU27', BR: '27/28', EU: '29/30', US: '11-12C', CN: '27', AU: '8', cm: '17.5-18.5cm' },
  { value: 'EU29', BR: '29/30', EU: '31/32', US: '13C-1Y', CN: '29', AU: '9', cm: '18.5-19.5cm' },
  { value: 'EU31', BR: '31/32', EU: '33/34', US: '2Y', CN: '31', AU: '10', cm: '20-21cm' },
  { value: 'EU33', BR: '33/34', EU: '35/36', US: '3-4Y', CN: '33', AU: '11', cm: '21.5-22.5cm' },
]

/**
 * Labels for the admin page, which orders Havaianas in Brazilian sizes.
 * Kids RSVPs are stored with an EU-prefixed code. Those codes are shown as the
 * matching BR size. EU33 is the top kids size (BR 33/34) and has to be listed
 * explicitly: the original map stopped at EU32, so admin fell through to "EU33".
 */
export const SIZE_LABELS: Record<string, string> = {
  'EU17': 'BR 17', 'EU18': 'BR 18', 'EU19': 'BR 19',
  'EU20': 'BR 20', 'EU21': 'BR 21', 'EU22': 'BR 22',
  'EU23': 'BR 23', 'EU24': 'BR 24', 'EU25': 'BR 25',
  'EU26': 'BR 26', 'EU27': 'BR 27', 'EU28': 'BR 28',
  'EU29': 'BR 29', 'EU30': 'BR 30', 'EU31': 'BR 31',
  'EU32': 'BR 32', 'EU33': 'BR 33',
  'BR33': 'BR 33', 'BR34': 'BR 34', 'BR35': 'BR 35',
  'BR36': 'BR 36', 'BR37': 'BR 37', 'BR38': 'BR 38',
  'BR39': 'BR 39', 'BR40': 'BR 40', 'BR41': 'BR 41',
  'BR42': 'BR 42', 'BR43': 'BR 43', 'BR44': 'BR 44',
  'BR45': 'BR 45',
}

const NON_BR_SIZE_CODE = /^(?:EU|US|CN|AU)(\d+)$/

export function brShoeSizeLabel(code: string): string {
  const mapped = SIZE_LABELS[code]
  if (mapped) return mapped
  const region = NON_BR_SIZE_CODE.exec(code)
  if (region) return `BR ${region[1]}`
  return code
}
