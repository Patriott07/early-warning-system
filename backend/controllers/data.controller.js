import xlsx from 'xlsx';
import fs from 'fs/promises';
import path from 'path';
import { readFile } from 'fs';

// Buat folder untuk menyimpan file JSON jika belum ada
const JSON_DIR = path.join(process.cwd(), 'uploads', 'json');
await fs.mkdir(JSON_DIR, { recursive: true });

const KOMODITAS_LIST = [
  "Beras Medium",
  "Beras Premium",
  "Bawang Merah",
  "Kacang Kedelai Lokal",
  "Kacang Kedelai Impor",
  "Cabe Merah Besar",
  "Cabe Merah Keriting",
  "Cabe Rawit Merah",
  "Cabe Rawit Hijau",
  "Minyak Goreng Sawit",
  "Tepung Terigu",
  "Gula Pasir",
  "Daging Ayam ras",
  "Telur Ayam Ras",
  "Daging Sapi",
  "Ikan Bandeng"
];

const KOMODITAS_MAPPING = {
  "Beras Medium": "Beras Medium",
  "Beras Premium": "Beras Premium I",
  "Bawang Merah": "Bawang Merah",
  "Kacang Kedelai Lokal": "Kacang Kedelai Lokal",
  "Kacang Kedelai Impor": "Kacang Kedelai Impor",
  "Cabe Merah Besar": "Cabe Merah Biasa",
  "Cabe Merah Keriting": "Cabe Merah Keriting",
  "Cabe Rawit Merah": "Cabe Rawit Merah",
  "Cabe Rawit Hijau": "Cabe Rawit Hijau",
  "Minyak Goreng Sawit": "Minyak Goreng Tropical",
  "Tepung Terigu": "Tepung Terigu Segi Tiga Biru",
  "Gula Pasir": "Gula Pasir lokal",
  "Daging Ayam ras": "Daging Ayam Broiler",
  "Telur Ayam Ras": "Telur Ayam Broiler",
  "Daging Sapi": "Daging Sapi Murni",
  "Ikan Bandeng": "Ikan Bandeng"
};

