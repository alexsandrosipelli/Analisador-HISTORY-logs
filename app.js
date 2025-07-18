// Variáveis globais
let data = [];
const sectorSelect = document.getElementById('sector');
const dataTableBody = document.querySelector('#data-table tbody');

// Função para ler o arquivo CSV ou XLSX
function handleFileUpload(event) {
  const file = event.target.files[0];
  
  if (!file) return;

  const reader = new FileReader();
  
  reader.onload = function(e) {
    const fileData = e.target.result;
    const fileExtension = file.name.split('.').pop().toLowerCase();

    if (fileExtension === 'csv') {
      processCSV(fileData);
    } else if (fileExtension === 'xlsx') {
      processXLSX(fileData);
    } else {
      alert('Por favor, envie um arquivo CSV ou XLSX.');
    }
  };

  reader.readAsBinaryString(file);
}

// Processar CSV
function processCSV(fileData) {
  const rows = fileData.split('\n').map(row => row.split(','));
  const headers = rows[0];
  
  data = rows.slice(1).map(row => {
    let obj = {};
    row.forEach((cell, index) => {
      obj[headers[index]] = cell.trim();
    });
    return obj;
  });

  fillSectorOptions();
  fillTable(data);
}

// Processar XLSX
function processXLSX(fileData) {
  const workbook = XLSX.read(fileData, { type: 'binary' });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const jsonData = XLSX.utils.sheet_to_json(sheet);

  data = jsonData.map(row => ({
    "data": row["Data"],
    "setor": row["Setor"],
    "toner": row["Toner (%)"],
    "magenta": row["Magenta (%)"],
    "yellow": row["Yellow (%)"],
    "cyan": row["Cyan (%)"],
    "fotocondutor": row["Fotocondutor"],
    "fusor": row["Fusor"],
    "mono_lifetime_count": row["Mono Lifetime Count"],
    "color_lifetime_count": row["Color Lifetime Count"],
    "diferencia_diaria": row["Diferencia diária"]
  }));

  fillSectorOptions();
  fillTable(data);
}

// Preencher as opções de setor no filtro
function fillSectorOptions() {
  const sectors = [...new Set(data.map(item => item.setor))]; // Remove setores duplicados
  sectorSelect.innerHTML = '<option value="">Selecione...</option>'; // Limpar as opções existentes
  sectors.forEach(sector => {
    const option = document.createElement('option');
    option.value = sector;
    option.textContent = sector;
    sectorSelect.appendChild(option);
  });
}

// Preencher a tabela com os dados
function fillTable(filteredData) {
  dataTableBody.innerHTML = ''; // Limpa a tabela antes de adicionar os dados

  filteredData.forEach(row => {
    const tr = document.createElement('tr');
    
    Object.values(row).forEach(cell => {
      const td = document.createElement('td');
      td.textContent = cell || '-';
      tr.appendChild(td);
    });

    dataTableBody.appendChild(tr);
  });
}

// Filtrar os dados pelo setor
function filterDataBySector() {
  const selectedSector = sectorSelect.value;
  const filteredData = selectedSector
    ? data.filter(item => item.setor === selectedSector)
    : data; // Se não selecionar nenhum setor, mostra todos os dados

  fillTable(filteredData);
}

// Adicionando o evento de upload do arquivo
document.getElementById('file-input').addEventListener('change', handleFileUpload);

// Adicionando o evento de filtro de setor
sectorSelect.addEventListener('change', filterDataBySector);
