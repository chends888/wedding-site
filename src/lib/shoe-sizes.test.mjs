import assert from 'node:assert/strict'
import { test } from 'node:test'
import {
  CHILDREN_SIZE_TABLE,
  SIZE_LABELS,
  SIZE_TABLE,
  brShoeSizeLabel,
  compareShoeSizeCounts,
  shoeSizeBuckets,
  summarizeShoeSizes,
} from './shoe-sizes.ts'

test('EU33 is shown as Brazilian size BR 33', () => {
  assert.equal(SIZE_LABELS.EU33, 'BR 33')
  assert.equal(brShoeSizeLabel('EU33'), 'BR 33')
  assert.notEqual(brShoeSizeLabel('EU33'), 'EU33')
})

test('the RSVP form offers EU33 as Brazilian 33/34, not an EU label', () => {
  const kids = CHILDREN_SIZE_TABLE.find((size) => size.value === 'EU33')
  assert.ok(kids)
  assert.equal(kids.BR, '33/34')
  assert.doesNotMatch(kids.BR, /EU/)
})

test('every RSVP size code displays as a BR size', () => {
  const codes = [...SIZE_TABLE, ...CHILDREN_SIZE_TABLE].map((size) => size.value)
  assert.ok(codes.includes('EU33'))
  for (const code of codes) {
    const label = brShoeSizeLabel(code)
    assert.match(label, /^BR /)
    assert.doesNotMatch(label, /^(EU|US|CN|AU)/)
  }
})

test('existing admin labels stay the same', () => {
  assert.equal(brShoeSizeLabel('EU17'), 'BR 17')
  assert.equal(brShoeSizeLabel('EU32'), 'BR 32')
  assert.equal(brShoeSizeLabel('BR33'), 'BR 33')
  assert.equal(brShoeSizeLabel('BR45'), 'BR 45')
})

test('unmapped region codes are still forced to BR', () => {
  assert.equal(brShoeSizeLabel('EU34'), 'BR 34')
  assert.equal(brShoeSizeLabel('US10'), 'BR 10')
})

test('values that are not region size codes are left unchanged', () => {
  assert.equal(brShoeSizeLabel('custom'), 'custom')
})

test('kids size codes, including EU33, count only as child shoes', () => {
  for (const size of CHILDREN_SIZE_TABLE) {
    assert.deepEqual(shoeSizeBuckets(size.value), ['child'])
  }
  assert.deepEqual(shoeSizeBuckets('EU18'), ['child'])
  assert.deepEqual(shoeSizeBuckets('EU32'), ['child'])
  assert.deepEqual(shoeSizeBuckets('EU33'), ['child'])
})

test('adult sizes split from the US W and M markers on the size chart', () => {
  assert.deepEqual(shoeSizeBuckets('BR33'), ['female'])
  assert.deepEqual(shoeSizeBuckets('BR35'), ['female', 'male'])
  assert.deepEqual(shoeSizeBuckets('BR37'), ['female', 'male'])
  assert.deepEqual(shoeSizeBuckets('BR39'), ['female', 'male'])
  assert.deepEqual(shoeSizeBuckets('BR41'), ['female', 'male'])
  assert.deepEqual(shoeSizeBuckets('BR43'), ['male'])
  assert.deepEqual(shoeSizeBuckets('BR45'), ['male'])
})

test('legacy BR integers follow the adult chart range they belong to', () => {
  assert.deepEqual(shoeSizeBuckets('BR34'), ['female'])
  assert.deepEqual(shoeSizeBuckets('BR36'), ['female', 'male'])
  assert.deepEqual(shoeSizeBuckets('BR44'), ['male'])
  assert.deepEqual(shoeSizeBuckets('BR46'), ['male'])
  assert.deepEqual(shoeSizeBuckets('custom'), [])
})

test('EU33 and BR33 stay separate rows with different buckets', () => {
  const rows = summarizeShoeSizes(['EU33', 'EU33', 'BR33', 'BR37', 'BR43'])
  const byCode = Object.fromEntries(rows.map((row) => [row.code, row]))

  assert.equal(brShoeSizeLabel('EU33'), 'BR 33')
  assert.equal(brShoeSizeLabel('BR33'), 'BR 33')
  assert.deepEqual(byCode.EU33, { code: 'EU33', child: 2, female: 0, male: 0, total: 2 })
  assert.deepEqual(byCode.BR33, { code: 'BR33', child: 0, female: 1, male: 0, total: 1 })
  assert.deepEqual(byCode.BR37, { code: 'BR37', child: 0, female: 1, male: 1, total: 1 })
  assert.deepEqual(byCode.BR43, { code: 'BR43', child: 0, female: 0, male: 1, total: 1 })
  assert.deepEqual(rows.map((row) => row.code), ['BR33', 'EU33', 'BR37', 'BR43'])
})

test('size summary columns sort like the other admin columns', () => {
  const rows = summarizeShoeSizes(['EU17', 'BR33', 'BR37', 'BR37', 'BR43'])

  const byMaleDesc = [...rows].sort((a, b) => compareShoeSizeCounts(a, b, 'male', 'desc'))
  assert.deepEqual(byMaleDesc.map((row) => row.code), ['BR37', 'BR43', 'EU17', 'BR33'])

  const byFemaleAsc = [...rows].sort((a, b) => compareShoeSizeCounts(a, b, 'female', 'asc'))
  assert.deepEqual(byFemaleAsc.map((row) => row.code), ['EU17', 'BR43', 'BR33', 'BR37'])

  const byTotalDesc = [...rows].sort((a, b) => compareShoeSizeCounts(a, b, 'total', 'desc'))
  assert.deepEqual(byTotalDesc.map((row) => row.code), ['BR37', 'EU17', 'BR33', 'BR43'])

  const byChildDesc = [...rows].sort((a, b) => compareShoeSizeCounts(a, b, 'child', 'desc'))
  assert.equal(byChildDesc[0].code, 'EU17')

  const bySizeDesc = [...rows].sort((a, b) => compareShoeSizeCounts(a, b, 'size', 'desc'))
  assert.deepEqual(bySizeDesc.map((row) => brShoeSizeLabel(row.code)), ['BR 43', 'BR 37', 'BR 33', 'BR 17'])
})
