import fs from 'node:fs/promises';
const path = 'src/json/dbClients.json'


export async function list(filter, type) {
  const dataPrevius = JSON.parse(await fs.readFile(path, 'utf-8'));
  return dataPrevius.map((data) => {
    return {...data };
  }).filter((data) => {
    return filter ? data[type].includes(filter) : true;
  });
}

export async function listSup() {
  const dataPrevius = JSON.parse(await fs.readFile(path, 'utf-8'));
  return dataPrevius
    .filter((data) => data.suport)
    .map((data) => data._serialized);
}

export async function save(data) {
  const dataPrevius = JSON.parse(await fs.readFile(path, 'utf-8'));
  dataPrevius.push(data)
  await fs.writeFile(path, JSON.stringify(dataPrevius));
}

export async function update(id, updatedData) {
  const dataPrevius = JSON.parse(await fs.readFile(path, 'utf-8'));
  const updatedClients = dataPrevius.map((client) => {
    if (client._serialized === id) {
      return { ...client, ...updatedData };
    } else {
      return client;
    }
  });

  await fs.writeFile(path, JSON.stringify(updatedClients));
}