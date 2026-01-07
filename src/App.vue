<template>
  <div class="page">
    <div class="container">

      <!-- Header -->
      <h1 class="title">Outlet</h1>

      <!-- Outlet -->
      <div class="outlet">
        <!-- DROPDOWN -->
        <div class="outlet-wrapper">
          <span class="outlet-icon">
            <!-- Shop Icon -->
            <svg viewBox="0 0 24 24" width="18" height="18">
              <path
                fill="currentColor"
                d="M16 6V4a4 4 0 0 0-8 0v2H4v2h1l1.6 10.4A2 2 0 0 0 8.6 20h6.8a2 2 0 0 0 2-1.6L19 8h1V6h-4z"
              />
            </svg>
          </span>

          <select
            class="outlet-input with-icon"
            v-model="selectedOutlet"
            @change="handleOutletChange"
          >
            <option value="kopi-anak-bangsa">Kopi Anak Bangsa</option>
            <option value="custom">Lainnya (Custom API)</option>
          </select>
        </div>

        <!-- CUSTOM API URL (SHOW / HIDE) -->
        <input
          v-if="selectedOutlet === 'custom'"
          class="outlet-input api-input"
          v-model="apiUrl"
          placeholder="Masukkan API URL"
          autofocus
        />
      </div>

      <!-- EMPTY STATE -->
      <div v-if="items.length === 0" class="empty-card">
        <img src="/empty.png" class="empty-image" />
        <h2>Belum Ada Diskon</h2>
        <p>
          Silahkan tambah diskon untuk menarik pelanggan dan
          meningkatkan penjualan.
        </p>
        <button class="btn-green" @click="showModal = true">
          + Tambah diskon
        </button>
      </div>
      <!-- TABLE STATE -->
      <div v-else class="table-card">
        <div class="table-header">
          <div>
            <h2>
              Daftar Diskon<br>
              <span class="count">Total jumlah diskon : {{ filteredItems.length }}</span>
            </h2>
          </div>

          <div class="table-actions">
            <input
              class="search-input"
              v-model="keyword"
              placeholder="Cari nama atau nilai diskon..."
            />

            <button class="btn-green" @click="showModal = true">
              + Tambah diskon
            </button>
          </div>
        </div>

        <div class="table-wrapper">
          <table class="table">
            <thead>
              <tr>
                <!-- Header kosong untuk kolom checkbox -->
                <th>&nbsp;</th>
                <th class="sortable" @click="sortBy('nama')">
                  Nama Diskon
                  <span v-if="sortKey === 'nama'">
                    {{ sortOrder === 'asc' ? '▲' : '▼' }}
                  </span>
                </th>

                <th class="sortable" @click="sortBy('nilai')">
                  Nilai Diskon
                  <span v-if="sortKey === 'nilai'">
                    {{ sortOrder === 'asc' ? '▲' : '▼' }}
                  </span>
                </th>

                <th>&nbsp;</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="d in filteredItems" :key="d._id">
                <td>
                  <input type="checkbox" v-model="d.selected" />
                </td>
                <td>{{ d.nama }}</td>
                <td>
                  <span v-if="d.tipe === 'persen'">
                    {{ formatDiskon(d.nilai, d.tipe) }}
                  </span>
                  <span v-else>
                    Rp {{ formatDiskon(d.nilai, d.tipe) }}
                  </span>
                </td>
                <td class="action-cell">
                  <button class="icon-btn" title="Edit" @click="openEdit(d)">
                    <!-- Pencil Icon -->
                    <svg viewBox="0 0 24 24" width="16" height="16">
                      <path
                        fill="currentColor"
                        d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a.9959.9959 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"
                      />
                    </svg>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>  
      </div>


      <!-- MODAL -->
      <div v-if="showModal" class="modal-backdrop">
        <div class="modal">
          <div class="modal-header">
            <h3>{{ isEdit ? "Edit Diskon" : "Tambah Diskon" }}</h3>
            <button class="close" @click="showModal=false; resetForm()">×</button>
          </div>

          <label>Nama Diskon</label>
          <input
            class="input"
            v-model="nama"
            placeholder="Misal: Diskon opening, diskon akhir tahun"
          />

          <label>Diskon</label>
          <div class="discount-row">
            <input class="input" type="number" v-model.number="nilai" />
            <button class="toggle-single" @click="toggleTipe">
              {{ tipe === 'persen' ? '%' : 'Rp' }}
            </button>
          </div>

          <div class="modal-footer">
            <button
              v-if="isEdit"
              class="btn-danger"
              :disabled="loading"
              @click="openDeleteFromModal"
            >
              {{ loading ? "Menghapus..." : "Hapus" }}
            </button>
            <div class="right-buttons">
              <button class="btn-outline" @click="showModal = false; resetForm()">
                Batal
              </button>

              <button
                class="btn-green"
                :disabled="loading"
                @click="simpan"
              >
                {{ loading ? "Menyimpan..." : (isEdit ? "Simpan" : "Simpan") }}
              </button>
            </div>  
          </div>
        </div>
      </div>

      <!-- MODAL KONFIRMASI DELETE -->
      <div v-if="showDelete" class="modal-backdrop">
        <div class="modal small">
          <h3>Hapus Diskon?</h3>
          <p>
            Diskon <strong>{{ selected?.nama }}</strong> akan dihapus.
            Tindakan ini tidak dapat dibatalkan.
          </p>

          <div class="modal-actions">
            <button class="btn-outline" @click="showDelete = false" 
              :disabled="loading">
              Batal
            </button>
            <button
              class="btn-danger"
              :disabled="loading"
              @click="confirmDelete"
            >
              {{ loading ? "Menghapus..." : "Hapus" }}
            </button>
          </div>
        </div>
      </div>

      <!-- TOAST -->
      <div v-if="toast.show" class="toast" :class="toast.type">
        {{ toast.message }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted, computed } from "vue"
