
export const addCommSep = (value: any) => {
    return (
      Number(value)
        // .toString()
        .toFixed(2)
        .replace('.00', '')
        .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    );
  };