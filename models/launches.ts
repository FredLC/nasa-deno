import { log, _ } from '../deps.ts';

interface Launch {
  flightNumber: number;
  mission: string;
  rocket: string;
  customers: Array<string>;
  launchDate: number;
  upcoming: boolean;
  success?: boolean;
  target?: string;
}

const launches = new Map<Number, Launch>();

export async function downloadLaunchData() {
  log.info('Downloading spaceX launch data...');
  const response = await fetch('https://api.spacexdata.com/v3/launches', {
    method: 'GET',
  });

  if (!response.ok) {
    log.warning('There was a problem retrieving data from the server.');
    throw new Error('Failed to download launch data');
  }

  const launchData = await response.json();
  for (const launch of launchData) {
    const payloads = launch['rocket']['second_stage']['payloads'];
    const customers = _.flatMap(payloads, (payload: any) => {
      return payload['customers'];
    });

    const flightData = {
      flightNumber: launch['flight_number'],
      mission: launch['mission_name'],
      rocket: launch['rocket']['rocket_name'],
      customers: customers,
      launchDate: launch['launch_date_unix'],
      upcoming: launch['upcoming'],
      success: launch['launch_success'],
    };

    launches.set(flightData.flightNumber, flightData);

    log.info(JSON.stringify(flightData));
  }
}

await downloadLaunchData();
log.info(`Downloaded data for ${launches.size} SpaceX launches.`);

export function getAll() {
  return Array.from(launches.values());
}

export function getOne(id: number) {
  if (launches.has(id)) {
    return launches.get(id);
  }
  return null;
}

export function removeOne(id: number) {
  const aborted = launches.get(id);
  if (aborted) {
    aborted.upcoming = false;
    aborted.success = false;
  }
  return aborted;
}

export function addOne(data: Launch) {
  launches.set(
    data.flightNumber,
    Object.assign(data, {
      upcoming: true,
      customers: ['NASA'],
    })
  );
}

// async function postData() {
//   await fetch('https://reqres.in/api/users', {
//     method: 'POST',
//     body: JSON.stringify({
//       name: 'Elon Musk',
//       job: 'billionaire',
//     }),
//     headers: {
//       'Content-Type': 'application/json; charset=UTF-8',
//     },
//   })
//     .then((response) => response.json())
//     .then((data) => console.log(data));
// }

// postData();
