import fs from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'
import type { Tool } from '@/lib/types'
import * as survey from '@/lib/survey'

const TOOLS_DIR = path.join(import.meta.dirname, '..', 'data', 'tools')

function loadTools(): Tool[] {
  return fs.readdirSync(TOOLS_DIR).map(file => ({
    ...JSON.parse(fs.readFileSync(path.join(TOOLS_DIR, file), 'utf8')),
    id: file.replace(/\.json$/, ''),
  }))
}

describe('themeOf', () => {
  it('gives every category in the data a mapped theme', () => {
    const unmapped = loadTools().filter(tool => !(tool.category in survey.CATEGORY_THEMES))
    expect(unmapped.map(tool => tool.category)).toEqual([])
  })

  it('maps known categories', () => {
    expect(survey.themeOf({ category: 'Weather' }).key).toBe('atm')
    expect(survey.themeOf({ category: 'Disasters' }).key).toBe('haz')
    expect(survey.themeOf({ category: 'Satellite Imagery' }).key).toBe('img')
  })

  it('falls back for an unknown category', () => {
    expect(survey.themeOf({ category: 'Something New' }).key).toBe('land')
  })
})

describe('segmentColors', () => {
  it('fills segments up to the score', () => {
    const colors = survey.segmentColors(4)
    expect(colors.slice(0, 4)).toEqual(survey.RAMP.slice(0, 4))
    expect(colors.slice(4)).toEqual([survey.RAMP_EMPTY, survey.RAMP_EMPTY])
  })
})

describe('levelLabel', () => {
  it.each([
    [6, 'Fully open'],
    [5, 'Mostly open'],
    [4, 'Mostly open'],
    [3, 'Partially open'],
    [2, 'Partially open'],
    [1, 'Minimally open'],
    [0, 'Minimally open'],
  ])('labels %i as %s', (score, label) => {
    expect(survey.levelLabel(score)).toBe(label)
  })
})

describe('answersFor', () => {
  it('reads stored dimensions as visitor questions and leaves the account question unanswered', () => {
    const [tool] = loadTools().filter(t => t.id === 'nasa-worldview')
    const answers = survey.answersFor(tool)

    expect(answers).toHaveLength(6)
    expect(answers[0].answer).toBeNull()
    expect(answers[3]).toEqual({
      question: 'Can I see or fork the code?',
      short: 'Code',
      answer: 'yes',
      note: tool.openness.dimensions['Software Licensing'].note,
    })
    expect(answers.slice(1).every(a => a.answer !== null)).toBe(true)
  })
})

describe('pinFor', () => {
  it('is stable for the same name', () => {
    expect(survey.pinFor('Windy')).toEqual(survey.pinFor('Windy'))
  })

  it('keeps the pin inside the tile', () => {
    for (const tool of loadTools()) {
      const pin = survey.pinFor(tool.name)
      expect(parseInt(pin.x)).toBeGreaterThanOrEqual(20)
      expect(parseInt(pin.x)).toBeLessThanOrEqual(85)
      expect(parseInt(pin.y)).toBeGreaterThanOrEqual(30)
      expect(parseInt(pin.y)).toBeLessThanOrEqual(80)
    }
  })
})

describe('scoreHistogram', () => {
  it('counts tools per score from 1 to 6', () => {
    const tools = [3, 3, 6, 1].map(score => ({ openness: { score } })) as Tool[]
    expect(survey.scoreHistogram(tools)).toEqual([1, 0, 2, 0, 0, 1])
  })
})
