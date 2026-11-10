import assert from 'node:assert/strict'
import { test } from 'node:test'
import { CHILDREN_SIZE_TABLE, SIZE_LABELS, SIZE_TABLE, brShoeSizeLabel } from './shoe-sizes.ts'

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
