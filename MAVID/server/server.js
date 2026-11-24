const http = require('http');
const fs = require('fs');
const path = require('path');

let produits = [
  { id: 1, nom: "Pack Marketing MAVID", prix: 50, vendeurId: 7 },
  { id: 2, nom: "Logo Luxe MAVID", prix: 30, vendeurId: 7 },
  { id: 3, nom: "Pub Video MAVID", prix: 100, vendeurId: 7 },
];
let soldes = { 7: 0 };
let nextId = 4;

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') { res.writeHead(200); res.end(); return; }

  if (req.url === '/' && req.method === 'GET') {
    try {
      let filePath = path.join(__dirname, '..', 'public', 'index.html');
      let html = fs.readFileSync(filePath, 'utf8');
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(html);
    } catch(e) {
      res.writeHead(500); res.end('Erreur: fichier public/index.html introuvable');
    }
    return;
  }

  if (req.url === '/api/products' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(produits));
    return;
  }

  if (req.url === '/api/solde/7' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ vendeurId: 7, solde: soldes[7] }));
    return;
  }

  if (req.url === '/api/commander' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      let data = JSON.parse(body || '{}');
      let produit = produits.find(p => p.id === data.produitId);
      if (!produit) { res.writeHead(404, { 'Content-Type': 'application/json' }); res.end(JSON.stringify({ message: 'Produit non trouve' })); return; }
      let commission = produit.prix * 0.10;
      let pourVendeur = produit.prix - commission;
      soldes[produit.vendeurId] = (soldes[produit.vendeurId] || 0) + pourVendeur;
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Commande MAVID reussie ! Vendeur recoit ' + pourVendeur + ' $, commission MAVID : ' + commission + ' $' }));
    });
    return;
  }

  if (req.url === '/api/products' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      let data = JSON.parse(body || '{}');
      let nouveau = { id: nextId++, nom: data.nom, prix: Number(data.prix), vendeurId: 7 };
      produits.push(nouveau);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Produit ajoute !', produit: nouveau }));
    });
    return;
  }

  res.writeHead(404); res.end('Page non trouvee');
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, '0.0.0.0', () => console.log('Serveur MAVID OK sur port ' + PORT));