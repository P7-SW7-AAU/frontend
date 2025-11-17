export function useTeamValueFormat(team: { roster: { price: number; weekPriceChange: number }[] }) {
  const totalValue = () => {
    const value = team.roster.map(p => p.price).reduce((a, b) => a + b, 0) / 1_000_000;
    let formatted = value.toFixed(6).replace(/\.?0+$/, '').replace(/(\.[0-9]*[1-9])0+$/, '$1');
    if (formatted.includes('.')) {
      const [intPart, decPart] = formatted.split('.');
      formatted = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + '.' + decPart;
    } else {
      formatted = formatted.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }
    return `$${formatted}M`;
  }

  const weeklyChange = () => {
    const totalChange = team.roster.map(p => p.weekPriceChange).reduce((a, b) => a + b, 0);
    const color =
      totalChange > 0 ? "text-primary-green" :
      totalChange < 0 ? "text-primary-red" :
      "text-primary-gray";
    if (totalChange === 0) return { formatted: "—", color };
    const value = totalChange / 1_000;
    let formatted = value.toFixed(3).replace(/\.?0+$/, '').replace(/(\.[0-9]*[1-9])0+$/, '$1');
    if (formatted.includes('.')) {
      const [intPart, decPart] = formatted.split('.');
      formatted = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + '.' + decPart;
    } else {
      formatted = formatted.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }
    return { formatted: `${totalChange > 0 ? '+' : ''}$${formatted}K`, color };
  }


  const combinedValue = () => {
    if (!team || !team.roster || team.roster.length === 0) return "$0M";
    const total = team.roster
      .map(p => p.price)
      .reduce((a, b) => a + b, 0);
    const change = team.roster
      .map(p => p.weekPriceChange)
      .reduce((a, b) => a + b, 0);
    const combined = (total + change) / 1_000_000;
    let formatted = combined
      .toFixed(6)
      .replace(/\.?0+$/, '')
      .replace(/(\.[0-9]*[1-9])0+$/, '$1');
    if (formatted.includes('.')) {
      const [intPart, decPart] = formatted.split('.');
      formatted =
        intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',') +
        '.' +
        decPart;
    } else {
      formatted = formatted.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }
    return `$${formatted}M`;
  }

  return { totalValue, weeklyChange, combinedValue }
}
