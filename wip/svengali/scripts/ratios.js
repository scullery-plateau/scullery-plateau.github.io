namespace('sp.svengali.Ratios', {
  'sp.svengali.Metrics': 'Metrics'
}, ({ Metrics }) => {
  return {
    METRICS: Metrics,
    getCharRatio: (font, char) => {
        return (Metrics[font]?.charRatios[char]) || 0.5;
    },
    getAvgRatio: (font) => {
        return (Metrics[font]?.avgRatio) || 1.7;
    }
  };
});

