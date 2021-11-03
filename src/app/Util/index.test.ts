import { getRemindoroUrl } from './'

describe('Remindoro url is constructed correctly', () => {
  const id = 'porumai'
  expect(getRemindoroUrl(id)).toEqual(`/remindoro-info/${id}`)
})
