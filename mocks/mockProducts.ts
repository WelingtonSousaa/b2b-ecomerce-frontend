export const mockProducts = [
  {
    id: "1",
    sku: "NTB-DELL-LAT7420",
    nome: "Notebook Dell Latitude 7420 14\" Intel Core i7 16GB RAM 512GB SSD",
    imagem: "/dellNotenook.jpg",
    categoria: "Notebooks",
    moq: 5,
    multiploVenda: 5, // caixa fechada
    precos: {
      padrao: 7500.00,
      descontoVolume: [
        { quantidade: 10, preco: 7200.00 },
        { quantidade: 20, preco: 6900.00 }
      ]
    },
    taxas: {
      ipi: 5,
      icmsSt: 12
    }
  },
  {
    id: "2",
    sku: "MON-DELL-P2422H",
    nome: "Monitor Dell 24\" P2422H IPS Full HD",
    imagem: "/monitorDell.jpg",
    categoria: "Monitores",
    moq: 10,
    multiploVenda: 2,
    precos: {
      padrao: 1200.00,
      descontoVolume: [
        { quantidade: 20, preco: 1100.00 },
        { quantidade: 50, preco: 1000.00 }
      ]
    },
    taxas: {
      ipi: 2,
      icmsSt: 10
    }
  },
  {
    id: "3",
    sku: "SRV-HP-DL380",
    nome: "Servidor HP ProLiant DL380 Gen10",
    imagem: "/servidor.jpg",
    categoria: "Servidores",
    moq: 1,
    multiploVenda: 1,
    precos: {
      padrao: 25000.00,
      descontoVolume: [
        { quantidade: 3, preco: 24000.00 }
      ]
    },
    taxas: {
      ipi: 8,
      icmsSt: 15
    }
  },
  {
    id: "4",
    sku: "NET-CISCO-C9200",
    nome: "Switch Cisco Catalyst 9200 48-port PoE+",
    imagem: "/switch.webp",
    categoria: "Redes",
    moq: 2,
    multiploVenda: 1,
    precos: {
      padrao: 15000.00,
      descontoVolume: [
        { quantidade: 5, preco: 14200.00 }
      ]
    },
    taxas: {
      ipi: 5,
      icmsSt: 12
    }
  },
  {
    id: "5",
    sku: "ACC-LOGI-MXKEYS",
    nome: "Teclado Logitech MX Keys Business",
    imagem: "/teclado.png",
    categoria: "Acessórios",
    moq: 20,
    multiploVenda: 10,
    precos: {
      padrao: 650.00,
      descontoVolume: [
        { quantidade: 50, preco: 600.00 },
        { quantidade: 100, preco: 550.00 }
      ]
    },
    taxas: {
      ipi: 0,
      icmsSt: 8
    }
  },
  {
    id: "6",
    sku: "ACC-LOGI-MXMASTER3",
    nome: "Mouse Logitech MX Master 3S",
    imagem: "/mouse.webp",
    categoria: "Acessórios",
    moq: 15,
    multiploVenda: 5,
    precos: {
      padrao: 550.00,
      descontoVolume: [
        { quantidade: 30, preco: 500.00 }
      ]
    },
    taxas: {
      ipi: 0,
      icmsSt: 8
    }
  },
  {
    id: "7",
    sku: "MON-LG-29WL500",
    nome: "Monitor LG Ultrawide 29\" IPS Full HD",
    imagem: "/lgmonitor.webp",
    categoria: "Monitores",
    moq: 5,
    multiploVenda: 1,
    precos: {
      padrao: 1400.00,
      descontoVolume: [
        { quantidade: 15, preco: 1250.00 }
      ]
    },
    taxas: {
      ipi: 2,
      icmsSt: 10
    }
  },
  {
    id: "8",
    sku: "NET-UBIQ-U6PRO",
    nome: "Access Point Ubiquiti UniFi 6 Pro",
    imagem: "/acesspoint.webp",
    categoria: "Redes",
    moq: 5,
    multiploVenda: 5,
    precos: {
      padrao: 1800.00,
      descontoVolume: [
        { quantidade: 20, preco: 1650.00 }
      ]
    },
    taxas: {
      ipi: 4,
      icmsSt: 12
    }
  }
];
