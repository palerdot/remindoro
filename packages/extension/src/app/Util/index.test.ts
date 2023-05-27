import { getRemindoroUrl } from './'

describe('Remindoro url is constructed correctly', () => {
  const id = 'porumai'
  test('Url construction is fine', () => {
    expect(getRemindoroUrl(id)).toEqual(`/remindoro-info/${id}`)
  })
})