import axios from "axios"

/* state */
const apiUrl = ref("")
const items = ref([])

const loading = ref(false)

const showModal = ref(false)
const nama = ref("")
const nilai = ref(0)
const tipe = ref("persen")

const showDelete = ref(false)
const selected = ref(null)

const isEdit = ref(false)
const editId = ref(null)

const isCustomOutlet = ref(false)

const hasLoaded = ref(false)

const sortKey = ref("nama")
const sortOrder = ref("asc")

const selectedOutlet = ref("kopi-anak-bangsa")

const handleOutletChange = () => {
  if (selectedOutlet.value === "kopi-anak-bangsa") {
    apiUrl.value = "https://crudcrud.com/api/2fb71609ba534be6bea1428adf272306/discount"
  }

  if (selectedOutlet.value === "custom") {
    apiUrl.value = ""
  }
}

const openDeleteFromModal = () => {
  showModal.value = false
  showDelete.value = true
}

const sortBy = (key) => {
  if (sortKey.value === key) {
    // toggle asc / desc
    sortOrder.value = sortOrder.value === "asc" ? "desc" : "asc"
  } else {
    sortKey.value = key
    sortOrder.value = "asc"
  }
}

const formatDiskon = (nilai, tipe) => {
  if (tipe === "persen") {
    return `${nilai} %`
  }

  return new Intl.NumberFormat("id-ID").format(nilai)
}

const toggleTipe = () => {
  tipe.value = tipe.value === "persen" ? "rp" : "persen"
}

/* load data */
const loadData = async () => {
  if (!apiUrl.value) return
  loading.value = true

  try {
    const res = await axios.get(apiUrl.value)
    items.value = Array.isArray(res.data) ? res.data : []

    if (items.value.length === 0 && hasLoaded.value) {
      showToast("Belum ada data diskon")
    }
  } catch (e) {
    console.error(e)

    if (!e.response) {
      // CORS / Network / Blocked
      showToast("Tidak dapat terhubung ke server")
    } else {
      showToast("Gagal memuat data", "error")
    }
  } finally {
    loading.value = false
  }
}

