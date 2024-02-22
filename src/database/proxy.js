import fs from 'node:fs/promises';
const path = 'src/json/dbClients.json'

export async function SaveClients(data) {
  const dataPrevius = JSON.parse(await fs.readFile(path, 'utf-8'));
  dataPrevius.push(data)
  await fs.writeFile(path, JSON.stringify(dataPrevius));
}

export async function ListClients(filter) {
  const dataPrevius = JSON.parse(await fs.readFile(path, 'utf-8'));
  return dataPrevius.filter(data => {
    return filter ? data.number.includes(filter) :  true
})
}

// await SaveClients({
//   id:'0101',
//   number:'0102',
//   pushname:'0101'
// })

// const data = await ListClients('0102')

// console.log(data.length)