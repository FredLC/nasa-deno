import { assertEquals } from 'https://deno.land/std@0.57.0/testing/asserts.ts';

import { filterHabitablePlanets } from './planets.ts';

const HABITABLE_PLANET = {
  koi_disposition: 'CONFIRMED',
  koi_prad: '1',
  koi_srad: '1',
  koi_smass: '1',
};

const NOT_CONFIRMED = {
  koi_disposition: 'FALSE POSITIVE',
};

const TOO_LARGE_PLANETARY_RADIUS = {
  koi_disposition: 'CONFIRMED',
  koi_prad: '1.5',
  koi_srad: '1',
  koi_smass: '1',
};

const TOO_LARGE_SOLAR_RADIUS = {
  koi_disposition: 'CONFIRMED',
  koi_prad: '1',
  koi_srad: '1.01',
  koi_smass: '1',
};

const TOO_LARGE_SOLAR_MASS = {
  koi_disposition: 'CONFIRMED',
  koi_prad: '1',
  koi_srad: '1',
  koi_smass: '1.04',
};

Deno.test('short example test', () => {
  const filtered = filterHabitablePlanets([
    HABITABLE_PLANET,
    TOO_LARGE_PLANETARY_RADIUS,
    TOO_LARGE_SOLAR_RADIUS,
    TOO_LARGE_SOLAR_MASS,
    NOT_CONFIRMED,
  ]);
  assertEquals(filtered, [HABITABLE_PLANET]);
});