export const fileupload = async (req, res) => {
  try {
    const { lokasi_pasar, tanggal_awal } = req.body;
    const startDay = parseInt(tanggal_awal);

    if (!req.files || !req.files.file) {
      return res.status(400).json({
        message: "Mohon sertakan file yang akan diunggah"
      });
    }

    const excelFile = req.files.file;
    const workbook = xlsx.read(excelFile.data, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    // Ambil semua data dari Excel tanpa filter
    const rawData = xlsx.utils.sheet_to_json(worksheet, {
      raw: true,
      defval: "0", // Set default value untuk cell kosong ke "0"
      blankrows: false,
      range: 3 // Mulai dari baris keempat (skip 3 baris pertama)
    });

    // Ambil metadata
    let metadata = {
      bulan: "Tidak diketahui",
      tahun: new Date().getFullYear(),
      lokasi_pasar: `Pasar ${lokasi_pasar}`
    };

    // Cek cell A1 sampai A3 untuk metadata
    for (let i = 1; i <= 3; i++) {
      const cellRef = `A${i}`;
      if (worksheet[cellRef] && worksheet[cellRef].v) {
        const titleMatch = worksheet[cellRef].v.match(/Bulan (\w+) (\d{4})/);
        if (titleMatch) {
          metadata.bulan = titleMatch[1];
          metadata.tahun = parseInt(titleMatch[2]);
          break;
        }
      }
    }

    // Fungsi untuk mendapatkan jumlah hari dalam bulan
    function getDaysInMonth(monthName, year) {
      const monthNumbers = {
        'Januari': 0, 'Februari': 1, 'Maret': 2, 'April': 3,
        'Mei': 4, 'Juni': 5, 'Juli': 6, 'Agustus': 7,
        'September': 8, 'Oktober': 9, 'November': 10, 'Desember': 11
      };
      const monthIndex = monthNumbers[monthName];
      return new Date(year, monthIndex + 1, 0).getDate();
    }

    const daysInMonth = getDaysInMonth(metadata.bulan, metadata.tahun);

    // Generate periode mingguan berdasarkan tanggal awal yang dipilih
    function generateWeeklyPeriods(startDay, daysInMonth, bulan) {
      const periods = [];
      let currentDay = startDay;
      let weekNumber = 1;

      while (currentDay <= daysInMonth) {
        const endDay = Math.min(currentDay + 6, daysInMonth);
        periods.push({
          minggu: weekNumber,
          start: currentDay,
          end: endDay,
          periode: `${currentDay}-${endDay} ${bulan}`
        });
        currentDay = endDay + 1;
        weekNumber++;
      }
      return periods;
    }

    // Format data dengan periode mingguan yang benar
    const formattedData = rawData.map(row => {
      const harga_harian = {};
      const harga_mingguan = {};

      // Hanya ambil data mulai dari tanggal yang dipilih
      for (let i = startDay; i <= daysInMonth; i++) {
        harga_harian[i.toString()] = row[i.toString()] || "0";
      }

      // Hitung data mingguan
      const weeklyPeriods = generateWeeklyPeriods(startDay, daysInMonth, metadata.bulan);
      weeklyPeriods.forEach(period => {
        let total = 0;
        let count = 0;

        for (let day = period.start; day <= period.end; day++) {
          const price = parseFloat(harga_harian[day.toString()]?.replace(/\./g, '') || "0");
          if (price > 0) {
            total += price;
            count++;
          }
        }

        const avgPrice = count > 0 ? (total / count).toFixed(2) : "0";

        harga_mingguan[`minggu_${period.minggu}`] = {
          periode: period.periode,
          rata_rata: avgPrice
        };
      });

      return {
        Komoditas: row.Komoditas,
        harga_harian,
        harga_mingguan,
        Terendah: calculateTerendah(harga_harian),
        Tertinggi: calculateTertinggi(harga_harian),
        "Rata-rata": calculateRataRata(harga_harian)
      };
    });

    // Update metadata dengan format yang diminta
    const monthNumber = getMonthNumber(metadata.bulan);
    metadata = {
      timestamp: `${metadata.tahun}-${String(monthNumber + 1).padStart(2, '0')}-${String(startDay).padStart(2, '0')}`,
      start: `${String(startDay).padStart(2, '0')} ${metadata.bulan} ${metadata.tahun}`,
      end: `${String(daysInMonth).padStart(2, '0')} ${metadata.bulan} ${metadata.tahun}`,
      bulan: metadata.bulan,
      tahun: metadata.tahun,
      lokasi_pasar: metadata.lokasi_pasar,
      periode_mingguan: generateWeeklyPeriods(startDay, daysInMonth, metadata.bulan)
    };

    const jsonContent = {
      metadata,
      data: formattedData
    };

    // Simpan file dengan format nama yang sesuai
    const fileName = `data_${metadata.tahun}_${metadata.bulan}_${metadata.lokasi_pasar.replace('Pasar ', '')}.json`;
    const filePath = path.join(JSON_DIR, fileName);

    await fs.writeFile(filePath, JSON.stringify(jsonContent, null, 2));

    res.json({
      message: "File berhasil diupload dan dikonversi",
      fileName,
      metadata
    });

  } catch (error) {
    console.error('Terjadi kesalahan:', error);
    res.status(500).json({
      message: "Terjadi kesalahan dalam proses konversi dan penyimpanan file",
      error: error.message
    });
  }
};

export const getData = async (req, res) => {
  try {
    const { date } = req.query; // Format: "2024-08"
    const files = await fs.readdir(JSON_DIR);

    // Definisikan nama bulan dalam bahasa Indonesia
    const monthNames = {
      'Januari': '01',
      'Februari': '02',
      'Maret': '03',
      'April': '04',
      'Mei': '05',
      'Juni': '06',
      'Juli': '07',
      'Agustus': '08',
      'September': '09',
      'Oktober': '10',
      'November': '11',
      'Desember': '12'
    };

    const groupedFiles = {};

    if (date) {
      // Logika filter untuk parameter `date` yang terdefinisi
      const [year, month] = date.split('-');
      const monthName = Object.keys(monthNames).find(key => monthNames[key] === month);

      if (!monthName) {
        throw new Error("Format bulan tidak valid");
      }

      let jsonFiles = await Promise.all(
        files
          .filter(file => {
            return file.includes(`data_${year}_${monthName}`) && file.endsWith('.json');
          })
          .map(async (file) => {
            const filePath = path.join(JSON_DIR, file);
            let data = await fs.readFile(filePath, 'utf-8');
            data = JSON.parse(data);
            return {
              fileName: file,
              timestamp: data.metadata.timestamp,
              path: filePath,
              location: data.metadata.lokasi_pasar
            };
          })
      );

      if (!jsonFiles.length > 0) {
        throw new Error(`Tidak ada data yang tersedia di ${date}`);
      }

      jsonFiles = { [date]: [...jsonFiles] };
      console.log({ jsonFiles, files });

      jsonFiles[date].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      res.json(jsonFiles);
    } else {
      // Logika untuk pengelompokan file jika `date` tidak terdefinisi
      for (const file of files) {
        if (file.endsWith('.json')) {
          const match = file.match(/data_(\d{4})_(\w+)_/);
          if (match) {
            const [, year, monthName] = match;
            const key = `${year}-${monthNames[monthName] || '00'}`;

            if (!groupedFiles[key]) {
              groupedFiles[key] = [];
            }

            const filePath = path.join(JSON_DIR, file);
            let data = await fs.readFile(filePath, 'utf-8');
            data = JSON.parse(data);

            groupedFiles[key].push({
              fileName: file,
              timestamp: data.metadata.timestamp,
              path: filePath,
              location: data.metadata.lokasi_pasar
            });
          }
        }
      }

      // Urutkan data di setiap grup berdasarkan timestamp
      Object.keys(groupedFiles).forEach(key => {
        groupedFiles[key].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      });

      res.json(groupedFiles);
    }
  } catch (error) {
    console.error('Terjadi kesalahan saat mengambil data:', error);
    res.status(500).json({
      message: "Terjadi kesalahan saat mengambil data",
      error: error.message
    });
  }
};


// export const getData = async (req, res) => {
//   try {
//     const { date } = req.query; // 2024-08
//     const files = await fs.readdir(JSON_DIR);

//     const jsonFiles = await Promise.all(
//       files
//         .filter(file => {
//           if (date) {
//             const [year, month] = date.split('-');
//             // Convert month number to name in Indonesian
//             const monthNames = {
//               '01': 'Januari',
//               '02': 'Februari',
//               '03': 'Maret',
//               '04': 'April',
//               '05': 'Mei',
//               '06': 'Juni',
//               '07': 'Juli',
//               '08': 'Agustus',
//               '09': 'September',
//               '10': 'Oktober',
//               '11': 'November',
//               '12': 'Desember'
//             };

//             const monthName = monthNames[month];
//             // Check if filename contains both year and month
//             return file.includes(`data_${year}_${monthName}`) && file.endsWith('.json');
//           }
//           return file.endsWith('.json');
//         })
//         .map(async (file) => {
//           const filePath = path.join(JSON_DIR, file);
//           let data = await fs.readFile(filePath, 'utf-8');
//           data = JSON.parse(data);
//           const stats = await fs.stat(filePath);
//           return {
//             fileName: file,
//             timestamp: data.metadata.timestamp,
//             path: filePath,
//             location: data.metadata.lokasi_pasar
//           };
//         })
//     );

//     jsonFiles.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
//     res.json(jsonFiles);
//   } catch (error) {
//     console.error('Terjadi kesalahan saat mengambil data:', error);
//     res.status(500).json({
//       message: "Terjadi kesalahan saat mengambil data",
//       error: error.message
//     });
//   }
// };

// Helper functions
function getMonthNumber(monthName) {
  const monthMap = {
    'Januari': 0,
    'Februari': 1,
    'Maret': 2,
    'April': 3,
    'Mei': 4,
    'Juni': 5,
    'Juli': 6,
    'Agustus': 7,
    'September': 8,
    'Oktober': 9,
    'November': 10,
    'Desember': 11
  };
  return monthMap[monthName] || 0;
}

function calculateKvh(price, average) {
  if (!price || !average) return 0;
  return parseFloat(((Math.abs(price - average) / average) * 100).toFixed(2));
}

// Helper functions for statistical calculations
function calculateAverage(prices) {
  if (prices.length === 0) return 0;
  return prices.reduce((sum, price) => sum + price, 0) / prices.length;
}

function calculateStandardDeviation(prices, average) {
  if (prices.length <= 1) return 0;
  const squaredDiffs = prices.map(price => Math.pow(price - average, 2));
  const sumSquaredDiffs = squaredDiffs.reduce((sum, diff) => sum + diff, 0);
  return Math.sqrt(sumSquaredDiffs / (prices.length - 1));
}

function calculateKVH(standardDeviation, average) {
  if (average === 0) return 0;
  return (standardDeviation / average) * 100;
}

function calculateWeeklyStats(weekPrices) {
  // Filter harga 0 sebelum perhitungan
  const validPrices = weekPrices.filter(price => price > 0);

  if (validPrices.length === 0) {
    return {
      avg: 0,
      sdv: 0,
      kvh: 0
    };
  }

  // Calculate Average (AVG)
  const avg = calculateAverage(validPrices);

  // Calculate Standard Deviation (SDV)
  const stdDev = calculateStandardDeviation(validPrices, avg);

  // Calculate KVH
  const kvh = calculateKVH(stdDev, avg);

  return {
    avg: Math.round(avg),
    sdv: parseFloat(stdDev.toFixed(2)),
    kvh: parseFloat(kvh.toFixed(2))
  };
}

// Fungsi helper untuk normalisasi string
function normalizeString(str) {
  if (!str) return '';
  return str.toLowerCase().trim();
}

function transformDataForPantau(jsonData) {
  if (!jsonData || !jsonData.metadata || !jsonData.data) {
    console.error('Invalid jsonData structure:', jsonData);
    return {
      type: "Minggu",
      location: "Unknown",
      startDate: "-",
      endDate: "-",
      countLength: 4,
      detail_bulan: Array(4).fill("-"),
      datas: []
    };
  }

  const { metadata, data } = jsonData;
  const weekCount = 4;
  const daysPerWeek = 7;

  // Ambil tanggal mulai dari metadata
  const startDay = parseInt(metadata.timestamp?.split('-')[2] || 1);

  // Format tanggal yang benar
  const startDate = `${startDay}-${metadata.bulan.substring(0, 3)}-${metadata.tahun}`;
  const endDate = `${new Date(metadata.tahun, getMonthNumber(metadata.bulan) + 1, 0).getDate()}-${metadata.bulan.substring(0, 3)}-${metadata.tahun}`;

  const transformedData = {
    type: "Minggu",
    location: metadata.lokasi_pasar,
    startDate,
    endDate,
    countLength: weekCount,
    detail_bulan: Array(weekCount).fill(metadata.bulan),
    datas: []
  };

  // Map data komoditas
  transformedData.datas = KOMODITAS_LIST.map(komoditas => {
    const excelKomoditas = KOMODITAS_MAPPING[komoditas];
    const item = data.find(d =>
      normalizeString(d.Komoditas) === normalizeString(excelKomoditas)
    );

    if (!item) {
      return {
        Nama_pangan: komoditas,
        details: Array(weekCount).fill().map((_, i) => ({
          title: `Minggu ${i + 1}`,
          Avg_rupiah: 0,
          Kvh: 0
        }))
      };
    }

    // Hitung detail mingguan
    const details = [];
    for (let weekIndex = 0; weekIndex < weekCount; weekIndex++) {
      const weekKey = `minggu_${weekIndex + 1}`;
      const weekData = item.harga_mingguan?.[weekKey] || {};

      details.push({
        title: `Minggu ${weekIndex + 1}`,
        Avg_rupiah: parseFloat(weekData.rata_rata || 0),
        Kvh: parseFloat(weekData.kvh || 0)
      });
    }

    return {
      Nama_pangan: komoditas,
      details
    };
  });

  // Hitung rata-rata KVH mingguan
  transformedData.weeklyAverageKVH = Array(weekCount).fill(0).map((_, weekIndex) => {
    const validKvhValues = transformedData.datas
      .map(item => item.details[weekIndex]?.Kvh)
      .filter(kvh => !isNaN(kvh) && kvh > 0);

    return validKvhValues.length > 0
      ? parseFloat((validKvhValues.reduce((a, b) => a + b, 0) / validKvhValues.length).toFixed(2))
      : 0;
  });

  return transformedData;
}

// Export functions
export const getJsonContent = async (req, res) => {
  try {
    const { files } = req.body; // is Array now :)
    console.log({ files })

    let results = [];
    let countFile = 0;

    for (const fileName of files) {

      const filePath = path.join(JSON_DIR, fileName);
      console.log('Reading file:', filePath);

      const fileContent = await fs.readFile(filePath, 'utf-8');
      const jsonContent = JSON.parse(fileContent);
      // console.log('Raw JSON content:', jsonContent);

      // Pastikan data memiliki struktur yang benar
      if (!jsonContent || !jsonContent.metadata || !jsonContent.data) {
        throw new Error('Invalid JSON structure');
      }

      // Transform data untuk format yang dibutuhkan frontend
      const transformedData = {
        type: "Minggu",
        location: jsonContent.metadata.lokasi_pasar,
        startDate: jsonContent.metadata.start,
        endDate: jsonContent.metadata.end,
        countLength: 4,
        detail_bulan: Array(4).fill(jsonContent.metadata.bulan),
        datas: KOMODITAS_LIST.map(komoditas => {
          // Cari data komoditas yang sesuai
          const item = jsonContent.data.find(d =>
            normalizeString(d.Komoditas) === normalizeString(KOMODITAS_MAPPING[komoditas])
          );

          // Default structure jika data tidak ditemukan
          const defaultWeekData = {
            title: "",
            Avg_rupiah: 0,
            Kvh: 0
          };

          if (!item) {
            return {
              Nama_pangan: komoditas,
              details: Array(4).fill().map((_, i) => ({
                ...defaultWeekData,
                title: `Minggu ${i + 1}`
              }))
            };
          }

          // Generate data mingguan
          const details = [];
          for (let i = 1; i <= 4; i++) {
            const weekData = item.harga_mingguan?.[`minggu_${i}`] || {};
            details.push({
              title: `Minggu ${i}`,
              Avg_rupiah: parseFloat(weekData.rata_rata || 0),
              Kvh: parseFloat(weekData.kvh || 0)
            });
          }

          return {
            Nama_pangan: komoditas,
            details
          };
        })
      };

      // Hitung rata-rata KVH mingguan
      transformedData.weeklyAverageKVH = Array(4).fill(0).map((_, weekIndex) => {
        const validKvhValues = transformedData.datas
          .map(item => item.details[weekIndex]?.Kvh)
          .filter(kvh => !isNaN(kvh) && kvh > 0);

        return validKvhValues.length > 0
          ? parseFloat((validKvhValues.reduce((a, b) => a + b, 0) / validKvhValues.length).toFixed(2))
          : 0;
      });

      countFile++;
      results.push(transformedData);
      console.log(`Data ${countFile} : ${transformedData.datas[0]}`)
      // console.log('Transformed data:', transformedData);
    }

    console.log({ results, countFile })
    // results isinya array dari transformedData

    // TASK 1 : gmn caranya dari array yang ada di variabel result bisa dihitung rata - rata KVH nya dan harganya

    // TASK 2 : kirim ke fe ('kirim hasil response nya aja. kl udh ak coba integrasiin di fe')
    // res.json(transformedData);


  } catch (error) {
    console.error('Error in getJsonContent:', error);
    // Kirim response error yang lebih informatif
    res.status(500).json({
      type: "Minggu",
      location: "Error",
      startDate: "-",
      endDate: "-",
      countLength: 4,
      detail_bulan: Array(4).fill("-"),
      datas: KOMODITAS_LIST.map(komoditas => ({
        Nama_pangan: komoditas,
        details: Array(4).fill().map((_, i) => ({
          title: `Minggu ${i + 1}`,
          Avg_rupiah: 0,
          Kvh: 0
        }))
      })),
      weeklyAverageKVH: Array(4).fill(0),
      error: error.message
    });
  }
};

export const getWeeklyData = async (req, res) => {
  try {
    const { fileName } = req.params;
    const filePath = path.join(JSON_DIR, fileName);

    const fileContent = await fs.readFile(filePath, 'utf-8');
    const jsonContent = JSON.parse(fileContent);

    // Menggunakan fungsi transformDataForPantau yang sudah ada
    const transformedData = transformDataForPantau(jsonContent);

    res.json(transformedData);
  } catch (error) {
    console.error('Terjadi kesalahan:', error);
    res.status(500).json({
      message: "Terjadi kesalahan dalam proses pengambilan data mingguan",
      error: error.message
    });
  }
};

export const getDetailedStats = async (req, res) => {
  try {
    const { fileName } = req.params;
    const filePath = path.join(JSON_DIR, fileName);
    const fileContent = await fs.readFile(filePath, 'utf-8');
    const jsonContent = JSON.parse(fileContent);

    const detailedStats = calculateDetailedStats(jsonContent);
    res.json(detailedStats);
  } catch (error) {
    console.error('Terjadi kesalahan:', error);
    res.status(500).json({
      message: "Terjadi kesalahan dalam mengambil statistik detail",
      error: error.message
    });
  }
};

function calculateDetailedStats(jsonContent) {
  const { metadata, data } = jsonContent;
  const weekCount = 4;
  const daysPerWeek = 7;

  return {
    type: "Minggu",
    metadata: {
      bulan: metadata.bulan,
      tahun: metadata.tahun
    },
    weeklyStats: Array.from({ length: weekCount }, (_, weekIndex) => {
      const weekStart = weekIndex * daysPerWeek + 1;
      const weekEnd = Math.min(weekStart + 6, 30);

      return {
        weekNumber: weekIndex + 1,
        period: `${weekStart} - ${weekEnd} ${metadata.bulan}`,
        commodities: data.map(item => {
          const weekPrices = Object.entries(item.harga_harian)
            .filter(([day, price]) => {
              const dayNum = parseInt(day);
              const priceNum = parseFloat(String(price).replace(/\./g, ''));
              return dayNum >= weekStart &&
                dayNum <= weekEnd &&
                priceNum > 0; // Hanya ambil harga yang lebih dari 0
            })
            .map(([_, price]) => parseFloat(price.replace(/\./g, '')));

          // Hitung statistik
          const avg = weekPrices.length > 0
            ? weekPrices.reduce((sum, price) => sum + price, 0) / weekPrices.length
            : 0;

          const squaredDiffs = weekPrices.map(price => Math.pow(price - avg, 2));
          const sumSquaredDiffs = squaredDiffs.reduce((sum, diff) => sum + diff, 0);
          const stdDev = weekPrices.length > 1
            ? Math.sqrt(sumSquaredDiffs / (weekPrices.length - 1))
            : 0;

          const kvh = avg > 0 ? (stdDev / avg) * 100 : 0;

          return {
            komoditas: item.Komoditas,
            harga_harian: weekPrices,
            statistik: {
              avg: Math.round(avg),
              sdv: parseFloat(stdDev.toFixed(2)),
              kvh: parseFloat(kvh.toFixed(2))
            }
          };
        }),
        averageKVH: parseFloat(
          ((() => {
            // Filter komoditas yang memiliki data valid untuk minggu ini
            const validCommodities = data.filter(item => {
              const weekPrices = Object.entries(item.harga_harian)
                .filter(([day, price]) => {
                  const dayNum = parseInt(day);
                  const priceNum = parseFloat(String(price).replace(/\./g, ''));
                  return dayNum >= weekStart &&
                    dayNum <= weekEnd &&
                    priceNum > 0;
                });
              return weekPrices.length > 0;
            });

            // Jika tidak ada komoditas valid, return 0
            if (validCommodities.length === 0) return 0;

            // Hitung KVH hanya untuk komoditas yang valid
            const validKvhValues = validCommodities
              .map(item => {
                const weekPrices = Object.entries(item.harga_harian)
                  .filter(([day, price]) => {
                    const dayNum = parseInt(day);
                    const priceNum = parseFloat(String(price).replace(/\./g, ''));
                    return dayNum >= weekStart && dayNum <= weekEnd && priceNum > 0;
                  })
                  .map(([_, price]) => parseFloat(price.replace(/\./g, '')));

                const avg = weekPrices.reduce((sum, price) => sum + price, 0) / weekPrices.length;
                const squaredDiffs = weekPrices.map(price => Math.pow(price - avg, 2));
                const sumSquaredDiffs = squaredDiffs.reduce((sum, diff) => sum + diff, 0);
                const stdDev = Math.sqrt(sumSquaredDiffs / (weekPrices.length - 1));
                return (stdDev / avg) * 100;
              })
              .filter(kvh => kvh > 0);

            // Hitung rata-rata KVH dari nilai yang valid
            return validKvhValues.reduce((sum, kvh) => sum + kvh, 0) / validKvhValues.length;
          })()).toFixed(2)
        )
      };
    }),
    monthlyStats: data.map(item => {
      const allPrices = Object.values(item.harga_harian)
        .filter(price => price !== null)
        .map(price => parseFloat(price.replace(/\./g, '')));

      const avg = allPrices.length > 0
        ? allPrices.reduce((sum, price) => sum + price, 0) / allPrices.length
        : 0;

      const squaredDiffs = allPrices.map(price => Math.pow(price - avg, 2));
      const sumSquaredDiffs = squaredDiffs.reduce((sum, diff) => sum + diff, 0);
      const stdDev = allPrices.length > 1
        ? Math.sqrt(sumSquaredDiffs / (allPrices.length - 1))
        : 0;

      const kvh = avg > 0 ? (stdDev / avg) * 100 : 0;

      return {
        komoditas: item.Komoditas,
        statistik: {
          avg: Math.round(avg),
          sdv: parseFloat(stdDev.toFixed(2)),
          kvh: parseFloat(kvh.toFixed(2))
        }
      };
    })
  };
}

// Helper function untuk menghitung rata-rata antar pasar
function calculateAverageAcrossMarkets(allData) {
  if (allData.length === 0) return null;

  const firstData = allData[0];
  const result = {
    metadata: { ...firstData.metadata },
    data: []
  };

  // Untuk setiap komoditas
  firstData.data.forEach(item => {
    const komoditas = item.Komoditas;
    const avgData = {
      Komoditas: komoditas,
      harga_harian: {},
      Terendah: "0",
      Tertinggi: "0",
      "Rata-rata": "0"
    };

    // Hitung rata-rata harian
    Object.keys(item.harga_harian).forEach(day => {
      const prices = allData
        .map(marketData => {
          const komoditasData = marketData.data.find(d => d.Komoditas === komoditas);
          return parseFloat(komoditasData?.harga_harian[day]?.replace(/\./g, '') || "0");
        })
        .filter(price => price > 0);

      if (prices.length > 0) {
        const avg = prices.reduce((a, b) => a + b, 0) / prices.length;
        avgData.harga_harian[day] = avg.toFixed(2);
      }
    });

    result.data.push(avgData);
  });

  return result;
}

// Helper function untuk menghitung harga terendah
function calculateTerendah(harga_harian) {
  const validPrices = Object.values(harga_harian)
    .map(price => parseFloat(String(price).replace(/\./g, '')))
    .filter(price => price > 0);

  return validPrices.length > 0
    ? Math.min(...validPrices).toString()
    : "0";
}

// Helper function untuk menghitung harga tertinggi
function calculateTertinggi(harga_harian) {
  const validPrices = Object.values(harga_harian)
    .map(price => parseFloat(String(price).replace(/\./g, '')))
    .filter(price => price > 0);

  return validPrices.length > 0
    ? Math.max(...validPrices).toString()
    : "0";
}

// Helper function untuk menghitung rata-rata harga
function calculateRataRata(harga_harian) {
  const validPrices = Object.values(harga_harian)
    .map(price => parseFloat(String(price).replace(/\./g, '')))
    .filter(price => price > 0);

  return validPrices.length > 0
    ? (validPrices.reduce((a, b) => a + b, 0) / validPrices.length).toFixed(2)
    : "0";
}

// Helper function untuk menghitung KVH mingguan
function calculateWeeklyKvh(prices) {
  if (!prices || prices.length < 2) return "0";

  const validPrices = prices.filter(price => price > 0);
  if (validPrices.length < 2) return "0";

  const avg = validPrices.reduce((a, b) => a + b, 0) / validPrices.length;
  const variance = validPrices.reduce((sum, p) => sum + Math.pow(p - avg, 2), 0) / (validPrices.length - 1);
  const stdDev = Math.sqrt(variance);

  return ((stdDev / avg) * 100).toFixed(2);
} 