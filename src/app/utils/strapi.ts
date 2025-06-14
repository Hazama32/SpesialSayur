export async function fetchProduk() {
    const res = await fetch('https://spesialsayurdb-production.up.railway.app/api/produks?populate=*', {
    cache: 'no-store',
});
    const data = await res.json();
    return data.data;
}

export async function fetchKategori() {
    const res = await fetch('https://spesialsayurdb-production.up.railway.app/api/kategoris?populate=*', {
    cache: 'no-store',
});
    const data = await res.json();
    return data.data;
}