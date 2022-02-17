const gravilib = {

    zoom: [
        {
            id: 1,
            anz: '1',
            einheit: 'm',
            text: 'Meter',
            meter: 1
          },
          {
            id: 2,
            anz: '10',
            einheit: 'm',
            text: 'Meter',
            meter: 10
          },
          {
            id: 3,
            anz: '100',
            einheit: 'm',
            text: 'Meter',
            meter: 100
          },
          {
            id: 4,
            anz: '1',
            einheit: 'km',
            text: 'Kilometer',
            meter: 1000
          },
          {
            id: 5,
            anz: '10',
            einheit: 'km',
            text: 'Kilometer',
            meter: 10000
          },
          {
            id: 6,
            anz: '100',
            einheit: 'km',
            text: 'Kilometer',
            meter: 100000
          },
          {
            id: 7,
            anz: '1 tsd',
            einheit: 'km',
            text: 'Kilometer',
            meter: 1000000
          },
          {
            id: 8,
            anz: '10 tsd',
            einheit: 'km',
            text: 'Kilometer',
            meter: 10000000
          },
          {
            id: 9,
            anz: '100 tsd',
            einheit: 'km',
            text: 'Kilometer',
            meter: 100000000
          },
          {
            id: 10,
            anz: '1 mio',
            einheit: 'km',
            text: 'Kilometer',
            meter: 1000000000
          },
          {
            id: 11,
            anz: '10 mio',
            einheit: 'km',
            text: 'Kilometer',
            meter: 10000000000
          },
          {
            id: 12,
            anz: '100 mio',
            einheit: 'km',
            text: 'Kilometer',
            meter: 100000000000
          },
          {
            id: 13,
            anz: '1',
            einheit: 'AU',
            text: 'AU',
            meter: 149597870700
          },
          {
            id: 14,
            anz: '10',
            einheit: 'AU',
            text: 'AU',
            meter: 1495978707000
          },
          {
            id: 15,
            anz: '100',
            einheit: 'AU',
            text: 'AU',
            meter: 14959787070000
          }
    ],

    material: [
      {
        id: 1,
        name: 'Wasserstoff',
        dens: 76.3,
        emodul: 0
      },
      {
        id: 2,
        name: 'Helium',
        dens: 176,
        emodul: 0
      },
      {
        id: 3,
        name: 'Lithium',
        dens: 535,
        emodul: 0
      },
      {
        id: 4,
        name: 'Sauerstoff',
        dens: 1426,
        emodul: 0
      },
      {
        id: 5,
        name: 'Magnesium',
        dens: 1738,
        emodul: 0
      },
      {
        id: 6,
        name: 'Kohlenstoff',
        dens: 2267,
        emodul: 0
      },
      {
        id: 7,
        name: 'Silicium',
        dens: 2330,
        emodul: 0
      },
      {
        id: 8,
        name: 'Aluminium',
        dens: 2700,
        emodul: 0
      },
      {
        id: 9,
        name: 'Titan',
        dens: 4507,
        emodul: 0
      },
      {
        id: 10,
        name: 'Zinn',
        dens: 5750,
        emodul: 0
      },
      {
        id: 11,
        name: 'Zink',
        dens: 7140,
        emodul: 0
      },
      {
        id: 12,
        name: 'Eisen',
        dens: 7874,
        emodul: 0
      },
      {
        id: 13,
        name: 'Silber',
        dens: 10490,
        emodul: 0
      },
      {
        id: 14,
        name: 'Blei',
        dens: 11342,
        emodul: 0
      },
      {
        id: 15,
        name: 'Quecksilber',
        dens: 14260,
        emodul: 0
      },
      {
        id: 16,
        name: 'Uran',
        dens: 15920,
        emodul: 0
      },
      {
        id: 17,
        name: 'Gold',
        dens: 19320,
        emodul: 0
      },
      {
        id: 18,
        name: 'Rhenium',
        dens: 21020,
        emodul: 0
      },
      {
        id: 19,
        name: 'Platin',
        dens: 21450,
        emodul: 0
      },
      {
        id: 20,
        name: 'Neutronensernkruste',
        dens: 10e+4,
        emodul: 0
      },
      {
        id: 21,
        name: 'Weisser Zwerg',
        dens: 20e+6,
        emodul: 0
      },
      {
        id: 22,
        name: 'Kernmaterial',
        dens: 30e+14,
        emodul: 0
      },
      {
        id: 23,
        name: 'Q-G-Plasma',
        dens: 10e+15,
        emodul: 0
      }
    ],

    colorByDensObj(densObj){
      if(densObj.name == 'Gold'){
        return 'hsl(46,87%,38%)'
      }else if(densObj.name == 'Sauerstoff'){
        return 'hsl(207,58%,74%)'
      }else{
        let minDens = Math.min(...this.material.map(el => el.dens));
        let vDens = (Math.max(...this.material.map(el => Math.min(el.dens, 21450)))/minDens)/100;
        let pDens = densObj.dens/(minDens*vDens);  
        return `hsl(0,0%,${100 - 0.9 * pDens}%)`; 
      } 
    },

    restitutionByDens(dens, factor){
      let maxDens = Math.max(...this.material.map(el => Math.min(el.dens, 21450)));
      let minDens = Math.min(...this.material.map(el => el.dens));
      if(dens < minDens) return 0
      else if(dens > maxDens) return 1
      else return ((dens - minDens)/(maxDens - minDens)/factor) + (1 - 1/factor)
    },

    bodies: [
      {
        id: 1,
        name: 'Erde',
        rad: 6350000,
        dens: 5514,
        color: '#347aeb',
        ratio: 8
      },
      {
        id: 2,
        name: 'Sonne',
        rad: 700000000,
        dens: 1408,
        color: '#ebde34',
        ratio: 10
      },
      {
        id: 3,
        name: 'Mond',
        rad: 1738000,
        dens: 3344,
        color: '#a1a1a1',
        ratio: 8
      },
      {
        id: 4,
        name: 'Mars',
        rad: 3400000,
        dens: 3933,
        color: '#d93e23',
        ratio: 8
      },
      {
        id: 5,
        name: 'Jupiter',
        rad: 71000000,
        dens: 1326,
        color: '#a1730a',
        ratio: 9
      }
    ]

}

export {gravilib};