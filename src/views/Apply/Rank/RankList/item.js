export function itemMapper(i, levelDescFunc) {
  const dir = Math.sign(i.rank - i.lastRank) + 1
  return Object.assign(i, {
    title: i.realName,
    direction: ['down', 'balance', 'up'][dir],
    levelDesc: levelDescFunc(i.level)
  })
}