/* simpan */
const simpan = async () => {
  if (loading.value) return
  loading.value = true

  try {
    if (isEdit.value) {
      // 1. HAPUS DATA LAMA
      await axios.delete(`${apiUrl.value}/${editId.value}`)

      // 2. BUAT DATA BARU
      await axios.post(apiUrl.value, {
        nama: nama.value,
        nilai: Number(nilai.value),
        tipe: tipe.value
      })

      showToast("Diskon berhasil diperbarui")
    } else {
      // CREATE
      await axios.post(apiUrl.value, {
        nama: nama.value,
        nilai: Number(nilai.value),
        tipe: tipe.value
      })

      showToast("Diskon berhasil ditambahkan")
    }

    showModal.value = false
    resetForm()
    loadData()
  } catch (e) {
    console.error(e)
    if (!e.response) {
      // CORS / Network / Blocked
      showToast("Tidak dapat terhubung ke server")
    } else {
      showToast("Gagal menyimpan diskon", "error")
    }
  } finally {
    loading.value = false
  }
}

/* edit */
const openEdit = (d) => {
  isEdit.value = true
  editId.value = d._id
  selected.value = d 
  nama.value = d.nama
  nilai.value = d.nilai
  tipe.value = d.tipe
  showModal.value = true
}

/* hapus */
const hapus = async (id) => {
  const item = items.value.find(i => i._id === id)
  if (!item) return
  await axios.delete(item._self)
  loadData()
}

/* buka modal */
const openDelete = (item) => {
  selected.value = item
  showDelete.value = true
}

/* confirm delete */
const confirmDelete = async () => {
  if (!selected.value || loading.value) {
    console.warn("Delete blocked:", selected.value, loading.value)
    return
  }

  loading.value = true

  try {
    await axios.delete(`${apiUrl.value}/${selected.value._id}`)
    showToast("Diskon berhasil dihapus")
    showDelete.value = false
    resetForm()
    loadData()
  } catch (e) {
    console.error(e)
    showToast("Gagal menghapus diskon", "error")
  } finally {
    loading.value = false
  }
}

const resetForm = () => {
  nama.value = ""
  nilai.value = 0
  tipe.value = "persen"
  isEdit.value = false
  editId.value = null
}

const keyword = ref("")

const filteredItems = computed(() => {
  let data = [...items.value]

  // FILTER
  if (keyword.value) {
    const q = keyword.value.toLowerCase()
    data = data.filter(d =>
      d.nama.toLowerCase().includes(q) ||
      String(d.nilai).includes(q)
    )
  }

  // SORT
  if (sortKey.value) {
    data.sort((a, b) => {
      let valA = a[sortKey.value]
      let valB = b[sortKey.value]

      if (sortKey.value === "nama") {
        valA = valA.toLowerCase()
        valB = valB.toLowerCase()
      }

      if (valA < valB) return sortOrder.value === "asc" ? -1 : 1
      if (valA > valB) return sortOrder.value === "asc" ? 1 : -1
      return 0
    })
  }

  return data
})

const toast = ref({
  show: false,
  message: "",
  type: "success" // success | error | info
})

let toastTimer = null

const showToast = (message, type = "success") => {
  if (toastTimer) clearTimeout(toastTimer)

  toast.value = { show: true, message, type }

  toastTimer = setTimeout(() => {
    toast.value.show = false
  }, 3000)
}

const handleEsc = (e) => {
  if (e.key === "Escape") {
    showModal.value = false
    showDelete.value = false
  }
}

onMounted(() => {
  window.addEventListener("keydown", handleEsc)
})

onUnmounted(() => {
  window.removeEventListener("keydown", handleEsc)
})

/* WATCH DI SINI */
watch(apiUrl, loadData)
</script>